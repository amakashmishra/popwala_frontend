import { useState } from "react";
import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, ClipboardList, FolderKanban, Truck, ChevronLeft, ChevronRight } from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/contractor", icon: LayoutDashboard },
  { title: "Work Orders", url: "/contractor/work-orders", icon: ClipboardList },
  { title: "Projects", url: "/contractor/projects", icon: FolderKanban },
  { title: "Site Visits", url: "/contractor/site-visits", icon: Truck },
];

export default function ContractorSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex md:flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="h-14 border-b border-sidebar-border flex items-center px-4">
        <span className="font-display text-lg font-semibold text-sidebar-foreground">
          {collapsed ? "C" : "Contractor"}
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.url}>
              <NavLink
                to={item.url}
                end={item.url === "/contractor"}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  collapsed ? "justify-center" : ""
                }`}
                activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed ? <span>{item.title}</span> : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="h-10 border-t border-sidebar-border flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
