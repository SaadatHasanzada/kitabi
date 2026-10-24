import { AccountMenu } from "@/components/layout/account-menu";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { SignInButton } from "@/components/layout/sign-in-button";
import { getAuthContext, getUserProfile } from "@/lib/auth";

export async function SiteHeader() {
  const { claims, locale } = await getAuthContext();
  const profile = claims ? getUserProfile(claims, locale) : null;

  return (
    <header className="w-full px-4 py-5 md:px-10 md:py-8 desktop:px-20">
      <nav className="flex items-center justify-between w-full gap-2 md:gap-8">
        <Logo />

        <NavLinks className="hidden md:flex gap-10" />
        <div className="flex gap-4 items-center">
          <LocaleSwitcher />
          {profile ? (
            <div className="hidden md:block">
              <AccountMenu {...profile} />
            </div>
          ) : (
            <SignInButton />
          )}
        </div>
      </nav>
    </header>
  );
}
