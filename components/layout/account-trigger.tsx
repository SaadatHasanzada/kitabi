import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";

import { UserAvatar } from "@/components/layout/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccountTriggerProps extends ComponentProps<typeof Button> {
  avatarText?: string | null;
  avatarPhoto?: string | null;
}

export function AccountTrigger({
  avatarText,
  avatarPhoto,
  className,
  ...props
}: Readonly<AccountTriggerProps>) {
  const t = useTranslations("Nav");

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label={t("accountMenu")}
      className={cn(
        "size-12 rounded-full p-0 transition-shadow hover:bg-transparent hover:shadow-halo aria-expanded:bg-transparent",
        className,
      )}
      {...props}
    >
      <UserAvatar text={avatarText} photo={avatarPhoto} />
    </Button>
  );
}
