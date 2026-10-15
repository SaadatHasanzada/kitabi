import { useTranslations } from "next-intl";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthPanel } from "@/components/auth/auth-panel";
import { BookStack } from "@/components/auth/book-stack";
import { GoogleButton } from "@/components/auth/google-button";
import { LoginForm } from "@/components/auth/login-form";
import { LoginQuote } from "@/components/auth/login-quote";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { MutedText } from "@/components/ui/muted-text";
import { TextLink } from "@/components/ui/text-link";

export default function Login() {
  const t = useTranslations("Auth");
  const tg = useTranslations("General");

  return (
    <>
      <AuthPanel>
        <div className="flex justify-between items-center">
          <Logo />
          <LocaleSwitcher />
        </div>
        <div className="flex flex-col gap-6">
          <AuthHeader
            eyebrow="welcomeBack"
            title="signInToShelf"
            description="yourReadingList"
          />
          <GoogleButton />
          <AuthDivider />
          <LoginForm />
          <div>
            <p className="mb-1">
              {t("newHere")}{" "}
              <TextLink variant="emphasis" href="/register">
                {t("createAccount")}
              </TextLink>
            </p>
            <MutedText size="sm">{tg("bookDataFromOpenLib")}</MutedText>
          </div>
        </div>
      </AuthPanel>

      <AuthPanel variant="showcase">
        <div className="absolute -top-20 -right-22.5 size-75 rounded-full bg-blob-sage desktop:-top-30 desktop:-right-35 desktop:size-130"></div>
        <div className="absolute -bottom-12.5 -left-10 size-40 rounded-full bg-secondary desktop:-bottom-17.5 desktop:-left-15 desktop:size-65"></div>
        <BookStack className="desktop:self-center" />
        <LoginQuote />
      </AuthPanel>
    </>
  );
}
