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

export { API_BASE_URL };
