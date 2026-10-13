"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect as externalRedirect } from "next/navigation";
import { hasLocale, Locale } from "next-intl";
import { getLocale } from "next-intl/server";

import { isAuthApiError, isAuthWeakPasswordError } from "@supabase/supabase-js";

import { redirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  LoginValues,
  registerSchema,
  RegisterValues,
} from "@/lib/validation/auth";

export type AuthState = { errorKey?: string; ok?: string } | null;

function resolveSignUpErrorKey(error: unknown): string {
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
      return { errorKey: resolveSignUpErrorKey(error) };
    }

    return { ok: "checkEmail" };
  } catch (error) {
    return { errorKey: resolveSignUpErrorKey(error) };
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

export async function signOut() {
  const supabase = await createClient();
  const locale = await getLocale();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect({ href: "/", locale });
}
