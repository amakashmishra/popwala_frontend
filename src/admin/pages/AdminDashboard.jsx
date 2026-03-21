import { useEffect, useRef, useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StatCard from "@/admin/components/StatCard";
import {
  revenueData,
  designs,
} from "@/admin/data/mockAdminData";
import { adminApi } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const DATE_FILTER_OPTIONS = [
  { key: "last7", label: "Last 7 Days" },
  { key: "last30", label: "Last 30 Days" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
  { key: "thisYear", label: "This Year" },
  { key: "custom", label: "Custom Range" },
];

const statConfig = [
  { key: "totalUsers", label: "Total Users", icon: Users },
  { key: "contractors", label: "Contractors", icon: HardHat },
  { key: "architects", label: "Architects", icon: Ruler },
  { key: "totalDesigns", label: "Total Designs", icon: Palette },
  { key: "totalLeads", label: "Total Leads", icon: MessageSquare },
  { key: "activeProjects", label: "Active Projects", icon: FolderKanban },
  { key: "completedProjects", label: "Completed", icon: CheckCircle2 },
  { key: "revenue", label: "Revenue", icon: DollarSign },
];

const formatStatValue = (key, value) => {
  if (value == null || Number.isNaN(Number(value))) {
    return key === "revenue" ? "$0" : "0";
  }

  if (key === "revenue") {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return "$0";
    }
    if (Math.abs(numeric) >= 1000) {
      return `$${(numeric / 1000).toFixed(1)}K`;
    }
    return `$${numeric.toLocaleString()}`;
  }

  return Number.isFinite(Number(value)) ? Number(value).toLocaleString() : String(value);
};

const addDays = (base, offset) => {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + offset);
  return copy;
};

const getSelectedRangeParams = (key, customRange) => {
  const today = new Date();
  const toIso = (date) => date.toISOString().split("T")[0];

  switch (key) {
    case "last7":
      return {
        startDate: toIso(addDays(today, -6)),
        endDate: toIso(today),
      };
    case "last30":
      return {
        startDate: toIso(addDays(today, -29)),
        endDate: toIso(today),
      };
    case "thisMonth":
      return {
        startDate: toIso(new Date(today.getFullYear(), today.getMonth(), 1)),
        endDate: toIso(today),
      };
    case "lastMonth": {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return {
        startDate: toIso(start),
        endDate: toIso(end),
      };
    }
    case "thisYear":
      return {
        startDate: toIso(new Date(today.getFullYear(), 0, 1)),
        endDate: toIso(today),
      };
    case "custom":
      if (!customRange.start || !customRange.end) {
        return null;
      }
      if (customRange.start > customRange.end) {
        return null;
      }
      return {
        startDate: customRange.start,
        endDate: customRange.end,
      };
    default:
      return null;
  }
};

const getInsightMeta = (key, stats) => {
  if (!stats) {
    return { text: "—", trendUp: true };
  }

  switch (key) {
    case "totalUsers": {
      const value = Number(stats.usersGrowth ?? 0);
      return {
        text: `${value >= 0 ? "+" : ""}${value}% vs prev`,
        trendUp: value >= 0,
      };
    }
    case "contractors":
      return {
        text: `+${stats.contractorsNew ?? 0} new`,
        trendUp: true,
      };
    case "architects":
      return {
        text: `+${stats.architectsNew ?? 0} new`,
        trendUp: true,
      };
    case "totalDesigns":
      return {
        text: `+${stats.designsThisRange ?? 0} this period`,
        trendUp: true,
      };
    case "totalLeads": {
      const value = Number(stats.leadsConversion ?? 0);
      return {
        text: `${value >= 0 ? "+" : ""}${value}% conversion`,
        trendUp: value >= 0,
      };
    }
    case "activeProjects":
      return {
        text: "Active in range",
        trendUp: true,
      };
    case "completedProjects":
      return {
        text: `${stats.satisfactionRate ?? 0}% satisfaction`,
        trendUp: true,
      };
    case "revenue": {
      const value = Number(stats.revenueGrowth ?? 0);
      return {
        text: `${value >= 0 ? "+" : ""}${value}% vs prev`,
        trendUp: value >= 0,
      };
    }
    default:
      return { text: "—", trendUp: true };
  }
};

const maxRevenue = Math.max(...revenueData.map((item) => item.revenue));

const statusClass = {
  active: "bg-primary/15 text-primary border-primary/30",
  draft: "bg-secondary text-secondary-foreground border-border",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
};

const leadStageStyles = {
  new: "bg-blue-100 text-blue-700 border border-blue-200",
  contacted: "bg-sky-100 text-sky-700 border border-sky-200",
  site_visit: "bg-orange-100 text-orange-700 border border-orange-200",
  quotation_sent: "bg-violet-100 text-violet-700 border border-violet-200",
  completed: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  cancelled: "bg-rose-100 text-rose-700 border border-rose-200",
};

export default function AdminDashboard() {
  const [recentLeads, setRecentLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [dashboardStatsData, setDashboardStatsData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dateFilterKey, setDateFilterKey] = useState("last30");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [customError, setCustomError] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const loadRecentLeads = async () => {
      setLoadingLeads(true);
      try {
        const data = await adminApi.listRecentLeads();
        if (!cancelled) {
          setRecentLeads(data.leads || []);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || "Failed to load recent leads");
        }
      } finally {
        if (!cancelled) {
          setLoadingLeads(false);
        }
      }
    };
    loadRecentLeads();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const rangeParams = getSelectedRangeParams(dateFilterKey, customRange);
    if (dateFilterKey === "custom") {
      if (!customRange.start || !customRange.end) {
        setCustomError("Set both start and end dates.");
        setDashboardStatsData(null);
        setLoadingStats(false);
        return () => {
          cancelled = true;
        };
      }
      if (customRange.start > customRange.end) {
        setCustomError("Start date must be before end date.");
        setDashboardStatsData(null);
        setLoadingStats(false);
        return () => {
          cancelled = true;
        };
      }
    }
    setCustomError("");
    if (!rangeParams) {
      return () => {
        cancelled = true;
      };
    }

    const loadDashboardStats = async () => {
      setLoadingStats(true);
      try {
        const response = await adminApi.getDashboardStats(rangeParams);
        if (!cancelled) {
          setDashboardStatsData(response.stats || null);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || "Failed to load dashboard stats");
        }
      } finally {
        if (!cancelled) {
          setLoadingStats(false);
        }
      }
    };

    loadDashboardStats();
    return () => {
      cancelled = true;
    };
  }, [dateFilterKey, customRange.start, customRange.end]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showFilterMenu && filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFilterMenu]);

  const statsToRender = statConfig.map((item) => {
    const rawValue = dashboardStatsData?.[item.key];
    const value = loadingStats ? "—" : formatStatValue(item.key, rawValue);
    const insight = loadingStats
      ? { text: "Loading...", trendUp: true }
      : getInsightMeta(item.key, dashboardStatsData);
    return { ...item, value, trend: insight.text, trendUp: insight.trendUp };
  });

  const handleFilterChange = (key) => {
    setDateFilterKey(key);
    if (key !== "custom") {
      setCustomRange({ start: "", end: "" });
      setCustomError("");
    }
    setShowFilterMenu(key === "custom");
  };

  const handleCustomChange = (field, value) => {
    setCustomRange((prev) => ({ ...prev, [field]: value }));
    setCustomError("");
  };

  const toggleFilterMenu = () => {
    setShowFilterMenu((prev) => !prev);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Platform overview and key metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div ref={filterMenuRef} className="relative">
            <Button size="sm" variant="outline" onClick={toggleFilterMenu} className="gap-1">
              Filter <ChevronDown className="h-3 w-3" />
            </Button>
            {showFilterMenu && (
              <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border bg-white shadow-lg">
                <div className="flex flex-col divide-y">
                  {DATE_FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleFilterChange(option.key)}
                      className={`text-left px-4 py-2 text-sm transition ${
                        option.key === dateFilterKey ? "bg-primary/10 text-primary" : "hover:bg-muted/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {dateFilterKey === "custom" && (
                  <div className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold text-muted-foreground">Start Date</label>
                      <input
                        type="date"
                        className="rounded-lg border border-muted/50 px-3 py-1 text-sm"
                        value={customRange.start}
                        onChange={(event) => handleCustomChange("start", event.target.value)}
                      />
                      <label className="text-xs font-semibold text-muted-foreground">End Date</label>
                      <input
                        type="date"
                        className="rounded-lg border border-muted/50 px-3 py-1 text-sm"
                        value={customRange.end}
                        onChange={(event) => handleCustomChange("end", event.target.value)}
                      />
                      {customError && <p className="text-xs text-destructive">{customError}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm" asChild>
            <Link to="/admin/designs/new">Add Design</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsToRender.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Leads</CardTitle>
                <CardDescription>Latest inquiries from the platform</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingLeads ? (
              <p className="py-6 text-center text-sm text-muted-foreground">Loading leads...</p>
            ) : recentLeads.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">No recent leads available.</p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-muted/30 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.projectType} · {lead.location}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={`${leadStageStyles[lead.stage] || leadStageStyles.new} rounded-lg px-3 py-1 text-xs font-semibold`}
                  >
                    {lead.stageLabel}
                  </Badge>
                </div>
              ))
            )}
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
