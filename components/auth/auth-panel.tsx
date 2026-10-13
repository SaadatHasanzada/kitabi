import type { ComponentProps } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const authPanelVariants = cva(
  "flex flex-1 flex-col max-w-200 py-8 md:px-10 desktop:px-20 desktop:pb-14",
  {
    variants: {
      variant: {
        form: "gap-3 px-4",
        showcase:
          "relative min-h-122 overflow-hidden bg-accent px-5 desktop:justify-center",
      },
    },
    defaultVariants: {
      variant: "form",
    },
  },
);

type AuthPanelProps = ComponentProps<"section"> &
  VariantProps<typeof authPanelVariants>;

export function AuthPanel({ className, variant, ...props }: AuthPanelProps) {
  return (
    <section
      data-slot="auth-panel"
      className={cn(authPanelVariants({ variant }), className)}
      {...props}
    />
  );
}
