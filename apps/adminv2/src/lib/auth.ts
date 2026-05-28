const TOKEN_KEY = 'adminv2_token';
const ADMIN_KEY = 'adminv2_admin';

export interface StoredAdmin {
  id: string;
  role: 'admin';
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdmin(): StoredAdmin | null {
  const raw = localStorage.getItem(ADMIN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAdmin;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, admin: StoredAdmin): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
}
