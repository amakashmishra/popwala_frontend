import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Eye, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const baseForm = {
  name: "",
  email: "",
  phoneNumber: "",
  companyName: "",
  address: "",
  status: "active",
};

const getInitialCreateForm = () => ({
  ...baseForm,
  password: generateRandomPassword(12),
});

const statusStyle = {
  active: "bg-primary/15 text-primary border-primary/30",
  inactive: "bg-secondary text-secondary-foreground border-border",
};

export default function ArchitectsPage() {
  const [architects, setArchitects] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalMode, setModalMode] = useState("");
  const [selectedArchitect, setSelectedArchitect] = useState(null);
  const [form, setForm] = useState(baseForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchArchitects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.listArchitects({
        search,
        status: statusFilter === "all" ? undefined : statusFilter,
        page: 1,
        limit: 100,
      });

      setArchitects(data.architects || []);
      setPagination(data.pagination || { total: 0, page: 1, limit: 100 });
    } catch (error) {
      toast.error(error.message || "Failed to load architects");
      setArchitects([]);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchArchitects();
  }, [fetchArchitects]);

  const architectCountText = useMemo(() => {
    const total = pagination.total || architects.length;
    return `${total} architects registered`;
  }, [pagination.total, architects.length]);

  const openCreate = () => {
    setModalMode("create");
    setSelectedArchitect(null);
    setForm(getInitialCreateForm());
  };

  const openView = async (id) => {
    try {
      const data = await adminApi.getArchitect(id);
      setSelectedArchitect(data.architect);
      setModalMode("view");
    } catch (error) {
      toast.error(error.message || "Failed to fetch architect details");
    }
  };

  const openEdit = async (id) => {
    try {
      const data = await adminApi.getArchitect(id);
      setSelectedArchitect(data.architect);
      setForm({
        ...baseForm,
        name: data.architect.name || "",
        email: data.architect.email || "",
        phoneNumber: data.architect.phoneNumber || "",
        companyName: data.architect.companyName || "",
        address: data.architect.address || "",
        status: data.architect.status || "active",
      });
      setModalMode("edit");
    } catch (error) {
      toast.error(error.message || "Failed to fetch architect details");
    }
  };

  const closeModal = () => {
    setModalMode("");
    setSelectedArchitect(null);
    setForm(baseForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (modalMode === "create") {
        await adminApi.createArchitect({
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          companyName: form.companyName,
          address: form.address,
          status: form.status,
          password: form.password,
        });
        toast.success("Architect created");
      } else if (modalMode === "edit" && selectedArchitect?.id) {
        await adminApi.updateArchitect(selectedArchitect.id, {
          name: form.name,
          email: form.email,
          phoneNumber: form.phoneNumber,
          companyName: form.companyName,
          address: form.address,
          status: form.status,
        });
        toast.success("Architect updated");
      }
      closeModal();
      fetchArchitects();
    } catch (error) {
      toast.error(error.message || "Failed to save architect");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this architect?");
    if (!confirmDelete) return;

    setDeletingId(id);
    try {
      await adminApi.deleteArchitect(id);
      toast.success("Architect deleted");
      fetchArchitects();
    } catch (error) {
      toast.error(error.message || "Failed to delete architect");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-display font-semibold">Architect Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">{architectCountText}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add Architect
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
                placeholder="Search by name, email, phone or company..."
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
                  <th className="px-4 py-3 text-left font-medium">Architect</th>
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Phone</th>
                  <th className="px-4 py-3 text-left font-medium">Company</th>
                  <th className="px-4 py-3 text-left font-medium">Address</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                      Loading architects...
                    </td>
                  </tr>
                ) : architects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                      No architects found.
                    </td>
                  </tr>
                ) : (
                  architects.map((architect) => (
                    <tr key={architect.id} className="border-b last:border-0">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs">
                            {initials(architect.name)}
                          </div>
                          <p className="font-medium">{architect.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">{architect.email}</td>
                      <td className="px-4 py-3.5">{architect.phoneNumber}</td>
                      <td className="px-4 py-3.5">{architect.companyName}</td>
                      <td className="px-4 py-3.5">{architect.address}</td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={statusStyle[architect.status] || statusStyle.inactive}
                        >
                          {capitalize(architect.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openView(architect.id)} title="View Architect">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(architect.id)} title="Edit Architect">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDelete(architect.id)}
                            disabled={deletingId === architect.id}
                            title="Delete Architect"
                          >
                            {deletingId === architect.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
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

      {modalMode ? (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-xl border bg-card p-5 shadow-xl">
            <div className="mb-4">
              <h2 className="text-xl font-display font-semibold">
                {modalMode === "create" ? "Create Architect" : modalMode === "edit" ? "Edit Architect" : "Architect Details"}
              </h2>
            </div>

            {modalMode === "view" && selectedArchitect ? (
              <div className="space-y-2 text-sm">
                <InfoRow label="Name" value={selectedArchitect.name} />
                <InfoRow label="Email" value={selectedArchitect.email} />
                <InfoRow label="Phone Number" value={selectedArchitect.phoneNumber} />
                <InfoRow label="Company Name" value={selectedArchitect.companyName} />
                <InfoRow label="Address" value={selectedArchitect.address} />
                <InfoRow label="Status" value={capitalize(selectedArchitect.status)} />
                <div className="pt-3">
                  <Button variant="outline" onClick={closeModal}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-3" onSubmit={handleSubmit}>
                <Field label="Name" value={form.name} onChange={(value) => setForm((p) => ({ ...p, name: value }))} />
                <Field label="Email" type="email" value={form.email} onChange={(value) => setForm((p) => ({ ...p, email: value }))} />
                {modalMode === "create" ? (
                  <div>
                    <Label className="text-xs">Password</Label>
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        type="text"
                        value={form.password || ""}
                        onChange={(event) => setForm((p) => ({ ...p, password: event.target.value }))}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setForm((p) => ({ ...p, password: generateRandomPassword(12) }))}
                      >
                        Regenerate
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      This password will be emailed to the architect after creation.
                    </p>
                  </div>
                ) : null}
                <Field
                  label="Phone Number"
                  value={form.phoneNumber}
                  onChange={(value) => setForm((p) => ({ ...p, phoneNumber: value }))}
                />
                <Field
                  label="Company Name"
                  value={form.companyName}
                  onChange={(value) => setForm((p) => ({ ...p, companyName: value }))}
                />
                <div>
                  <Label className="text-xs">Address</Label>
                  <textarea
                    value={form.address}
                    onChange={(event) => setForm((p) => ({ ...p, address: event.target.value }))}
                    className="mt-1.5 w-full min-h-[82px] rounded-md border border-input bg-background px-3 py-2 text-sm"
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
      ) : null}
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
    <div className="grid grid-cols-[130px_1fr] gap-3">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium break-words">{value || "N/A"}</p>
    </div>
  );
}

function capitalize(text = "") {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function initials(name = "") {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "NA";
  return parts
    .slice(0, 2)
    .map((item) => item[0].toUpperCase())
    .join("");
}

function generateRandomPassword(length = 12) {
  const uppers = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lowers = "abcdefghijkmnopqrstuvwxyz";
  const digits = "23456789";
  const symbols = "!@#$%&*?";
  const all = `${uppers}${lowers}${digits}${symbols}`;

  const chars = [
    randomChar(uppers),
    randomChar(lowers),
    randomChar(digits),
    randomChar(symbols),
  ];

  while (chars.length < length) {
    chars.push(randomChar(all));
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
}

function randomChar(source) {
  return source[randomIndex(source.length)];
}

function randomIndex(max) {
  if (globalThis.crypto?.getRandomValues) {
    const arr = new Uint32Array(1);
    globalThis.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}
