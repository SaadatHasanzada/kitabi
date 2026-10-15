import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { ArrowLeft } from "lucide-react";

import { AuthPanel } from "@/components/auth/auth-panel";
import { AuthTopBar } from "@/components/auth/auth-top-bar";
import { TextLink } from "@/components/ui/text-link";

interface StatusPanelProps {
  readonly children: ReactNode;
  readonly backToLogin?: boolean;
}

export function StatusPanel({
  children,
  backToLogin = false,
}: StatusPanelProps) {
  const t = useTranslations("Auth");

  return (
    <AuthPanel className="relative overflow-hidden">
      <AuthTopBar className="relative z-10 mb-8" />
      <div className="max-w-130 flex flex-col gap-10 z-10">
        {children}
        {backToLogin && (
          <TextLink
            variant="emphasis"
            href="/login"
            className="inline-flex items-center gap-1.5 self-start"
          >
            <ArrowLeft className="size-4" />
            {t("backToLogin")}
          </TextLink>
        )}
      </div>

      <div className="absolute -right-30 -top-35 size-65 rounded-full bg-accent sm:-right-40 sm:size-115"></div>
      <div className="absolute -bottom-20 -left-17.5 size-35 rounded-full bg-secondary sm:size-55"></div>
    </AuthPanel>
  );
}
