import { StatusPanel } from "@/components/auth/status-panel";
import { UpdatePasswordFlow } from "@/components/auth/update-password-flow";
import { requireUser } from "@/lib/auth";

export default async function UpdatePasswordPage() {
  await requireUser("/link-expired?type=recovery");

  return (
    <StatusPanel>
      <UpdatePasswordFlow />
    </StatusPanel>
  );
}
