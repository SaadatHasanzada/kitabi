import { useTranslations } from "next-intl";

import { Search, UserRound } from "lucide-react";

import { Logo } from "@/components/layout/logo";
import MobileNav from "@/components/layout/mobile-nav";
import NavLinks from "@/components/layout/nav-links";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const t = useTranslations("Nav");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <main className=" overflow-hidden relative flex flex-1 w-full  flex-col items-center justify-between py-5 md:py-8 px-4 md:px-10 desktop:px-20 bg-background sm:items-start">
        <nav className="flex flex-col desktop:flex-row items-center justify-between w-full  gap-2 desktop:gap-8">
          <div className="flex w-full desktop:w-auto items-center justify-between">
            <Logo />
            <MobileNav />
          </div>

          <NavLinks className="hidden desktop:flex gap-10" />
          <div className="flex w-full desktop:w-auto gap-6 items-center flex-1  max-w-xl desktop:flex-0 min-w-0 desktop:min-w-auto">
            <div className="w-full min-w-0 desktop:w-auto flex items-center gap-2 rounded-full bg-secondary px-4 desktop:px-5 py-2 desktop:py-3">
              <Search className="w-5 h-5 shrink-0 text-brand" />
              <Input
                name="Search"
                type="text"
                placeholder={t("search")}
                className="h-auto rounded-none min-w-62.5 flex-1 border-0 bg-transparent p-0 font-sans text-base text-brand placeholder:text-muted-foreground focus-visible:ring-0"
              />
            </div>
            <Button
              variant="outline"
              size="icon-lg"
              className="hidden desktop:inline-flex size-12 rounded-full border-brand bg-transparent hover:bg-brand/10 hover:border-brand/40 cursor-pointer"
            >
              <UserRound className="size-6.5 text-brand" />
            </Button>
          </div>
        </nav>
      </main>
    </div>
  );
}
