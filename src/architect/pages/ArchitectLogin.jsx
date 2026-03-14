import RoleLoginPage from "@/components/portal/RoleLoginPage";
import { architectApi } from "@/lib/api";

export default function ArchitectLogin() {
  return (
    <RoleLoginPage
      role="architect"
      title="Architect Portal"
      description="Login to access architect dashboard and project workflows."
      loginApi={architectApi.login}
      homePath="/architect"
    />
  );
}
