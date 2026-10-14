import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { AuthHeader } from "@/components/auth/auth-header";
import { MutedText } from "@/components/ui/muted-text";
import { cn } from "@/lib/utils";

interface AuthStatusProps {
  readonly icon: ReactNode;
  readonly iconClassName?: string;
  readonly title: string;
  readonly description: string;
  readonly eyebrow?: string;
  readonly values?: Record<string, string>;
  readonly hint?: string;
  readonly children?: ReactNode;
}

export function AuthStatus({
  icon,
  iconClassName,
  hint,
  children,
  ...header
}: AuthStatusProps) {
  const t = useTranslations("Auth");

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "flex size-16  items-center justify-center rounded-full bg-secondary text-brand [&_svg]:size-7",
          iconClassName,
        )}
      >
        {icon}
      </div>
      <AuthHeader size="lg" {...header} />
      {hint && <MutedText size="sm">{t(hint)}</MutedText>}
      {children && (
        <div className="flex flex-col desktop:flex-row gap-3 mt-6">
          {children}
        </div>
      )}
    </div>
  );
}
