import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Layers, Grid3X3, Paintbrush } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { productTypes, categories, styles } from "@/admin/data/mockAdminData";

const configs = {
  "/admin/product-types": {
    title: "Product Types",
    description: "Define ceiling product classifications",
    icon: Layers,
    data: productTypes,
  },
  "/admin/categories": {
    title: "Categories",
    description: "Room and space categories for designs",
    icon: Grid3X3,
    data: categories,
  },
  "/admin/styles": {
    title: "Styles",
    description: "Design aesthetic classifications",
    icon: Paintbrush,
    data: styles,
  },
};

export default function CatalogManager() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const config = configs[location.pathname] || configs["/admin/product-types"];
  const Icon = config.icon;

  const filtered = useMemo(
    () =>
      config.data.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [config.data, searchQuery],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" /> Add {config.title.replace(/s$/, "")}
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="pl-9 h-9 text-sm"
          placeholder={`Search ${config.title.toLowerCase()}...`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-[3/1] bg-muted flex items-center justify-center">
              <Icon className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    item.status === "active"
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                  }
                >
                  {item.status}
                </Badge>
              </div>
              {"designCount" in item ? (
                <p className="text-xs text-muted-foreground font-mono">
                  {item.designCount} designs
                </p>
              ) : null}
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1">
                  <Pencil className="h-3 w-3" /> Edit
                </Button>
                <Button variant="outline" size="sm" className="h-9 w-9 px-0">
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
