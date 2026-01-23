const NEWSDATA_API_KEY = 'pub_4edba7dbe356474cb3e216f35e6c6719';
const NEWSDATA_API_BASE_URL = 'https://newsdata.io/api/1';

export interface NewsArticle {
  article_id: string;
  title: string;
  link: string;
  keywords?: string[] | null;
  creator?: string[] | null;
  video_url?: string | null;
  description?: string | null;
  content?: string | null;
  pubDate: string;
  image_url?: string | null;
  source_id: string;
  source_priority?: number;
  source_url?: string;
  source_icon?: string | null;
  language: string;
  country?: string[];
  category?: string[];
  ai_related?: boolean;
  sentiment?: string;
  sentiment_stats?: string;
  ai_generated?: number;
  ai_model?: string | null;
  crawl_date?: string;
  do_not_index?: boolean;
  is_opinion?: boolean;
  is_sponsored?: boolean;
  is_whitelisted?: boolean;
}

export interface NewsDataResponse {
  status: string;
  totalResults?: number;
  results?: NewsArticle[];
  nextPage?: string;
}

/**
 * Fetches latest news from Newsdata.io API
 * @param query - Optional search query
 * @param category - Optional category filter
 * @param language - Language code (default: 'en')
 * @param country - Country code filter
 */
export async function fetchLatestNews(
  query?: string,
  category?: string,
  language: string = 'en',
  country?: string
): Promise<NewsDataResponse> {
  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    language: language,
  });

  if (query) {
    params.append('q', query);
  }

  if (category) {
    params.append('category', category);
  }

  if (country) {
    params.append('country', country);
  }

  const url = `${NEWSDATA_API_BASE_URL}/latest?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'AlgoryxLabs-WebApp',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NewsDataResponse = await response.json();

    if (data.status !== 'success' && data.status !== 'ok') {
      throw new Error(`API error: ${data.status}`);
    }

    return data;
  } catch (error) {
    console.error('Error fetching news from Newsdata.io:', error);
    throw error;
  }
}

/**
 * Formats a date string to a relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(pubDate: string): string {
  try {
    const publishedDate = new Date(pubDate);
    const now = new Date();
    const diffMs = now.getTime() - publishedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    
    return publishedDate.toLocaleDateString();
  } catch (error) {
    return 'Unknown time';
  }
}

