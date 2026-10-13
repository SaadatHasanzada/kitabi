"use client";

import { startTransition, useActionState, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/actions/auth";
import { EMAIL_PLACEHOLDER } from "@/lib/constants";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

export function LoginForm() {
  const t = useTranslations("Auth");
  const tv = useTranslations("Validation");
  const locale = useLocale();

  const [state, formAction, isPending] = useActionState(login, null);

  const [hidden, setHidden] = useState(false);
  const showMessage = !hidden && !isPending;

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginValues) {
    setHidden(false);
    startTransition(() => formAction({ ...data, locale }));
  }

  return (
    <form
      onChange={() => setHidden(true)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
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
        <PasswordField
          control={form.control}
          name="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          showForgotPassword
        />
      </FieldGroup>
      {showMessage && state?.errorKey && (
        <FieldError className="mt-3">{t(state.errorKey)}</FieldError>
      )}

      <Button
        type="submit"
        size="lg"
        className="mt-8 w-full flex items-center"
        disabled={isPending}
      >
        {isPending && <Loader className="animate-spin size-5" />}
        {isPending ? t("signingIn") : t("signIn")}
      </Button>
    </form>
  );
}
