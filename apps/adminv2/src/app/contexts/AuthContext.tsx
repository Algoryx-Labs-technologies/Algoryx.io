import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import { apiClient } from '@/lib/api';
import {
  clearAuthSession,
  getStoredAdmin,
  getStoredToken,
  setAuthSession,
  StoredAdmin,
} from '@/lib/auth';

interface AdminLoginResponse {
  token: string;
  expiresIn: string;
  admin: StoredAdmin;
}

interface AuthError {
  message: string;
}

interface AuthContextType {
  admin: StoredAdmin | null;
  token: string | null;
  loading: boolean;
  signIn: (
    adminId: string,
    password: string,
    mpin: string,
  ) => Promise<{ admin: StoredAdmin | null; error: AuthError | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<StoredAdmin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrateSession = useCallback(async () => {
    const storedToken = getStoredToken();
    const storedAdmin = getStoredAdmin();

    if (!storedToken || !storedAdmin) {
      clearAuthSession();
      setAdmin(null);
      setToken(null);
      setLoading(false);
      return;
    }

    const response = await apiClient.get<{ admin: StoredAdmin }>('/auth/admin/me');

    if (!response.success || !response.data?.admin) {
      clearAuthSession();
      setAdmin(null);
      setToken(null);
      setLoading(false);
      return;
    }

    setToken(storedToken);
    setAdmin(response.data.admin);
    setLoading(false);
  }, []);

  useEffect(() => {
    hydrateSession();
  }, [hydrateSession]);

  const signIn = async (adminId: string, password: string, mpin: string) => {
    const response = await apiClient.post<AdminLoginResponse>('/auth/admin/login', {
      adminId,
      password,
      mpin,
    });

    if (!response.success || !response.data) {
      return {
        admin: null,
        error: { message: response.error || 'Login failed' },
      };
    }

    setAuthSession(response.data.token, response.data.admin);
    setToken(response.data.token);
    setAdmin(response.data.admin);

    return { admin: response.data.admin, error: null };
  };

  const signOut = () => {
    clearAuthSession();
    setAdmin(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
