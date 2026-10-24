import type { ComponentProps } from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const mutedTextVariants = cva("text-foreground/60", {
  variants: {
    size: {
      // Supporting copy under a heading.
      default: "text-[15px] leading-[1.55]",
      // Attribution lines, footnotes.
      sm: "text-sm",
      // Divider labels and other uppercase micro-copy.
      xs: "text-xs font-bold",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type MutedTextProps = ComponentProps<"p"> &
  VariantProps<typeof mutedTextVariants> & {
    /** Render as a different element — `span` inside a line of text. */
    readonly as?: "p" | "span";
  };

export function MutedText({
  as: Component = "p",
  size,
  truncate,
  className,
  ...props
}: MutedTextProps) {
  return (
    <Component
      data-slot="muted-text"
      className={cn(mutedTextVariants({ size, truncate }), className)}
      {...props}
    />
  );
}

export { mutedTextVariants };
