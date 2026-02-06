import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderKanban } from 'lucide-react';

export function MyProjectsWidget() {
  const projects = [
    { name: 'Trading Algorithm V2', status: 'Active', progress: 75, color: 'bg-blue-500' },
    { name: 'Data Analytics Dashboard', status: 'In Progress', progress: 45, color: 'bg-green-500' },
    { name: 'API Integration', status: 'Review', progress: 90, color: 'bg-yellow-500' },
    { name: 'Mobile App Design', status: 'Planning', progress: 20, color: 'bg-purple-500' },
  ];

  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/50 to-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/60 hover:to-slate-800/50 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full">
      <CardHeader className="px-6 pt-6">
        <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-blue-400" />
          My Projects
        </CardTitle>
        <CardDescription className="text-gray-400 font-footer text-sm mt-1">
          Your active projects and tasks
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white font-footer font-medium">
                  {project.name}
                </p>
                <span className="text-xs text-gray-400 font-footer">{project.status}</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2">
                <div
                  className={`${project.color} h-2 rounded-full transition-all duration-300`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 font-footer mt-1">{project.progress}% complete</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

