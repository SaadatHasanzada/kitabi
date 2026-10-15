"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import { EmailField } from "@/components/auth/email-field";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MutedText } from "@/components/ui/muted-text";
import { register } from "@/lib/actions/auth";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const tv = useTranslations("Validation");
  const locale = useLocale();

  const searchParams = useSearchParams();
  const confirmEmailError = searchParams.get("error");

  const [state, formAction, isPending] = useActionState(register, null);

  const [hidden, setHidden] = useState(false);
  const showMessage = !hidden && !isPending;

  const urlError =
    confirmEmailError && t.has(confirmEmailError) ? confirmEmailError : null;
  const errorKey = state ? state.errorKey : urlError;

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });

  function onSubmit(data: RegisterValues) {
    setHidden(false);
    startTransition(() => formAction({ ...data, locale }));
  }

  useEffect(() => {
    if (state?.ok) form.reset();
  }, [state, form]);

  return (
    <form
      onChange={() => setHidden(true)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="displayName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>{t("displayName")}</FieldLabel>
              <Input
                {...field}
                id={field.name}
                aria-invalid={fieldState.invalid}
                type="text"
                placeholder={t("displayNamePlaceholder")}
                autoComplete="name"
                className="px-5"
              />
              {fieldState.error?.message && (
                <FieldError>{tv(fieldState.error.message)}</FieldError>
              )}
            </Field>
          )}
        />
        <EmailField control={form.control} />
        <PasswordField
          control={form.control}
          name="password"
          autoComplete="new-password"
          placeholder={t("newPasswordPlaceholder")}
        />
      </FieldGroup>
      <FieldGroup className="mt-3">
        {showMessage && errorKey && <FieldError>{t(errorKey)}</FieldError>}
        {showMessage && state?.ok && (
          <MutedText className="text-success">{t(state.ok)}</MutedText>
        )}
      </FieldGroup>

      <Button
        type="submit"
        size="lg"
        className="mt-6 w-full flex items-center"
        disabled={isPending}
      >
        {isPending && <Loader className="animate-spin size-5" />}
        {isPending ? t("creatingAccount") : t("createAccount")}
      </Button>
    </form>
  );
}
