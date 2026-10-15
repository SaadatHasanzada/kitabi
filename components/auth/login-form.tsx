"use client";

import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import { EmailField } from "@/components/auth/email-field";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { login } from "@/lib/actions/auth";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

export function LoginForm() {
  const t = useTranslations("Auth");
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
        <EmailField control={form.control} />
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
