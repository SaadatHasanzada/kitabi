import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import { EmailField } from "@/components/auth/email-field";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import type { AuthState } from "@/lib/actions/auth";
import {
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/validation/auth";

interface ResetPasswordFormProps {
  readonly state: AuthState;
  readonly formAction: (values: ResetPasswordValues) => void;
  readonly isPending: boolean;
}

export function ResetPasswordForm({
  state,
  formAction,
  isPending,
}: ResetPasswordFormProps) {
  const t = useTranslations("Auth");

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "all",
    defaultValues: {
      email: state?.email ?? "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(formAction)}>
      <FieldGroup>
        <EmailField control={form.control} />
      </FieldGroup>
      {state?.errorKey && (
        <FieldError className="mt-3">{t(state.errorKey)}</FieldError>
      )}
      <Button
        type="submit"
        size="lg"
        className="mt-5 w-full flex items-center"
        disabled={isPending}
      >
        {isPending && <Loader className="animate-spin size-5" />}
        {isPending ? t("sendingResetLink") : t("sendResetLink")}
      </Button>
    </form>
  );
}
