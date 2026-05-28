import { AppLayout } from '../components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LayoutDashboard, Users, BookOpen, Bell } from 'lucide-react';

const stats = [
  { label: 'Clients', value: '—', icon: Users },
  { label: 'Courses', value: '—', icon: BookOpen },
  { label: 'Notifications', value: '—', icon: Bell },
  { label: 'Overview', value: '—', icon: LayoutDashboard },
];

export function DashboardPage() {
  return (
    <AppLayout
      title="Dashboard"
      description="Admin v2 shell — connect APIs and widgets as you build features."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card
            key={label}
            className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-footer text-gray-300">{label}</CardTitle>
              <Icon className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold font-hero text-white">{value}</p>
              <CardDescription className="font-footer mt-1">Placeholder metric</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
