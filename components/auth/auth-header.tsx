import type { ReactNode } from "react";
import { useTranslations } from "next-intl";

import { MutedText } from "@/components/ui/muted-text";
import { cn } from "@/lib/utils";

interface AuthHeaderProps {
  readonly title: string;
  readonly description: string;
  readonly eyebrow?: string;
  readonly size?: "default" | "lg";
  readonly values?: Record<string, string>;
}

function emphasis(chunks: ReactNode) {
  return <span className="font-medium text-foreground">{chunks}</span>;
}

export function AuthHeader({
  eyebrow,
  title,
  description,
  size = "default",
  values,
}: AuthHeaderProps) {
  const t = useTranslations("Auth");
  const lg = size === "lg";

  return (
    <div>
      {eyebrow && (
        <span
          className={cn(
            "font-logo inline-block text-primary",
            lg ? "text-[32px]" : "text-[24px]",
          )}
        >
          {t(eyebrow)}
        </span>
      )}
      <h1
        className={cn(
          "font-bold text-brand mb-2 leading-[1.06] tracking-[-0.04em]",
          lg ? "text-[40px]" : "text-[32px]",
        )}
      >
        {t(title)}
      </h1>
      <MutedText className={cn(lg && "text-[18px]")}>
        {t.rich(description, {
          ...values,
          b: emphasis,
        })}
      </MutedText>
    </div>
  );
}
