import { Outlet } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import ArchitectHeader from "./ArchitectHeader";
import ArchitectSidebar from "./ArchitectSidebar";

const mobileNavItems = [
  { label: "Dashboard", to: "/architect" },
  { label: "Projects", to: "/architect/projects" },
  { label: "Tasks", to: "/architect/tasks" },
  { label: "Clients", to: "/architect/clients" },
];

export default function ArchitectLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <ArchitectSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <ArchitectHeader />
        <div className="md:hidden border-b bg-card">
          <div className="px-3 py-2 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/architect"}
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
