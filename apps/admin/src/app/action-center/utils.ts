const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const getAuthToken = async (): Promise<string> => {
  try {
    const { supabase } = await import('@/lib/supabase');
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || '';
  } catch (error) {
    console.error('Error getting auth token:', error);
    return '';
  }
};

export const handleApiRequest = async (
  endpoint: string,
  method: string,
  data: any,
  setLoading: (value: string | null) => void,
  setMessage: (value: { type: 'success' | 'error'; text: string } | null) => void,
  actionName: string,
  onSuccess?: () => void
) => {
  setLoading(actionName);
  setMessage(null);

  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'An error occurred');
    }

    setMessage({ type: 'success', text: `${actionName} completed successfully!` });
    
    if (onSuccess) {
      onSuccess();
    }
  } catch (error: any) {
    setMessage({ type: 'error', text: error.message || `Failed to ${actionName.toLowerCase()}` });
  } finally {
    setLoading(null);
  }
};

export const showMessage = (
  type: 'success' | 'error',
  text: string,
  setMessage: (value: { type: 'success' | 'error'; text: string } | null) => void
) => {
  setMessage({ type, text });
  setTimeout(() => setMessage(null), 5000);
};
