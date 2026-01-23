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
  pubDateTZ?: string;
  image_url?: string | null;
  source_id: string;
  source_name?: string;
  source_priority?: number;
  source_url?: string;
  source_icon?: string | null;
  language: string;
  country?: string[];
  category?: string[];
  datatype?: string;
  fetched_at?: string;
  ai_related?: boolean;
  sentiment?: string;
  sentiment_stats?: string;
  ai_generated?: number;
  ai_model?: string | null;
  ai_tag?: string;
  ai_region?: string;
  ai_org?: string;
  ai_summary?: string;
  crawl_date?: string;
  do_not_index?: boolean;
  is_opinion?: boolean;
  is_sponsored?: boolean;
  is_whitelisted?: boolean;
  duplicate?: boolean;
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
 * Removes duplicate news articles based on API's duplicate flag, article_id, link, and normalized title
 * @param articles - Array of news articles
 * @returns Array of unique news articles
 */
export function removeDuplicateNews(articles: NewsArticle[]): NewsArticle[] {
  // First, filter out articles marked as duplicates by the API
  const nonDuplicateArticles = articles.filter((article) => !article.duplicate);

  // Then apply additional deduplication checks as a fallback
  const seen = new Set<string>();
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();

  return nonDuplicateArticles.filter((article) => {
    // Check by article_id (most reliable)
    if (article.article_id && seen.has(article.article_id)) {
      return false;
    }
    if (article.article_id) {
      seen.add(article.article_id);
    }

    // Check by link/URL (secondary check)
    if (article.link) {
      const normalizedLink = article.link.toLowerCase().trim();
      if (seenLinks.has(normalizedLink)) {
        return false;
      }
      seenLinks.add(normalizedLink);
    }

    // Check by normalized title (tertiary check for similar articles)
    if (article.title) {
      const normalizedTitle = article.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s]/g, '') // Remove special characters
        .replace(/\s+/g, ' '); // Normalize whitespace
      
      if (seenTitles.has(normalizedTitle)) {
        return false;
      }
      seenTitles.add(normalizedTitle);
    }

    return true;
  });
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

