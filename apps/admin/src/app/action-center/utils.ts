const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

export const getAuthToken = () => {
  return localStorage.getItem('auth_token') || '';
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
    const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`,
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
