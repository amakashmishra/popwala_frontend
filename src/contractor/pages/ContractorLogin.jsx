import RoleLoginPage from "@/components/portal/RoleLoginPage";
import { contractorApi } from "@/lib/api";

export default function ContractorLogin() {
  return (
    <RoleLoginPage
      role="contractor"
      title="Contractor Portal"
      description="Login to manage site visits, work orders and progress updates."
      loginApi={contractorApi.login}
      homePath="/contractor"
    />
  );
}
