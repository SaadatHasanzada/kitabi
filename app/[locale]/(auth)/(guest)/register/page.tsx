import { useTranslations } from "next-intl";

import { AuthDivider } from "@/components/auth/auth-divider";
import { AuthHeader } from "@/components/auth/auth-header";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AuthTopBar } from "@/components/auth/auth-top-bar";
import { GoogleButton } from "@/components/auth/google-button";
import { RegisterBenefits } from "@/components/auth/register-benefits";
import { RegisterForm } from "@/components/auth/register-form";
import { MutedText } from "@/components/ui/muted-text";
import { TextLink } from "@/components/ui/text-link";

export default function Register() {
  const t = useTranslations("Auth");
  const tg = useTranslations("General");

  return (
    <>
      <AuthPanel>
        <AuthTopBar />
        <div className="flex flex-col gap-6">
          <AuthHeader
            eyebrow="freeToKeep"
            title="startReadingList"
            description="oneAccountSync"
          />
          <GoogleButton />
          <AuthDivider />
          <RegisterForm />
          <div>
            <p className="mb-1">
              {t("haveAccount")}{" "}
              <TextLink variant="emphasis" href="/login">
                {t("signIn")}
              </TextLink>
            </p>
            <MutedText size="sm">{tg("bookDataFromOpenLib")}</MutedText>
          </div>
        </div>
      </AuthPanel>

      <AuthPanel className="bg-secondary" variant="showcase">
        <div className="absolute -bottom-25 -right-20 size-75 rounded-full bg-blob-sand desktop:-bottom-40 desktop:-right-30 desktop:size-125"></div>
        <div className="absolute -left-10 -top-10 size-35 rounded-full bg-accent desktop:-left-12.5 desktop:-top-12.5 desktop:size-55"></div>
        <RegisterBenefits />
      </AuthPanel>
    </>
  );
}
