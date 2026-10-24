import { getTranslations } from "next-intl/server";

import { requireUser } from "@/lib/auth";

export default async function MyBooksPage() {
  await requireUser();

  const t = await getTranslations("MyBooksPage");

  return (
    <div className="flex flex-1 w-full flex-col items-center justify-center py-5 md:py-8 px-4 md:px-10 desktop:px-20">
      <p className="text-brand text-lg">{t("comingSoon")}</p>
    </div>
  );
}
