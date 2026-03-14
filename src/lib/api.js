const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const parseJsonSafe = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const body = await parseJsonSafe(response);

  if (!response.ok || !body?.success) {
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
      body: JSON.stringify({ email, password: payload.password }),
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

export { API_BASE_URL };
