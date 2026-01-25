// API utility for landing page
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  // Remove trailing slash if present
  const baseUrl = envUrl.replace(/\/+$/, '');
  // Append /api/v1 if not already present
  if (!baseUrl.includes('/api/v1')) {
    return `${baseUrl}/api/v1`;
  }
  return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export async function submitLandingEnquiry(data: {
  fullName: string;
  email: string;
  phone: string;
  companyOrg?: string;
  message: string;
  haveSource?: string;
}): Promise<ApiResponse<any>> {
  const url = `${API_BASE_URL}/landing-enquiries`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || result.error || 'Failed to submit enquiry',
      };
    }

    return {
      success: true,
      ...result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

