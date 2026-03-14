const SESSION_KEY = "popwala-portal-session";
const SESSION_KEY_NON_PERSISTENT = "popwala-portal-session-temp";

export function setPortalSession(role, user, rememberMe = true) {
  const payload = JSON.stringify({
    role,
    user,
    rememberMe: Boolean(rememberMe),
    timestamp: Date.now(),
  });

  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY_NON_PERSISTENT);

  if (rememberMe) {
    localStorage.setItem(SESSION_KEY, payload);
    return;
  }

  sessionStorage.setItem(SESSION_KEY_NON_PERSISTENT, payload);
}

export function getPortalSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY_NON_PERSISTENT);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function clearPortalSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY_NON_PERSISTENT);
}

export function hasPortalRole(role) {
  const session = getPortalSession();
  return Boolean(session?.role === role);
}
