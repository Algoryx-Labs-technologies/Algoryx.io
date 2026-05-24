// API utility for landing page (apiv2)
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:4001';
  const baseUrl = envUrl.replace(/\/+$/, '');
  if (!baseUrl.includes('/api/v2')) {
    return `${baseUrl}/api/v2`;
  }
  return baseUrl;
};

const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export type SupportCategory =
  | 'general'
  | 'technical'
  | 'billing'
  | 'feature-request'
  | 'account'
  | 'other';

export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SubmitSupportTicketInput {
  name: string;
  email: string;
  subject: string;
  category: SupportCategory;
  priority: SupportPriority;
  description: string;
  attachment?: File | null;
}

export async function sendLandingChatMessage(
  messages: ChatMessage[],
): Promise<ApiResponse<{ message: string }>> {
  const url = `${API_BASE_URL}/landing-chat`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || result.message || 'Failed to get a reply',
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

export async function submitLandingEnquiry(data: {
  fullName: string;
  email: string;
  phone: string;
  companyOrg?: string;
  message: string;
  haveSource?: string;
}): Promise<ApiResponse<{ id: string }>> {
  const url = `${API_BASE_URL}/landing-requirements`;

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
      const validationError =
        result.errors &&
        Object.values(result.errors as Record<string, string[]>)
          .flat()
          .join(', ');
      return {
        success: false,
        error:
          validationError ||
          result.message ||
          result.error ||
          'Failed to submit requirement',
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

export async function submitSupportTicket(
  data: SubmitSupportTicketInput,
): Promise<ApiResponse<{ id: string }>> {
  const url = `${API_BASE_URL}/support`;

  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('email', data.email);
  formData.append('subject', data.subject);
  formData.append('category', data.category);
  formData.append('priority', data.priority);
  formData.append('description', data.description);
  if (data.attachment) {
    formData.append('attachment', data.attachment);
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      const validationError =
        result.errors &&
        Object.values(result.errors as Record<string, string[]>)
          .flat()
          .join(', ');
      return {
        success: false,
        error:
          validationError ||
          result.message ||
          result.error ||
          'Failed to submit support request',
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
