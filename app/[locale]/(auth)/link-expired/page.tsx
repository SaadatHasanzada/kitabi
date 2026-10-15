import { getLocale, getTranslations } from "next-intl/server";

import { ArrowLeft, Clock } from "lucide-react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { AuthStatus } from "@/components/auth/auth-status";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { buttonVariants } from "@/components/ui/button";
import { TextLink } from "@/components/ui/text-link";
import { Link, redirect } from "@/i18n/navigation";
import { LINK_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default async function LinkExpiredPage({
  searchParams,
}: Readonly<{ searchParams: Promise<{ type?: string }> }>) {
  const { type } = await searchParams;

  if (!type || !LINK_TYPES.has(type)) {
    redirect({ href: "/", locale: await getLocale() });
  }

  const t = await getTranslations("Auth");
  const isRecovery = type === "recovery";

  return (
    <AuthPanel className="relative overflow-hidden">
      <div className="flex justify-between items-center relative z-10 mb-8">
        <Logo />
        <LocaleSwitcher />
      </div>
      <div className="max-w-130 flex flex-col gap-10 z-10">
        <AuthStatus
          icon={<Clock />}
          iconClassName="bg-destructive/10 text-brand font-bold"
          title="linkExpiredTitle"
          description={
            isRecovery
              ? "resetLinkExpiredDescription"
              : "signupLinkExpiredDescription"
          }
        >
          <Link
            href={isRecovery ? "/reset-password" : "/register"}
            className={cn(buttonVariants({ size: "lg" }), "font-bold")}
          >
            {isRecovery ? t("sendNewLink") : t("signUpAgain")}
          </Link>
        </AuthStatus>
        <TextLink
          variant="emphasis"
          href="/login"
          className="inline-flex items-center gap-1.5 self-start"
        >
          <ArrowLeft className="size-4" />
          {t("backToLogin")}
        </TextLink>
      </div>

      <div className="absolute -right-30 -top-35 size-65 rounded-full bg-accent sm:-right-40 sm:size-115"></div>
      <div className="absolute -bottom-20 -left-17.5 size-35 rounded-full bg-secondary sm:size-55"></div>
    </AuthPanel>
  );
}
