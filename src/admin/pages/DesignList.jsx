import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Palette, Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { designs } from "@/admin/data/mockAdminData";

const statusClass = {
  active: "bg-primary/15 text-primary border-primary/30",
  draft: "bg-secondary text-secondary-foreground border-border",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function DesignList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(
    () =>
      designs.filter((item) => {
        const matchSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === "all" || item.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [searchQuery, statusFilter],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">Designs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {designs.length} ceiling designs in catalog
          </p>
        </div>
        <Button size="sm" asChild>
          <Link to="/admin/designs/new">
            <Plus className="h-3.5 w-3.5" /> Add Design
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-60 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {["all", "active", "draft", "inactive"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                statusFilter === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((design) => (
          <Card key={design.id} className="overflow-hidden">
            <div className="aspect-[4/3] bg-muted relative flex items-center justify-center">
              <Palette className="h-8 w-8 text-muted-foreground/40" />
              <div className="absolute top-2 left-2 flex gap-1.5">
                {design.featured ? <Badge>Featured</Badge> : null}
                {design.popular ? <Badge variant="secondary">Popular</Badge> : null}
              </div>
              <div className="absolute top-2 right-2">
                <Badge
                  variant="outline"
                  className={statusClass[design.status] || statusClass.inactive}
                >
                  {design.status}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold">{design.title}</h3>
                <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                  ${design.pricePerSqFt.toFixed(2)}/sqft
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{design.description}</p>
              <div className="pt-2 border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" /> {design.views.toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" /> {design.enquiries}
                  </span>
                </div>
                <span className="bg-muted px-1.5 py-0.5 rounded">{design.productType}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-muted-foreground">
          No designs found matching your criteria.
        </div>
      ) : null}
    </div>
  );
}
