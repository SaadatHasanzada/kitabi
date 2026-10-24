import { useTranslations } from "next-intl";

import { UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  readonly text?: string | null;
  readonly photo?: string | null;
  readonly className?: string;
}

export function UserAvatar({ text, photo, className }: UserAvatarProps) {
  const t = useTranslations("Nav");

  return (
    <Avatar
      className={cn(
        "size-12 border border-brand bg-secondary text-xl font-bold text-brand after:hidden",
        className,
      )}
    >
      {photo && (
        <AvatarImage
          src={photo}
          alt={t("profilePhoto")}
          referrerPolicy="no-referrer"
        />
      )}
      <AvatarFallback className="bg-transparent text-[length:inherit] text-inherit">
        {text ?? <UserRound className="size-1/2" />}
      </AvatarFallback>
    </Avatar>
  );
}
