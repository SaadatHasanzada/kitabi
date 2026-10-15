import { ResetPasswordFlow } from "@/components/auth/reset-password-flow";
import { StatusPanel } from "@/components/auth/status-panel";

export default function ResetPassword() {
  return (
    <StatusPanel backToLogin>
      <ResetPasswordFlow />
    </StatusPanel>
  );
}
