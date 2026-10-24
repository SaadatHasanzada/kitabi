import { getLocale, getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { requireUser } from "@/lib/auth";

export default async function MyBooksPage() {
  await requireUser();

  const locale = await getLocale();

  const t = await getTranslations("MyBooksPage");
  const ta = await getTranslations("Auth");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <main className="flex flex-1 w-full flex-col items-center justify-center py-5 md:py-8 px-4 md:px-10 desktop:px-20 bg-background">
        <p className="text-brand text-lg">{t("comingSoon")}</p>
        <form action={signOut.bind(null, locale)}>
          <Button type="submit">{ta("signOut")}</Button>
        </form>
      </main>
    </div>
  );
}
