import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Newspaper, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '../../components/ui/utils';
import { fetchLatestNews, formatRelativeTime, removeDuplicateNews, type NewsArticle } from '@/lib/newsdata';

export function NewsWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [newsItems, setNewsItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchLatestNews(undefined, undefined, 'en');
        
        if (response.results && response.results.length > 0) {
          // Remove duplicates and limit to 10 most recent articles
          const uniqueNews = removeDuplicateNews(response.results);
          setNewsItems(uniqueNews.slice(0, 10));
        } else {
          setError('No news articles found');
        }
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError(err instanceof Error ? err.message : 'Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const handleNewsClick = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-1.5">
          <Newspaper className="h-5 w-5 text-blue-400" />
          News
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-xs mt-0.5">
          Latest news and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center p-4">
            <AlertCircle className="h-6 w-6 text-red-400" />
            <p className="text-sm text-red-400 font-footer">{error}</p>
          </div>
        ) : newsItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-400 font-footer">No news available</p>
          </div>
        ) : (
          <div className="space-y-1.5 overflow-y-auto max-h-full pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
            {newsItems.map((news) => (
              <div
                key={news.article_id}
                onClick={() => handleNewsClick(news.link)}
                className="flex flex-col gap-0.5 p-1.5 rounded-md bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors cursor-pointer"
              >
                <p className="text-sm text-white font-footer font-medium line-clamp-2">
                  {news.title}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-footer flex-wrap">
                  {(news.source_name || news.source_id) && (
                    <span className="capitalize">{news.source_name || news.source_id}</span>
                  )}
                  {(news.source_name || news.source_id) && news.pubDate && <span>•</span>}
                  {news.pubDate && <span>{formatRelativeTime(news.pubDate)}</span>}
                  {news.category && news.category.length > 0 && (
                    <>
                      <span>•</span>
                      <span className="capitalize">{news.category[0]}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

