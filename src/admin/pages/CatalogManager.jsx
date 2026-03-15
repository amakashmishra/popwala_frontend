import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Layers,
  Grid3X3,
  Paintbrush,
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { adminApi } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

const configs = {
  "/admin/product-types": {
    title: "Product Types",
    description: "Define ceiling product classifications",
    icon: Layers,
    resourceName: "Product type",
    itemKey: "type",
    hasImage: false,
    actions: {
      list: adminApi.listTypes,
      create: adminApi.createType,
      get: adminApi.getType,
      update: adminApi.updateType,
      updateStatus: adminApi.updateTypeStatus,
      remove: adminApi.deleteType,
    },
  },
  "/admin/categories": {
    title: "Categories",
    description: "Room and space categories for designs",
    icon: Grid3X3,
    resourceName: "Category",
    itemKey: "category",
    hasImage: false,
    actions: {
      list: adminApi.listCategories,
      create: adminApi.createCategory,
      get: adminApi.getCategory,
      update: adminApi.updateCategory,
      updateStatus: adminApi.updateCategoryStatus,
      remove: adminApi.deleteCategory,
    },
  },
    "/admin/styles": {
      title: "Styles",
      description: "Design aesthetic classifications",
      icon: Paintbrush,
      resourceName: "Style",
      itemKey: "style",
      hasImage: false,
    actions: {
      list: adminApi.listStyles,
      create: adminApi.createStyle,
      get: adminApi.getStyle,
      update: adminApi.updateStyle,
      updateStatus: adminApi.updateStyleStatus,
      remove: adminApi.deleteStyle,
    },
  },
};

const defaultForm = {
  name: "",
  description: "",
  status: "active",
  image: null,
};

const statusStyle = {
  active: "bg-primary/15 text-primary border-primary/30",
  inactive: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function CatalogManager() {
  const location = useLocation();
  const config = configs[location.pathname] || configs["/admin/product-types"];
  const Icon = config.icon;
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 100 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalMode, setModalMode] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setStatusFilter("all");
    setSearch("");
    setSearchInput("");
    setItems([]);
    setPagination({ total: 0, page: 1, limit: 100 });
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await config.actions.list({
        search,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: 1,
        limit: 100,
      });
      setItems(response.items || []);
      setPagination(response.pagination || { total: response.items?.length || 0, page: 1, limit: 100 });
    } catch (error) {
      toast.error(error.message || `Unable to load ${config.title.toLowerCase()}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config, search, statusFilter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resourceLabel = useMemo(() => config.resourceName, [config.resourceName]);
  const totalItemsText = useMemo(() => {
    const total = pagination.total || items.length;
    return `${total} ${config.title.toLowerCase()} configured`;
  }, [config.title, items.length, pagination.total]);

  const openCreate = () => {
    setModalMode("create");
    setSelectedItem(null);
    setForm({ ...defaultForm });
    setPreviewUrl("");
  };

  const openEdit = async (id) => {
    try {
      const data = await config.actions.get(id);
      const record = data[config.itemKey];
      setSelectedItem(record);
      setForm({
        name: record?.name || "",
        description: record?.description || "",
        status: record?.status || "active",
        image: null,
      });
      setPreviewUrl(config.hasImage ? record?.imageUrl || "" : "");
      setModalMode("edit");
    } catch (error) {
      toast.error(error.message || `Failed to fetch ${resourceLabel.toLowerCase()}`);
    }
  };

  const closeModal = () => {
    setModalMode("");
    setSelectedItem(null);
    setForm({ ...defaultForm });
    setPreviewUrl("");
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, image: file || null }));
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : selectedItem?.imageUrl || "");
  };

  const buildPayload = () => {
    if (config.hasImage) {
      const fields = new FormData();
      fields.append("name", form.name.trim());
      fields.append("description", form.description);
      fields.append("status", form.status);
      if (form.image) {
        fields.append("image", form.image);
      }
      return fields;
    }
    return {
      name: form.name.trim(),
      description: form.description,
      status: form.status,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name.trim()) {
      toast.error(`${resourceLabel} name is required`);
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await config.actions.create(buildPayload());
        toast.success(`${resourceLabel} created`);
      } else if (modalMode === "edit" && selectedItem?.id) {
        await config.actions.update(selectedItem.id, buildPayload());
        toast.success(`${resourceLabel} updated`);
      }
      closeModal();
      fetchItems();
    } catch (error) {
      toast.error(error.message || `Failed to save ${resourceLabel.toLowerCase()}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === "active" ? "inactive" : "active";
    setTogglingId(item.id);
    try {
      await config.actions.updateStatus(item.id, nextStatus);
      toast.success(`${resourceLabel} ${nextStatus === "active" ? "activated" : "deactivated"}`);
      fetchItems();
    } catch (error) {
      toast.error(error.message || `Failed to update ${resourceLabel.toLowerCase()} status`);
    } finally {
      setTogglingId("");
    }
  };

  const promptDelete = (item) => {
    setDeleteTarget({ id: item.id, label: item.name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await config.actions.remove(deleteTarget.id);
      toast.success(`${resourceLabel} deleted`);
      fetchItems();
    } catch (error) {
      toast.error(error.message || `Failed to delete ${resourceLabel.toLowerCase()}`);
    } finally {
      setDeletingId("");
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">{config.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{config.description}</p>
          <p className="text-xs text-muted-foreground mt-1">{totalItemsText}</p>
        </div>
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" /> Add {resourceLabel}
        </Button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-input bg-background/50 p-4 shadow-sm md:flex-row md:items-center">
        <div className="flex w-full flex-wrap items-center gap-3 rounded-full border border-muted/30 bg-white px-4 py-2 shadow-inner md:max-w-[640px]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="w-full flex-1 border-none bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
            placeholder={`Search ${config.title.toLowerCase()}...`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 md:ml-3">
          {["all", "active", "inactive"].map((status) => {
            const isActive = statusFilter === status;
            return (
              <Button
                key={status}
                size="xs"
                variant="ghost"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#cd9b42] text-white shadow-sm shadow-[#b27c23]/30"
                    : "bg-white text-muted-foreground border border-muted/30 hover:border-muted/60"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            );
          })}
        </div>
      </div>

      {config.hasImage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {loading ? (
            <Card className="col-span-full">
              <CardContent className="text-center text-muted-foreground">
                <Loader2 className="animate-spin h-4 w-4 inline-block mr-2" />
                Loading {config.title.toLowerCase()}...
              </CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="text-muted-foreground text-center">No {config.title.toLowerCase()} found.</CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-[3/1] bg-muted flex items-center justify-center">
                  {config.hasImage && item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="object-cover h-full w-full" />
                  ) : (
                    <Icon className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description || "No description"}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={statusStyle[item.status] || statusStyle.inactive}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEdit(item.id)}
                    >
                      <Pencil className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-9 px-2"
                      onClick={() => handleToggleStatus(item)}
                      disabled={togglingId === item.id}
                    >
                      {togglingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : item.status === "active" ? (
                        "Deactivate"
                      ) : (
                        "Activate"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-2 text-destructive"
                      onClick={() => promptDelete(item)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Description</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Created</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                        Loading {config.title.toLowerCase()}...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                        No {config.title.toLowerCase()} found.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => (
                      <tr key={item.id} className="border-b last:border-0">
                        <td className="px-4 py-3.5">
                          <p className="font-medium">{item.name}</p>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground">
                          {item.description || "-"}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge
                            variant="outline"
                            className={statusStyle[item.status] || statusStyle.inactive}
                          >
                            {item.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5">{formatDate(item.createdAt)}</td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(item.id)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs h-9 px-2"
                              onClick={() => handleToggleStatus(item)}
                              disabled={togglingId === item.id}
                            >
                              {togglingId === item.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : item.status === "active" ? (
                                "Deactivate"
                              ) : (
                                "Activate"
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => promptDelete(item)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-stretch justify-end">
          <div className="h-full w-full max-w-2xl border-l bg-card shadow-2xl flex flex-col">
            <div className="p-5 border-b">
              <h2 className="text-xl font-display font-semibold">
                {modalMode === "create" ? `Create ${resourceLabel}` : `Edit ${resourceLabel}`}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <form className="space-y-4" onSubmit={handleSubmit}>
                {config.hasImage && (
                  <div>
                    <Label className="text-xs">Image (optional)</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-1.5"
                      onChange={(event) => handleImageChange(event.target.files?.[0] || null)}
                    />
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mt-2 h-40 w-full rounded-md border object-cover"
                      />
                    ) : (
                      <div className="mt-2 h-40 w-full rounded-md border border-dashed bg-muted/30 flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-5 w-5 mr-2" />
                        No image selected
                      </div>
                    )}
                  </div>
                )}
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                    className="mt-1.5 w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Status</Label>
                  <select
                    value={form.status}
                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin inline-block -ml-1 mr-1" />
                    ) : null}
                    {modalMode === "create" ? `Create ${resourceLabel}` : `Save ${resourceLabel}`}
                  </Button>
                  <Button variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete this ${resourceLabel}?`}
        description={`Are you sure you want to delete ${deleteTarget?.label || "this item"}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmLoading={deletingId === deleteTarget?.id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
