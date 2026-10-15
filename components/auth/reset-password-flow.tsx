"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { Loader, MailCheck } from "lucide-react";

import { AuthHeader } from "@/components/auth/auth-header";
import { AuthStatus } from "@/components/auth/auth-status";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/actions/auth";
import { RESEND_COOLDOWN_SECONDS } from "@/lib/constants";
import type { ResetPasswordValues } from "@/lib/validation/auth";

export function ResetPasswordFlow() {
  const t = useTranslations("Auth");
  const [state, formAction, isPending] = useActionState(resetPassword, null);
  const [editing, setEditing] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const showSent = state?.ok && !editing;

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  let resendLabel = t("resendLink");
  if (isPending) resendLabel = t("sendingResetLink");
  else if (cooldown > 0) resendLabel = t("resendLinkIn", { seconds: cooldown });

  function sendLink(values: ResetPasswordValues) {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    startTransition(() => {
      setEditing(false);
      formAction(values);
    });
  }

  if (showSent) {
    return (
      <AuthStatus
        icon={<MailCheck />}
        iconClassName="bg-accent text-success"
        title="checkYourInbox"
        description="resetLinkSentDescription"
        values={{ email: state.email ?? "" }}
        hint="checkSpamHint"
      >
        <Button
          variant="outline"
          size="lg"
          disabled={isPending || cooldown > 0}
          className="text-brand hover:text-brand font-bold"
          onClick={() => sendLink({ email: state.email ?? "" })}
        >
          {isPending && <Loader className="animate-spin size-5" />}
          {resendLabel}
        </Button>
        <Button
          className="font-bold"
          size="lg"
          variant="link"
          onClick={() => setEditing(true)}
        >
          {t("useDifferentEmail")}
        </Button>
      </AuthStatus>
    );
  }

  return (
    <>
      <AuthHeader
        size="lg"
        eyebrow="happensToEveryReader"
        title="forgotYourPassword"
        description="resetPasswordDescription"
      />
      <ResetPasswordForm
        state={state}
        formAction={sendLink}
        isPending={isPending}
      />
    </>
  );
}
