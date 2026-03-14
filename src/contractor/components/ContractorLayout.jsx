import { Outlet } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import ContractorHeader from "./ContractorHeader";
import ContractorSidebar from "./ContractorSidebar";

const mobileNavItems = [
  { label: "Dashboard", to: "/contractor" },
  { label: "Work Orders", to: "/contractor/work-orders" },
  { label: "Projects", to: "/contractor/projects" },
  { label: "Site Visits", to: "/contractor/site-visits" },
];

export default function ContractorLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <ContractorSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <ContractorHeader />
        <div className="md:hidden border-b bg-card">
          <div className="px-3 py-2 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/contractor"}
                  className="px-3 py-1.5 text-xs rounded-md bg-muted text-muted-foreground"
                  activeClassName="bg-primary text-primary-foreground"
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
