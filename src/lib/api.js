import { clearPortalSession } from "@/lib/portalAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const getPortalLoginPath = () => {
  const currentPath = window.location.pathname || "";
  if (currentPath.startsWith("/admin")) return "/admin/login";
  if (currentPath.startsWith("/architect")) return "/architect/login";
  if (currentPath.startsWith("/contractor")) return "/contractor/login";
  return null;
};

const getPortalRefreshPath = () => {
  const currentPath = window.location.pathname || "";
  if (currentPath.startsWith("/admin")) return "/admin/auth/refresh-token";
  if (currentPath.startsWith("/architect")) return "/architect/auth/refresh-token";
  if (currentPath.startsWith("/contractor")) return "/contractor/auth/refresh-token";
  return null;
};

const isLoginRequestPath = (path = "") =>
  path.includes("/auth/login") ||
  path.includes("/auth/forgot-password") ||
  path.includes("/auth/reset-password") ||
  path.includes("/auth/refresh-token");

const refreshPortalToken = async () => {
  const refreshPath = getPortalRefreshPath();
  if (!refreshPath) return false;

  const response = await fetch(`${API_BASE_URL}${refreshPath}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const body = await parseJsonSafe(response);
  return Boolean(response.ok && body?.success);
};

const handleUnauthorizedRedirect = (path, body) => {
  const errorCode = body?.errorCode || "";
  if (errorCode !== "UNAUTHORIZED") return;
  if (isLoginRequestPath(path)) return;

  const loginPath = getPortalLoginPath();
  if (!loginPath) return;

  clearPortalSession();
  if (window.location.pathname !== loginPath) {
    window.location.replace(loginPath);
  }
};

const request = async (path, options = {}, retryOnUnauthorized = true) => {
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = isFormData
    ? { ...(options.headers || {}) }
    : {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers,
    ...options,
  });

  const body = await parseJsonSafe(response);

  if (!response.ok || !body?.success) {
    if (response.status === 401) {
      if (retryOnUnauthorized && !isLoginRequestPath(path)) {
        const refreshed = await refreshPortalToken();
        if (refreshed) {
          return request(path, options, false);
        }
      }
      handleUnauthorizedRedirect(path, body);
    }
    throw new Error(body?.message || "Request failed");
  }

  return body.data || {};
};

export const authApi = {
  register(payload) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  login(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  forgotPassword(payload) {
    return request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  verifyEmailOtp(payload) {
    return request("/auth/verify-email-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  resendEmailOtp(payload) {
    return request("/auth/resend-email-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  resetPassword(payload) {
    return request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  me() {
    return request("/users/me");
  },
  getGoogleUrl(redirectUrl) {
    const target = new URL(`${API_BASE_URL}/auth/google`);
    if (redirectUrl) {
      target.searchParams.set("redirect", redirectUrl);
    }
    return target.toString();
  },
};

export const adminApi = {
  login(payload) {
    const email = payload.email || payload.identifier;
    return request("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password: payload.password,
        rememberMe: Boolean(payload.rememberMe),
      }),
    });
  },

  me() {
    return request("/admin/auth/profile");
  },

  forgotPassword(payload) {
    return request("/admin/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  resetPassword(payload) {
    return request("/admin/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  changePassword(payload) {
    return request("/admin/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  listUsers({ search = "", page = 1, limit = 20, role, status } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    if (role) query.set("role", role);
    if (status) query.set("status", status);

    return request(`/admin/users?${query.toString()}`);
  },

  updateUserStatus(userId, status) {
    return request(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  listContractors({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));

    return request(`/admin/contractors?${query.toString()}`);
  },

  createContractor(payload) {
    return request("/admin/contractors", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getContractor(contractorId) {
    return request(`/admin/contractors/${contractorId}`);
  },

  updateContractor(contractorId, payload) {
    return request(`/admin/contractors/${contractorId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteContractor(contractorId) {
    return request(`/admin/contractors/${contractorId}`, {
      method: "DELETE",
    });
  },

  listArchitects({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));

    return request(`/admin/architects?${query.toString()}`);
  },

  createArchitect(payload) {
    return request("/admin/architects", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getArchitect(architectId) {
    return request(`/admin/architects/${architectId}`);
  },

  updateArchitect(architectId, payload) {
    return request(`/admin/architects/${architectId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteArchitect(architectId) {
    return request(`/admin/architects/${architectId}`, {
      method: "DELETE",
    });
  },

  listBanners({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    return request(`/admin/banners?${query.toString()}`);
  },

  createBanner(formData) {
    return request("/admin/banners", {
      method: "POST",
      body: formData,
    });
  },

  getBanner(bannerId) {
    return request(`/admin/banners/${bannerId}`);
  },

  updateBanner(bannerId, formData) {
    return request(`/admin/banners/${bannerId}`, {
      method: "PUT",
      body: formData,
    });
  },

  updateBannerStatus(bannerId, status) {
    return request(`/admin/banners/${bannerId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  deleteBanner(bannerId) {
    return request(`/admin/banners/${bannerId}`, {
      method: "DELETE",
    });
  },
  listRecentLeads() {
    return request("/admin/leads/recent");
  },
  getDashboardStats(filters = {}) {
    const query = new URLSearchParams();
    if (filters.startDate) query.set("startDate", filters.startDate);
    if (filters.endDate) query.set("endDate", filters.endDate);
    const path = query.toString()
      ? `/admin/dashboard/stats?${query.toString()}`
      : "/admin/dashboard/stats";
    return request(path);
  },
  listTypes({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    return request(`/admin/product-types?${query.toString()}`);
  },
  createType(payload) {
    return request("/admin/product-types", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getType(typeId) {
    return request(`/admin/product-types/${typeId}`);
  },
  updateType(typeId, payload) {
    return request(`/admin/product-types/${typeId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  updateTypeStatus(typeId, status) {
    return request(`/admin/product-types/${typeId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  deleteType(typeId) {
    return request(`/admin/product-types/${typeId}`, {
      method: "DELETE",
    });
  },
  listPopularDeals({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    return request(`/admin/popular-deals?${query.toString()}`);
  },
  createPopularDeal(formData) {
    return request("/admin/popular-deals", {
      method: "POST",
      body: formData,
    });
  },
  getPopularDeal(id) {
    return request(`/admin/popular-deals/${id}`);
  },
  updatePopularDeal(id, formData) {
    return request(`/admin/popular-deals/${id}`, {
      method: "PUT",
      body: formData,
    });
  },
  updatePopularDealStatus(id, status) {
    return request(`/admin/popular-deals/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  deletePopularDeal(id) {
    return request(`/admin/popular-deals/${id}`, {
      method: "DELETE",
    });
  },
  listPromotions({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    return request(`/admin/promotions?${query.toString()}`);
  },
  createPromotion(formData) {
    return request("/admin/promotions", {
      method: "POST",
      body: formData,
    });
  },
  getPromotion(id) {
    return request(`/admin/promotions/${id}`);
  },
  updatePromotion(id, formData) {
    return request(`/admin/promotions/${id}`, {
      method: "PUT",
      body: formData,
    });
  },
  updatePromotionStatus(id, status) {
    return request(`/admin/promotions/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  deletePromotion(id) {
    return request(`/admin/promotions/${id}`, {
      method: "DELETE",
    });
  },
  listCategories({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    return request(`/admin/categories?${query.toString()}`);
  },
  createCategory(payload) {
    return request("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getCategory(categoryId) {
    return request(`/admin/categories/${categoryId}`);
  },
  updateCategory(categoryId, payload) {
    return request(`/admin/categories/${categoryId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  updateCategoryStatus(categoryId, status) {
    return request(`/admin/categories/${categoryId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  deleteCategory(categoryId) {
    return request(`/admin/categories/${categoryId}`, {
      method: "DELETE",
    });
  },
  listStyles({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    return request(`/admin/styles?${query.toString()}`);
  },
  createStyle(formData) {
    return request("/admin/styles", {
      method: "POST",
      body: formData,
    });
  },
  getStyle(styleId) {
    return request(`/admin/styles/${styleId}`);
  },
  updateStyle(styleId, formData) {
    return request(`/admin/styles/${styleId}`, {
      method: "PUT",
      body: formData,
    });
  },
  updateStyleStatus(styleId, status) {
    return request(`/admin/styles/${styleId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  deleteStyle(styleId) {
    return request(`/admin/styles/${styleId}`, {
      method: "DELETE",
    });
  },
  listServices({ search = "", status, page = 1, limit = 20 } = {}) {
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (status) query.set("status", status);
    if (page) query.set("page", String(page));
    if (limit) query.set("limit", String(limit));
    return request(`/admin/services?${query.toString()}`);
  },
  createService(formData) {
    return request("/admin/services", {
      method: "POST",
      body: formData,
    });
  },
  getService(serviceId) {
    return request(`/admin/services/${serviceId}`);
  },
  updateService(serviceId, formData) {
    return request(`/admin/services/${serviceId}`, {
      method: "PUT",
      body: formData,
    });
  },
  updateServiceStatus(serviceId, status) {
    return request(`/admin/services/${serviceId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
  deleteService(serviceId) {
    return request(`/admin/services/${serviceId}`, {
      method: "DELETE",
    });
  },
};

export const architectApi = {
  login(payload) {
    return request("/architect/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  me() {
    return request("/architect/me");
  },
};

export const contractorApi = {
  login(payload) {
    return request("/contractor/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  me() {
    return request("/contractor/me");
  },
};

export const websiteApi = {
  getHomepageBanners() {
    return request("/banners");
  },
  getTypes() {
    return request("/catalog/types");
  },
  getCategories() {
    return request("/catalog/categories");
  },
  getStyles() {
    return request("/catalog/styles");
  },
  getServices() {
    return request("/services");
  },
  getPopularDeals() {
    return request("/marketing/popular-deals");
  },
  getPromotions() {
    return request("/marketing/promotions");
  },
};

export { API_BASE_URL };
