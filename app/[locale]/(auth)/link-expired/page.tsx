import { getLocale, getTranslations } from "next-intl/server";

import { Clock } from "lucide-react";

import { AuthStatus } from "@/components/auth/auth-status";
import { StatusPanel } from "@/components/auth/status-panel";
import { buttonVariants } from "@/components/ui/button";
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
    <StatusPanel backToLogin>
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
    </StatusPanel>
  );
}
