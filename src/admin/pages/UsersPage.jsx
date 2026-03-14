import { useEffect, useMemo, useState } from "react";
import { Eye, Mail, Ban, CheckCircle2, Loader2, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { adminApi } from "@/lib/api";

const statusClass = {
  active: "bg-primary/15 text-primary border-primary/30",
  blocked: "bg-destructive/10 text-destructive border-destructive/20",
  inactive: "bg-secondary text-secondary-foreground border-border",
};

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 20,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      setLoading(true);
      try {
        const data = await adminApi.listUsers({ search, page: 1, limit: 50 });
        if (!cancelled) {
          setUsers(data.users || []);
          setPagination(data.pagination || { page: 1, total: 0, totalPages: 1, limit: 50 });
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error.message || "Failed to fetch users");
          setUsers([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [search]);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "blocked" ? "active" : "blocked";
    setUpdatingUserId(user.id);
    try {
      const data = await adminApi.updateUserStatus(user.id, nextStatus);
      const updatedUser = data.user;
      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, status: updatedUser.status } : item)),
      );
      toast.success(`User ${nextStatus === "blocked" ? "blocked" : "activated"} successfully`);
    } catch (error) {
      toast.error(error.message || "Failed to update user status");
    } finally {
      setUpdatingUserId("");
    }
  };

  const countText = useMemo(() => {
    const total = pagination.total || users.length;
    return `${total} registered users`;
  }, [pagination.total, users.length]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-semibold">Customer Management</h1>
        <p className="mt-1 text-muted-foreground">{countText}</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search customers..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b bg-muted/20 text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium">Contact</th>
                  <th className="px-4 py-3 text-left font-medium">Role</th>
                  <th className="px-4 py-3 text-left font-medium">City</th>
                  <th className="px-4 py-3 text-left font-medium">Enquiries</th>
                  <th className="px-4 py-3 text-left font-medium">Orders</th>
                  <th className="px-4 py-3 text-left font-medium">Joined</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin inline-block mr-2" />
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b last:border-0">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <p>{user.mobile || "N/A"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </td>
                      <td className="px-4 py-3.5 capitalize">{user.role || "user"}</td>
                      <td className="px-4 py-3.5">{user.city || "N/A"}</td>
                      <td className="px-4 py-3.5">{user.enquiries ?? 0}</td>
                      <td className="px-4 py-3.5">{user.orders ?? 0}</td>
                      <td className="px-4 py-3.5">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3.5">
                        <Badge
                          variant="outline"
                          className={statusClass[user.status] || statusClass.inactive}
                        >
                          {capitalize(user.status || "inactive")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => toast.message(`${user.name} (${user.email})`)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => (window.location.href = `mailto:${user.email}`)}
                            title="Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleToggleStatus(user)}
                            disabled={updatingUserId === user.id}
                            title={user.status === "blocked" ? "Unblock user" : "Block user"}
                          >
                            {updatingUserId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : user.status === "blocked" ? (
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                            ) : (
                              <Ban className="h-4 w-4 text-destructive" />
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
    </div>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toISOString().slice(0, 10);
}

function getInitials(name) {
  if (!name) return "NA";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "NA";
  return words
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}
