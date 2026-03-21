import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { NavLink } from "@/components/NavLink";

const mobileNavItems = [
  { label: "Dashboard", to: "/admin" },
  { label: "Designs", to: "/admin/designs" },
  { label: "Categories", to: "/admin/categories" },
  { label: "Styles", to: "/admin/styles" },
  { label: "Services", to: "/admin/services" },
  { label: "Popular Deals", to: "/admin/popular-deals" },
  { label: "Promotions", to: "/admin/promotions" },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminHeader />
        <div className="md:hidden border-b bg-card">
          <div className="px-3 py-2 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {mobileNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/admin"}
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
