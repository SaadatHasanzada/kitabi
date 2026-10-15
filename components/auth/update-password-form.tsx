import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import type { AuthState } from "@/lib/actions/auth";
import {
  updatePasswordSchema,
  type UpdatePasswordValues,
} from "@/lib/validation/auth";

import { PasswordField } from "./password-field";

interface UpdatePasswordFormProps {
  readonly state: AuthState;
  readonly formAction: (values: UpdatePasswordValues) => void;
  readonly isPending: boolean;
}

export function UpdatePasswordForm({
  state,
  formAction,
  isPending,
}: UpdatePasswordFormProps) {
  const t = useTranslations("Auth");

  const form = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    mode: "all",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(formAction)}>
      <FieldGroup>
        <PasswordField
          control={form.control}
          name="password"
          autoComplete="new-password"
          placeholder={t("newPasswordPlaceholder")}
          label="newPassword"
        />
        <PasswordField
          control={form.control}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder={t("confirmPasswordPlaceholder")}
          label="confirmPassword"
        />
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
        {isPending ? t("savingNewPassword") : t("saveNewPassword")}
      </Button>
    </form>
  );
}
