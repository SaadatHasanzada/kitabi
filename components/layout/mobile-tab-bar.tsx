"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MobileTabBar() {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-25 h-[calc(86px+env(safe-area-inset-bottom))] border-t border-brand/12 bg-background md:hidden" />
      <nav className="fixed inset-x-4 bottom-[calc(14px+env(safe-area-inset-bottom))] z-50 flex gap-1.5 rounded-full border border-brand/14 bg-card p-1.5 shadow-float md:hidden">
        {navItems.map(({ id, url, key, icon: Icon }) => {
          const isActive = pathname === url;

          return (
            <Link
              key={id}
              href={url}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-full px-2.5 py-3 text-[15px] font-extrabold",
                isActive
                  ? "bg-brand text-primary-foreground"
                  : "text-brand hover:bg-brand/7",
              )}
            >
              <Icon className="size-4.5" strokeWidth={2.75} />
              {t(key)}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
