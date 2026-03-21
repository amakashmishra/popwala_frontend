import { useState } from "react";
import {
  LayoutDashboard,
  Palette,
  Layers,
  Grid3X3,
  Paintbrush,
  Wrench,
  Images,
  HardHat,
  Ruler,
  Users,
  MessageSquare,
  FolderKanban,
  DollarSign,
  Star,
  FileText,
  BarChart3,
  Megaphone,
  Image,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navSections = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Catalog",
    items: [
      { title: "Designs", url: "/admin/designs", icon: Palette },
      { title: "Product Types", url: "/admin/product-types", icon: Layers },
      { title: "Categories", url: "/admin/categories", icon: Grid3X3 },
      { title: "Styles", url: "/admin/styles", icon: Paintbrush },
      { title: "Services", url: "/admin/services", icon: Wrench },
      { title: "Website Banners", url: "/admin/banners", icon: Images },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Contractors", url: "/admin/contractors", icon: HardHat },
      { title: "Architects", url: "/admin/architects", icon: Ruler },
      { title: "Users", url: "/admin/users", icon: Users },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Leads", url: "/admin/leads", icon: MessageSquare },
      { title: "Projects", url: "/admin/projects", icon: FolderKanban },
      { title: "Pricing", url: "/admin/pricing", icon: DollarSign },
      { title: "Reviews", url: "/admin/reviews", icon: Star },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Pages", url: "/admin/pages", icon: FileText },
      { title: "Ads", url: "/admin/ads", icon: Megaphone },
    ],
  },
  {
    label: "Insights",
    items: [{ title: "Reports", url: "/admin/reports", icon: BarChart3 }],
  },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex md:flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="h-14 border-b border-sidebar-border flex items-center px-4">
        <span className="font-display text-lg font-semibold text-sidebar-foreground">
          {collapsed ? "P" : "PopWala"}
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed ? (
              <p className="px-3 mb-1.5 text-[10px] uppercase tracking-[0.1em] font-semibold text-sidebar-foreground/70">
                {section.label}
              </p>
            ) : null}
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item.url}>
                  <NavLink
                    to={item.url}
                    end={item.url === "/admin"}
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
          </div>
        ))}
      </nav>
      <button
        type="button"
        onClick={() => setCollapsed((prev) => !prev)}
        className="h-10 border-t border-sidebar-border flex items-center justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
