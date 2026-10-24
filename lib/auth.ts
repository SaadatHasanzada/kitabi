import { cache } from "react";
import type { Locale } from "next-intl";
import { getLocale } from "next-intl/server";

import type { JwtPayload } from "@supabase/supabase-js";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { getFirstLetterUppercase } from "@/lib/utils";

export interface UserProfile {
  displayName?: string;
  email?: string;
  avatarText: string | null;
  avatarPhoto?: string;
}

export const getAuthContext = cache(async () => {
  const supabase = await createClient();
  const locale = await getLocale();

  const { data } = await supabase.auth.getClaims();

  return { claims: data?.claims, locale };
});

export function getUserProfile(
  claims: JwtPayload,
  locale: Locale,
): UserProfile {
  const meta = claims.user_metadata ?? {};
  const displayName: string | undefined =
    (meta.display_name || meta.name || meta.full_name)?.trim() || undefined;
  const email = claims.email;

  return {
    displayName,
    email,
    avatarText: getFirstLetterUppercase(displayName || email, locale),
    avatarPhoto: meta.avatar_url || undefined,
  };
}

export async function requireUser(redirectTo?: string) {
  const { claims, locale } = await getAuthContext();
  const redirectUrl = redirectTo ?? "/login";

  if (!claims) {
    return redirect({ href: redirectUrl, locale });
  }

  return claims;
}

export async function requireGuest() {
  const { claims, locale } = await getAuthContext();

  if (claims) {
    return redirect({ href: "/my-books", locale });
  }
}
