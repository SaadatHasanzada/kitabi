"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect as externalRedirect } from "next/navigation";
import { hasLocale, Locale } from "next-intl";

import { isAuthApiError, isAuthWeakPasswordError } from "@supabase/supabase-js";

import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  LoginValues,
  registerSchema,
  RegisterValues,
  resetPasswordSchema,
  ResetPasswordValues,
  updatePasswordSchema,
  UpdatePasswordValues,
} from "@/lib/validation/auth";

export type AuthState = {
  errorKey?: string;
  ok?: string;
  email?: string;
} | null;

function resolveAuthErrorKey(error: unknown): string {
  if (isAuthWeakPasswordError(error)) return "passwordRejected";
  if (isAuthApiError(error) && error.code === "over_email_send_rate_limit")
    return "tooManyRequests";
  return "genericError";
}

function resolveSignInErrorKey(code: string | undefined): string {
  if (code === "invalid_credentials") return "invalidCredentials";
  if (code === "email_not_confirmed") return "emailNotConfirmed";
  if (code === "over_request_rate_limit") return "tooManyAttempts";
  return "genericError";
}

export async function login(
  _p: AuthState,
  values: LoginValues & { locale: Locale },
): Promise<AuthState> {
  const supabase = await createClient();
  const locale = hasLocale(routing.locales, values.locale)
    ? values.locale
    : routing.defaultLocale;

  const parsed = loginSchema.safeParse(values);
  if (!parsed.success) {
    return { errorKey: "genericError" };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { errorKey: resolveSignInErrorKey(error.code) };
  }

  revalidatePath("/", "layout");
  return redirect({ href: "/my-books", locale });
}

export async function register(
  _p: AuthState,
  values: RegisterValues & { locale: Locale },
): Promise<AuthState> {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const locale = hasLocale(routing.locales, values.locale)
    ? values.locale
    : routing.defaultLocale;

  const parsed = registerSchema.safeParse(values);
  if (!parsed.success) {
    return { errorKey: "genericError" };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { display_name: parsed.data.displayName },
        emailRedirectTo: `${origin}/${locale}/my-books`,
      },
    });

    const isEmailInUse = data.user?.identities?.length === 0;

    if (isEmailInUse) {
      return { errorKey: "emailInUse" };
    }

    if (error) {
      return { errorKey: resolveAuthErrorKey(error) };
    }

    return { ok: "checkEmail" };
  } catch (error) {
    return { errorKey: resolveAuthErrorKey(error) };
  }
}

export async function signInWithGoogle(locale: Locale) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback?next=/${locale}/my-books`,
    },
  });

  if (data?.url) externalRedirect(data.url);
}

export async function signOut(value: string) {
  const locale = hasLocale(routing.locales, value)
    ? value
    : routing.defaultLocale;
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect({ href: "/", locale });
}

export async function resetPassword(
  _p: AuthState,
  values: ResetPasswordValues,
): Promise<AuthState> {
  const supabase = await createClient();

  const parsed = resetPasswordSchema.safeParse(values);
  if (!parsed.success) {
    return { errorKey: "genericError" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(
    parsed.data.email,
  );

  if (error) {
    return { errorKey: resolveAuthErrorKey(error) };
  }

  return { ok: "resetLinkSent", email: parsed.data.email };
}

export async function updatePassword(
  _p: AuthState,
  values: UpdatePasswordValues,
): Promise<AuthState> {
  const supabase = await createClient();

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { errorKey: "linkExpired" };

  const parsed = updatePasswordSchema.safeParse(values);

  if (!parsed.success) {
    return { errorKey: "genericError" };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    if (error.code === "same_password") return { errorKey: "samePassword" };
    return { errorKey: resolveAuthErrorKey(error) };
  }

  return { ok: "passwordUpdated" };
}
