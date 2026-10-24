import { Locale } from "next-intl";

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstLetterUppercase(
  str: string | null | undefined,
  locale: Locale,
) {
  const trimmedStr = str?.trim();
  if (!trimmedStr) return null;
  return trimmedStr.charAt(0).toLocaleUpperCase(locale);
}
