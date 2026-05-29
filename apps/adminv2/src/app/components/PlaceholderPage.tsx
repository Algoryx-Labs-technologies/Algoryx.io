import { AppLayout } from './AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <AppLayout title={title} description={description}>
      <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white font-hero">Coming soon</CardTitle>
          <CardDescription className="font-footer">
            This section is scaffolded and ready for implementation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 font-footer text-sm">
            Build out {title.toLowerCase()} features here using the same patterns as{' '}
            <code className="text-blue-300">apps/admin</code>.
          </p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
