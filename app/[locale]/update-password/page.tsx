import { AuthPanel } from "@/components/auth/auth-panel";
import { UpdatePasswordFlow } from "@/components/auth/update-password-flow";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Logo } from "@/components/layout/logo";
import { requireUser } from "@/lib/auth";

export default async function UpdatePasswordPage() {
  await requireUser("/link-expired?type=recovery");

  return (
    <div className="flex flex-1 flex-col desktop:flex-row">
      <AuthPanel className="relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10 mb-8">
          <Logo />
          <LocaleSwitcher />
        </div>
        <div className="max-w-130 flex flex-col gap-10 z-10">
          <UpdatePasswordFlow />
        </div>

        <div className="absolute -right-30 -top-35 size-65 rounded-full bg-accent sm:-right-40 sm:size-115"></div>
        <div className="absolute -bottom-20 -left-17.5 size-35 rounded-full bg-secondary sm:size-55"></div>
      </AuthPanel>
    </div>
  );
}
