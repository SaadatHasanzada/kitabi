"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Loader, LogOutIcon, SettingsIcon } from "lucide-react";

import { AccountTrigger } from "@/components/layout/account-trigger";
import { UserAvatar } from "@/components/layout/user-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MutedText } from "@/components/ui/muted-text";
import { signOut } from "@/lib/actions/auth";
import type { UserProfile } from "@/lib/auth";

export function AccountMenu({
  displayName,
  email,
  avatarText,
  avatarPhoto,
}: Readonly<UserProfile>) {
  const t = useTranslations("Nav");
  const ta = useTranslations("Auth");
  const locale = useLocale();
  const [isSigningOut, startSignOut] = useTransition();
  const name = displayName ?? t("reader");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <AccountTrigger avatarText={avatarText} avatarPhoto={avatarPhoto} />
        }
      />
      <DropdownMenuContent
        sideOffset={14}
        className="flex flex-col w-62.5 shadow-lg ring-brand/25 p-4 pb-2"
      >
        <div className="flex gap-3 items-center mb-4">
          <UserAvatar
            text={avatarText}
            photo={avatarPhoto}
            className="size-9 text-base border-none"
          />
          <div className="flex min-w-0 flex-col">
            <p className="truncate font-semibold" title={name}>
              {name}
            </p>
            {email && (
              <MutedText size="sm" truncate title={email}>
                {email}
              </MutedText>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer py-2">
          <SettingsIcon />
          {t("settings")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer py-2 "
          variant="destructive"
          closeOnClick={false}
          disabled={isSigningOut}
          onClick={() => startSignOut(() => signOut(locale))}
        >
          {isSigningOut ? <Loader className="animate-spin" /> : <LogOutIcon />}
          {ta("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
