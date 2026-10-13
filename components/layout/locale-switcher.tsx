"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Globe } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { languageNames } from "@/lib/constants";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const locale = useLocale();
  const t = useTranslations("Nav");

  const handleLocaleChange = (value: string | null) => {
    if (!value) return;

    router.replace(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      // are used in combination with a given `pathname`. Since the two will
      // always match for the current route, we can skip runtime checks.
      { pathname, params },
      { locale: value },
    );
  };

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger
        aria-label={t("changeLanguage")}
        showIcon={false}
        className="w-full max-w-19.5 p-2 rounded-full hover:bg-muted flex items-center justify-center text-brand font-bold"
      >
        <Globe />
        <SelectValue className="flex-none">
          {(value) => {
            return <>{value.toUpperCase()}</>;
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-44" alignItemWithTrigger={false} align="end">
        <SelectGroup className="p-2">
          {routing.locales.map((locale) => (
            <SelectItem
              className="px-3.5 py-2 rounded-full font-medium"
              key={locale}
              value={locale}
            >
              {languageNames[locale]}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
