import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import ConfirmDialog from "@/components/ConfirmDialog";

const initialForm = {
  titleEn: "",
  titleHi: "",
  titleMr: "",
  descriptionEn: "",
  descriptionHi: "",
  descriptionMr: "",
  status: "active",
  image: null,
};

const statusStyle = {
  active: "bg-primary/15 text-primary border-primary/30",
  inactive: "bg-secondary text-secondary-foreground border-border",
};

export default function WebsiteBannersPage() {
  const [banners, setBanners] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalMode, setModalMode] = useState("");
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId, setTogglingId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.listBanners({
        search,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: 1,
        limit: 100,
      });
      setBanners(data.banners || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 100 });
    } catch (error) {
      toast.error(error.message || "Failed to load banners");
      setBanners([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  useEffect(
    () => () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

  const bannerCountText = useMemo(() => {
    const total = pagination.total || banners.length;
    return `${total} banners configured`;
  }, [pagination.total, banners.length]);

  const openCreate = () => {
    setModalMode("create");
    setSelectedBanner(null);
    setForm(initialForm);
    setPreviewUrl("");
  };

  const openView = async (id) => {
    try {
      const data = await adminApi.getBanner(id);
      setSelectedBanner(data.banner);
      setModalMode("view");
    } catch (error) {
      toast.error(error.message || "Failed to fetch banner");
    }
  };

  const openEdit = async (id) => {
    try {
      const data = await adminApi.getBanner(id);
      setSelectedBanner(data.banner);
      setForm({
        titleEn: data.banner.title?.en || "",
        titleHi: data.banner.title?.hi || "",
        titleMr: data.banner.title?.mr || "",
        descriptionEn: data.banner.description?.en || "",
        descriptionHi: data.banner.description?.hi || "",
        descriptionMr: data.banner.description?.mr || "",
        status: data.banner.status || "active",
        image: null,
      });
      setPreviewUrl(data.banner.imageUrl || "");
      setModalMode("edit");
    } catch (error) {
      toast.error(error.message || "Failed to fetch banner");
    }
  };

  const closeModal = () => {
    setModalMode("");
    setSelectedBanner(null);
    setForm(initialForm);
    setPreviewUrl("");
  };

  const handleImageChange = (file) => {
    setForm((prev) => ({ ...prev, image: file || null }));
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(file ? URL.createObjectURL(file) : selectedBanner?.imageUrl || "");
  };

  const buildBannerFormData = () => {
    const data = new FormData();
    data.append("titleEn", form.titleEn);
    data.append("titleHi", form.titleHi);
    data.append("titleMr", form.titleMr);
    data.append("descriptionEn", form.descriptionEn);
    data.append("descriptionHi", form.descriptionHi);
    data.append("descriptionMr", form.descriptionMr);
    data.append("status", form.status);
    if (form.image) {
      data.append("image", form.image);
    }
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (modalMode === "create" && !form.image) {
      toast.error("Banner image is required");
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await adminApi.createBanner(buildBannerFormData());
        toast.success("Banner created");
      } else if (modalMode === "edit" && selectedBanner?.id) {
        await adminApi.updateBanner(selectedBanner.id, buildBannerFormData());
        toast.success("Banner updated");
      }
      closeModal();
      fetchBanners();
    } catch (error) {
      toast.error(error.message || "Failed to save banner");
    } finally {
      setSubmitting(false);
    }
  };

  const promptDeleteBanner = (banner) => {
    setDeleteTarget({ id: banner.id, label: banner.title?.en || "banner" });
  };

  const confirmDeleteBanner = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await adminApi.deleteBanner(deleteTarget.id);
      toast.success("Banner deleted");
      fetchBanners();
    } catch (error) {
      toast.error(error.message || "Failed to delete banner");
    } finally {
      setDeletingId("");
      setDeleteTarget(null);
    }
  };

  const handleToggleStatus = async (banner) => {
    const nextStatus = banner.status === "active" ? "inactive" : "active";
    setTogglingId(banner.id);
    try {
      await adminApi.updateBannerStatus(banner.id, nextStatus);
      toast.success(`Banner ${nextStatus === "active" ? "activated" : "deactivated"}`);
      fetchBanners();
    } catch (error) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setTogglingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">Website Banners</h1>
          <p className="mt-1 text-sm text-muted-foreground">{bannerCountText}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Banner
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
                placeholder="Search by title or description..."
              />
            </div>
            <div className="flex gap-1">
              {["all", "active", "inactive"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatusFilter(item)}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
                    statusFilter === item
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">Image</th>
                  <th className="px-4 py-3 text-left font-medium">Title (EN)</th>
                  <th className="px-4 py-3 text-left font-medium">Description (EN)</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                      Loading banners...
                    </td>
                  </tr>
                ) : banners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      No banners found.
                    </td>
                  </tr>
                ) : (
                  banners.map((banner) => (
                    <tr key={banner.id} className="border-b last:border-0">
                      <td className="px-4 py-3.5">
                        <img src={banner.imageUrl} alt={banner.title?.en || "Banner"} className="h-16 w-28 rounded-md object-cover border" />
                      </td>
                      <td className="px-4 py-3.5 font-medium">{banner.title?.en || "N/A"}</td>
                      <td className="px-4 py-3.5 max-w-[440px] truncate">{banner.description?.en || "N/A"}</td>
                      <td className="px-4 py-3.5">
                        <Badge variant="outline" className={statusStyle[banner.status] || statusStyle.inactive}>
                          {capitalize(banner.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(banner.id)} title="View Banner">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(banner.id)} title="Edit Banner">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs"
                            onClick={() => handleToggleStatus(banner)}
                            disabled={togglingId === banner.id}
                            title="Activate/Deactivate"
                          >
                            {togglingId === banner.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : banner.status === "active" ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => promptDeleteBanner(banner)}
                            disabled={deletingId === banner.id}
                            title="Delete Banner"
                          >
                            {deletingId === banner.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
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

      {modalMode ? (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-stretch justify-end">
          <div className="h-full w-full max-w-2xl border-l bg-card shadow-2xl flex flex-col">
            <div className="p-5 border-b">
              <h2 className="text-xl font-display font-semibold">
                {modalMode === "create" ? "Create Banner" : modalMode === "edit" ? "Edit Banner" : "Banner Details"}
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-5">

              {modalMode === "view" && selectedBanner ? (
                <div className="space-y-3 text-sm">
                  <img src={selectedBanner.imageUrl} alt={selectedBanner.title?.en || "Banner"} className="w-full h-56 rounded-md object-cover border" />
                  <InfoRow label="Title (English)" value={selectedBanner.title?.en} />
                  <InfoRow label="Title (Hindi)" value={selectedBanner.title?.hi} />
                  <InfoRow label="Title (Marathi)" value={selectedBanner.title?.mr} />
                  <InfoRow label="Description (English)" value={selectedBanner.description?.en} />
                  <InfoRow label="Description (Hindi)" value={selectedBanner.description?.hi} />
                  <InfoRow label="Description (Marathi)" value={selectedBanner.description?.mr} />
                  <InfoRow label="Status" value={capitalize(selectedBanner.status)} />
                  <div className="pt-3">
                    <Button variant="outline" onClick={closeModal}>
                      Close
                    </Button>
                  </div>
                </div>
              ) : (
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div>
                    <Label className="text-xs">Banner Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      className="mt-1.5"
                      onChange={(event) => handleImageChange(event.target.files?.[0] || null)}
                      required={modalMode === "create"}
                    />
                    {previewUrl ? (
                      <img src={previewUrl} alt="Banner preview" className="mt-2 h-40 w-full rounded-md border object-cover" />
                    ) : (
                      <div className="mt-2 h-40 w-full rounded-md border border-dashed bg-muted/30 flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-5 w-5 mr-2" />
                        No image selected
                      </div>
                    )}
                  </div>
                  <Field label="Title (English)" value={form.titleEn} onChange={(value) => setForm((p) => ({ ...p, titleEn: value }))} />
                  <Field label="Title (Hindi)" value={form.titleHi} onChange={(value) => setForm((p) => ({ ...p, titleHi: value }))} />
                  <Field label="Title (Marathi)" value={form.titleMr} onChange={(value) => setForm((p) => ({ ...p, titleMr: value }))} />
                  <div>
                    <Label className="text-xs">Description (English)</Label>
                    <textarea
                      value={form.descriptionEn}
                      onChange={(event) => setForm((p) => ({ ...p, descriptionEn: event.target.value }))}
                      className="mt-1.5 w-full min-h-[82px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description (Hindi)</Label>
                    <textarea
                      value={form.descriptionHi}
                      onChange={(event) => setForm((p) => ({ ...p, descriptionHi: event.target.value }))}
                      className="mt-1.5 w-full min-h-[82px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Description (Marathi)</Label>
                    <textarea
                      value={form.descriptionMr}
                      onChange={(event) => setForm((p) => ({ ...p, descriptionMr: event.target.value }))}
                      className="mt-1.5 w-full min-h-[96px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Status</Label>
                    <select
                      value={form.status}
                      onChange={(event) => setForm((p) => ({ ...p, status: event.target.value }))}
                      className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="pt-3 flex items-center gap-2">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : modalMode === "create" ? "Create" : "Update"}
                    </Button>
                    <Button type="button" variant="outline" onClick={closeModal} disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      ) : null}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this banner?"
        description={`Are you sure you want to delete ${deleteTarget?.label || "this banner"}? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmLoading={deletingId === deleteTarget?.id}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDeleteBanner}
      />
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1.5" required />
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value || "N/A"}</p>
    </div>
  );
}

function capitalize(text = "") {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
