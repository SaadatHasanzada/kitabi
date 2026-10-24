import { useTranslations } from "next-intl";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function SignInButton() {
  const t = useTranslations("Auth");
  return (
    <Link
      className={cn(buttonVariants({ size: "lg" }), "font-bold")}
      href="/login"
    >
      {t("signIn")}
    </Link>
  );
}
