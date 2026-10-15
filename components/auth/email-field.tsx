"use client";

import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EMAIL_PLACEHOLDER } from "@/lib/constants";

interface EmailFieldProps<T extends FieldValues> {
  readonly control: Control<T>;
  readonly name?: FieldPath<T>;
}

export function EmailField<T extends FieldValues>({
  control,
  name = "email" as FieldPath<T>,
}: EmailFieldProps<T>) {
  const t = useTranslations("Auth");
  const tv = useTranslations("Validation");

  return (
    <Controller
      name={name}
      control={control}
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
  );
}
