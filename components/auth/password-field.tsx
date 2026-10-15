"use client";

import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Eye, EyeOff } from "lucide-react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { TextLink } from "@/components/ui/text-link";

interface PasswordFieldProps<T extends FieldValues> {
  readonly control: Control<T>;
  readonly name: FieldPath<T>;
  readonly autoComplete: "current-password" | "new-password";
  readonly placeholder: string;
  readonly showForgotPassword?: boolean;
  readonly label?: string;
}

export function PasswordField<T extends FieldValues>({
  control,
  name,
  autoComplete,
  placeholder,
  showForgotPassword = false,
  label = "password",
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const t = useTranslations("Auth");
  const tv = useTranslations("Validation");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor={name}>{t(label)}</FieldLabel>
            {showForgotPassword && (
              <TextLink href="/reset-password">{t("forgotPassword")}</TextLink>
            )}
          </div>
          <InputGroup>
            <InputGroupInput
              type={showPassword ? "text" : "password"}
              {...field}
              id={name}
              aria-invalid={fieldState.invalid}
              placeholder={placeholder}
              autoComplete={autoComplete}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff className="size-4.5" />
                ) : (
                  <Eye className="size-4.5" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>

          {fieldState.error?.message && (
            <FieldError>{tv(fieldState.error.message)}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
