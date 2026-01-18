import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Newspaper } from 'lucide-react';

export function NewsWidget() {
  const newsItems = [
    { title: 'Market Update: Tech Stocks Surge', time: '2 hours ago', category: 'Finance' },
    { title: 'New Features Released', time: '5 hours ago', category: 'Product' },
    { title: 'Industry Analysis Report', time: '1 day ago', category: 'Research' },
    { title: 'Weekly Newsletter', time: '2 days ago', category: 'Updates' },
  ];

  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-3 pt-3 pb-1.5 flex-shrink-0">
        <CardTitle className="text-3xl font-semibold font-hero text-white flex items-center gap-1.5">
          <Newspaper className="h-9 w-9 text-blue-400" />
          News
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-sm mt-0.5">
          Latest updates and announcements
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 pb-3 flex-1 overflow-y-auto">
        <div className="space-y-1.5">
          {newsItems.map((news, index) => (
            <div
              key={index}
              className="flex flex-col gap-0.5 p-1.5 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              <p className="text-sm text-white font-footer font-medium">
                {news.title}
              </p>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 font-footer">
                <span>{news.category}</span>
                <span>•</span>
                <span>{news.time}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

