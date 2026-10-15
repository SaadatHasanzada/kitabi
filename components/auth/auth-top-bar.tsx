import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

interface AuthTopBarProps {
  readonly className?: string;
}

export function AuthTopBar({ className }: AuthTopBarProps) {
  return (
    <div className={cn("flex justify-between items-center", className)}>
      <Logo />
      <LocaleSwitcher />
    </div>
  );
}
