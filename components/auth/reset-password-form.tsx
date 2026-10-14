import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { AuthState } from "@/lib/actions/auth";
import { EMAIL_PLACEHOLDER } from "@/lib/constants";
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
  const tv = useTranslations("Validation");

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
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("email")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="email"
                placeholder={EMAIL_PLACEHOLDER}
                autoComplete="username"
                className="px-5"
              />
              {fieldState.error?.message && (
                <FieldError>{tv(fieldState.error.message)}</FieldError>
              )}
            </Field>
          )}
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
        {isPending ? t("sendingResetLink") : t("sendResetLink")}
      </Button>
    </form>
  );
}
