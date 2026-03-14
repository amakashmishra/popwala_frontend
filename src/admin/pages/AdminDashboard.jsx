import { Link } from "react-router-dom";
import {
  Users,
  HardHat,
  Ruler,
  Palette,
  MessageSquare,
  FolderKanban,
  CheckCircle2,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/admin/components/StatCard";
import {
  dashboardStats,
  monthlyLeadsData,
  revenueData,
  designs,
} from "@/admin/data/mockAdminData";

const stats = [
  {
    label: "Total Users",
    value: dashboardStats.totalUsers.toLocaleString(),
    icon: Users,
    trend: "+12% this month",
    trendUp: true,
  },
  {
    label: "Contractors",
    value: dashboardStats.totalContractors,
    icon: HardHat,
    trend: "+8 new",
    trendUp: true,
  },
  {
    label: "Architects",
    value: dashboardStats.totalArchitects,
    icon: Ruler,
    trend: "+3 new",
    trendUp: true,
  },
  {
    label: "Total Designs",
    value: dashboardStats.totalDesigns.toLocaleString(),
    icon: Palette,
    trend: "+24 this week",
    trendUp: true,
  },
  {
    label: "Total Leads",
    value: dashboardStats.totalLeads,
    icon: MessageSquare,
    trend: "+18% conversion",
    trendUp: true,
  },
  {
    label: "Active Projects",
    value: dashboardStats.activeProjects,
    icon: FolderKanban,
  },
  {
    label: "Completed",
    value: dashboardStats.completedProjects,
    icon: CheckCircle2,
    trend: "98% satisfaction",
    trendUp: true,
  },
  {
    label: "Revenue",
    value: `$${(dashboardStats.revenue / 1000).toFixed(1)}K`,
    icon: DollarSign,
    trend: "+22% YoY",
    trendUp: true,
  },
];

const maxLeads = Math.max(...monthlyLeadsData.map((item) => item.leads));
const maxRevenue = Math.max(...revenueData.map((item) => item.revenue));

const statusClass = {
  active: "bg-primary/15 text-primary border-primary/30",
  draft: "bg-secondary text-secondary-foreground border-border",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform overview and key metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/designs/new">Add Design</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Leads and Projects</CardTitle>
            <CardDescription>Monthly acquisition snapshot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {monthlyLeadsData.map((item) => (
              <div key={item.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-muted-foreground">
                    Leads {item.leads} • Projects {item.projects}
                  </span>
                </div>
                <Progress value={(item.leads / maxLeads) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Revenue</CardTitle>
            <CardDescription>Monthly earnings trend</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueData.map((item) => (
              <div key={item.month} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{item.month}</span>
                  <span className="text-muted-foreground">
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
                <Progress value={(item.revenue / maxRevenue) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Designs</CardTitle>
              <CardDescription>Latest additions to the catalog</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/designs">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b">
                  <th className="text-left px-4 py-2.5">Design</th>
                  <th className="text-left px-4 py-2.5">Type</th>
                  <th className="text-left px-4 py-2.5">Category</th>
                  <th className="text-right px-4 py-2.5">Price/SqFt</th>
                  <th className="text-right px-4 py-2.5">Views</th>
                  <th className="text-center px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {designs.map((design) => (
                  <tr key={design.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{design.title}</p>
                      <p className="text-xs text-muted-foreground font-mono">{design.id}</p>
                    </td>
                    <td className="px-4 py-3">{design.productType}</td>
                    <td className="px-4 py-3">{design.category}</td>
                    <td className="px-4 py-3 text-right font-mono">
                      ${design.pricePerSqFt.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {design.views.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant="outline"
                        className={statusClass[design.status] || statusClass.inactive}
                      >
                        {design.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
