"use client";

import { startTransition, useActionState } from "react";
import { useTranslations } from "next-intl";

import { Check } from "lucide-react";

import { AuthHeader } from "@/components/auth/auth-header";
import { AuthStatus } from "@/components/auth/auth-status";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { updatePassword } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import type { UpdatePasswordValues } from "@/lib/validation/auth";

export function UpdatePasswordFlow() {
  const t = useTranslations("Auth");
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  function savePassword(values: UpdatePasswordValues) {
    startTransition(() => formAction(values));
  }

  if (state?.ok) {
    return (
      <AuthStatus
        icon={<Check />}
        iconClassName="bg-accent text-success"
        title="passwordUpdated"
        description="passwordUpdatedDescription"
      >
        <Link
          href="/my-books"
          className={cn(buttonVariants({ size: "lg" }), "font-bold")}
        >
          {t("goToMyBooks")}
        </Link>
      </AuthStatus>
    );
  }

  return (
    <>
      <AuthHeader
        size="lg"
        eyebrow="almostBackOnShelf"
        title="chooseNewPassword"
        description="updatePasswordDescription"
      />
      <UpdatePasswordForm
        state={state}
        formAction={savePassword}
        isPending={isPending}
      />
    </>
  );
}
