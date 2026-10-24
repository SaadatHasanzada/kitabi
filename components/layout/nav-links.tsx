"use client";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { navItems } from "@/lib/constants";

interface NavLinksProps {
  readonly className?: string;
  readonly itemClassName?: string;
  readonly activeClassName?: string;
  readonly onClick?: () => void;
  readonly showIcon?: boolean;
}

export function NavLinks({
  className = "",
  itemClassName,
  activeClassName = "active",
  showIcon = false,
  onClick,
}: NavLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  return (
    <ul
      className={`font-bold text-[22px] ${className} ${showIcon ? "text-brand-foreground" : "text-brand"}`}
    >
      {navItems.map(({ id, url, key, icon: Icon }) => {
        const isActive = pathname === url;
        return (
          <li
            key={id}
            className={[
              "underline decoration-wavy decoration-2 underline-offset-7 decoration-transparent transition-colors duration-300 hover:decoration-current",
              itemClassName,
              isActive && activeClassName,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Link
              onClick={() => onClick?.()}
              className="flex gap-4 items-center leading-normal"
              href={url}
              aria-current={isActive ? "page" : undefined}
            >
              {showIcon && <Icon className="h-5 w-5 shrink-0" />} {t(key)}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
