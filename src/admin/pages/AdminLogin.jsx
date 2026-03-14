import RoleLoginPage from "@/components/portal/RoleLoginPage";
import { adminApi } from "@/lib/api";

export default function AdminLogin() {
  return (
    <RoleLoginPage
      role="admin"
      title="Admin Panel"
      description="Login to manage users, catalog and operations."
      loginApi={adminApi.login}
      homePath="/admin"
    />
  );
}
