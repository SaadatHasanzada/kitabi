import { z } from "zod";

const email = z
  .string()
  .min(1, { error: "required" })
  .pipe(z.email({ error: "emailInvalid" }));

const password = z
  .string()
  .min(1, { error: "required" })
  .min(8, { error: "weakPassword" })
  .max(72, { error: "passwordTooLong" })
  .regex(/[a-z]/, { error: "passwordMissingLowercase" })
  .regex(/[A-Z]/, { error: "passwordMissingUppercase" })
  .regex(/\d/, { error: "passwordMissingNumber" })
  .regex(/[^A-Za-z0-9]/, { error: "passwordMissingSymbol" });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, { error: "required" }),
});

export const registerSchema = z
  .object({
    displayName: z
      .string()
      .min(1, { error: "required" })
      .min(2, { error: "displayNameTooShort" }),
    email,
    password,
  })
  .refine(
    (data) =>
      data.password !== data.email && data.password !== data.displayName,
    { error: "passwordMatchesProfile", path: ["password"] },
  );

export const resetPasswordSchema = z.object({
  email,
});

export const updatePasswordSchema = z
  .object({
    password,
    confirmPassword: z.string().min(1, { error: "required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "passwordsDoNotMatch",
    path: ["confirmPassword"],
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;
