import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderKanban, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useState } from 'react';
import { cn } from '../../components/ui/utils';

export function ProjectsAndRequirementsWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quotation, setQuotation] = useState('');

  const projects = [
    { name: 'Quantum Algorithm Development', status: 'In Progress', icon: '📁' },
    { name: 'Data Analysis Suite', status: 'In Progress', icon: '👤' },
    { name: 'AI Model Training', status: 'Deadline: 15 Oct', icon: '🚀' },
    { name: 'AI Model Training', status: 'Deadline: 10 Oct', icon: '⬇️' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ projectTitle, description, quotation });
    setProjectTitle('');
    setDescription('');
    setQuotation('');
  };

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-3xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-3xl font-semibold font-hero text-white flex items-center gap-1">
            <FolderKanban className="h-9 w-9 text-blue-400" />
            My Projects
          </CardTitle>
          <CardTitle className="text-3xl font-semibold font-hero text-white flex items-center gap-1">
            <CheckCircle2 className="h-9 w-9 text-blue-400" />
            Send-Requirements
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-2 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT - Projects */}
        <div className="space-y-1 overflow-y-auto pr-1">
          {projects.map((project, index) => (
            <div
              key={index}
              className="p-1 rounded-md bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors"
            >
              <div className="flex items-center gap-1">
                <span className="text-sm">{project.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-white font-footer font-medium">
                    {project.name}
                  </p>
                  <p className="text-xs text-gray-400 font-footer mt-0.5">
                    Status {project.status}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - Form + Submit at bottom */}
        <div className="flex flex-col min-h-[180px] lg:min-h-0">
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-1">
            <div className="space-y-0.5 flex-shrink-0">
              <Label htmlFor="project-title" className="text-xs text-gray-300 font-footer">
                Project Title
              </Label>
              <Input
                id="project-title"
                type="text"
                placeholder="Project Title"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 h-7 text-xs"
              />
            </div>

            <div className="space-y-0.5 flex-1 flex flex-col">
              <Label htmlFor="description" className="text-xs text-gray-300 font-footer">
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 w-full px-1.5 py-1 bg-slate-800/50 border border-white/10 rounded-md text-white placeholder:text-gray-500 font-footer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            {/* Quotation and Submit button - placed at bottom */}
            <div className="flex-shrink-0 pt-1 flex items-end gap-2">
              <div className="flex-1 space-y-0.5">
                <Label htmlFor="quotation" className="text-xs text-gray-300 font-footer">
                  Quotation
                </Label>
                <Input
                  id="quotation"
                  type="text"
                  placeholder="Quotation"
                  value={quotation}
                  onChange={(e) => setQuotation(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 h-7 text-xs"
                />
              </div>
              <div className="pt-5">
                <Button
                  type="submit"
                  className="w-full lg:w-24 bg-orange-500 hover:bg-orange-600 text-white font-footer text-xs h-7"
                >
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}