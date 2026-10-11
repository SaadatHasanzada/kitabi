"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
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
import { MutedText } from "@/components/ui/muted-text";
import { register } from "@/lib/actions/auth";
import { EMAIL_PLACEHOLDER } from "@/lib/constants";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const tv = useTranslations("Validation");
  const locale = useLocale();

  const searchParams = useSearchParams();
  const confirmEmailError = searchParams.get("error");

  const [state, formAction, isPending] = useActionState(register, null);

  const [errorKey, setErrorKey] = useState(confirmEmailError ?? undefined);
  const [okKey, setOkKey] = useState(state?.ok);
  const [prevState, setPrevState] = useState(state);

  if (state !== prevState) {
    setPrevState(state);
    setErrorKey(state?.errorKey);
    setOkKey(state?.ok);
  }

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
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    formData.append("locale", locale);
    startTransition(() => formAction(formData));
  }

  const isResettingRef = useRef(false);

  useEffect(() => {
    if (state?.ok) {
      isResettingRef.current = true;
      form.reset();
      isResettingRef.current = false;
    }
  }, [state, form]);

  useEffect(() => {
    return form.subscribe({
      formState: { values: true },
      callback: () => {
        if (isResettingRef.current) return;
        setErrorKey(undefined);
        setOkKey(undefined);
      },
    });
  }, [form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
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
          autoComplete="new-password"
          placeholder={t("newPasswordPlaceholder")}
        />
      </FieldGroup>
      <FieldGroup className="mt-3">
        {errorKey && <FieldError>{t(errorKey)}</FieldError>}
        {okKey && <MutedText className="text-success">{t(okKey)}</MutedText>}
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
