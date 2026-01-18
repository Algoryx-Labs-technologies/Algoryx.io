import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderKanban, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useState } from 'react';

export function ProjectsAndRequirementsWidget() {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');

  const projects = [
    { name: 'Quantum Algorithm Development', status: 'In Progress', icon: '📁' },
    { name: 'Data Analysis Suite', status: 'In Progress', icon: '👤' },
    { name: 'AI Model Training', status: 'Deadline: 15 Oct', icon: '🚀' },
    { name: 'AI Model Training', status: 'Deadline: 10 Oct', icon: '⬇️' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ projectTitle, description });
    // Reset form
    setProjectTitle('');
    setDescription('');
  };

  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-3 pt-3 pb-1.5 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-1.5">
            <FolderKanban className="h-5 w-5 text-blue-400" />
            My Projects
          </CardTitle>
          <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5 text-blue-400" />
            Send-Requirements
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-3 pb-3 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-full">
          {/* My Projects Section */}
          <div className="space-y-1.5 overflow-y-auto">
            {projects.map((project, index) => (
              <div
                key={index}
                className="p-1.5 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-base">{project.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-white font-footer font-medium">
                      {project.name}
                    </p>
                    <p className="text-sm text-gray-400 font-footer mt-0.5">
                      Status {project.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Send Requirements Section */}
          <div className="flex flex-col h-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-1.5">
              <div className="space-y-1 flex-shrink-0">
                <Label htmlFor="project-title" className="text-sm text-gray-300 font-footer">
                  Project Title
                </Label>
                <Input
                  id="project-title"
                  type="text"
                  placeholder="Project Title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 h-9 text-sm"
                />
              </div>

              <div className="space-y-1 flex-shrink-0">
                <Label htmlFor="description" className="text-sm text-gray-300 font-footer">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-2 py-1.5 bg-slate-800/50 border border-white/10 rounded-md text-white placeholder:text-gray-500 font-footer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              <div className="mt-auto pt-1.5">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-footer text-sm h-9"
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

