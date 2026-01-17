import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderKanban, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useState } from 'react';

export function ProjectsAndRequirementsWidget() {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const projects = [
    { name: 'Quantum Algorithm Development', status: 'In Progress', icon: '📁' },
    { name: 'Data Analysis Suite', status: 'In Progress', icon: '👤' },
    { name: 'AI Model Training', status: 'Deadline: 15 Oct', icon: '🚀' },
    { name: 'AI Model Training', status: 'Deadline: 10 Oct', icon: '⬇️' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ projectTitle, description, deadline });
    // Reset form
    setProjectTitle('');
    setDescription('');
    setDeadline('');
  };

  return (
    <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col">
      <CardHeader className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
              <FolderKanban className="h-4 w-4 text-blue-400" />
              My Projects
            </CardTitle>
            <CardTitle className="text-lg font-semibold font-hero text-white flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-400" />
              Send-Requirements
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
          {/* My Projects Section */}
          <div className="space-y-2 overflow-y-auto">
            {projects.map((project, index) => (
              <div
                key={index}
                className="p-2 rounded-lg bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{project.icon}</span>
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

          {/* Send Requirements Section */}
          <div className="flex flex-col h-full">
            <form onSubmit={handleSubmit} className="flex flex-col h-full space-y-2">
              <div className="space-y-1.5 flex-shrink-0">
                <Label htmlFor="project-title" className="text-xs text-gray-300 font-footer">
                  Project Title
                </Label>
                <Input
                  id="project-title"
                  type="text"
                  placeholder="Project Title"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5 flex-shrink-0">
                <Label htmlFor="description" className="text-xs text-gray-300 font-footer">
                  Description
                </Label>
                <textarea
                  id="description"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-2 py-1.5 bg-slate-800/50 border border-white/10 rounded-md text-white placeholder:text-gray-500 font-footer text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>

              <div className="space-y-1.5 flex-shrink-0">
                <Label htmlFor="deadline" className="text-xs text-gray-300 font-footer">
                  Deadline
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    id="deadline-date"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="bg-slate-800/50 border-white/10 text-white h-8 text-xs"
                  />
                  <Input
                    id="deadline-time"
                    type="time"
                    className="bg-slate-800/50 border-white/10 text-white h-8 text-xs"
                  />
                </div>
              </div>

              <div className="mt-auto pt-2">
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-footer text-xs h-8"
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

