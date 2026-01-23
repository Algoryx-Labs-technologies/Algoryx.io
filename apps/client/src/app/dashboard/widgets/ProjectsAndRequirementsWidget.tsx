import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FolderKanban, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useState } from 'react';
import { cn } from '../../components/ui/utils';

export function ProjectsAndRequirementsWidget({ shouldShine = false }: { shouldShine?: boolean }) {
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const projects = [
    { name: 'Quantum Algorithm Development', status: 'In Progress', icon: '📁' },
    { name: 'Data Analysis Suite', status: 'In Progress', icon: '👤' },
    { name: 'AI Model Training', status: 'Deadline: 15 Oct', icon: '🚀' },
    { name: 'AI Model Training', status: 'Deadline: 10 Oct', icon: '⬇️' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ projectTitle, description, budget });
    setProjectTitle('');
    setDescription('');
    setBudget('');
  };

  return (
    <Card className={cn("group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden h-full flex flex-col shine-effect", shouldShine && "active")}>
      <CardHeader className="px-2 pt-2 pb-1 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-1.5">
            <FolderKanban className="h-5 w-5 text-blue-400" />
            My Projects
          </CardTitle>
          <CardTitle className="text-xl font-semibold font-hero text-white flex items-center gap-1.5">
            <CheckCircle2 className="h-5 w-5 text-blue-400" />
            Send-Requirements
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-2 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT - Projects */}
        <div className="space-y-1.5 overflow-y-auto pr-1">
          {projects.map((project, index) => (
            <div
              key={index}
              className="p-1.5 rounded-md bg-slate-800/50 border border-white/5 hover:bg-slate-800/70 transition-colors"
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

        {/* RIGHT - Form + Submit at bottom */}
        <div className="flex flex-col min-h-[160px] lg:min-h-0">
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 space-y-1.5">
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
                className="bg-slate-800/50 border-white/10 text-white placeholder:text-gray-500 h-8 text-sm"
              />
            </div>

            <div className="space-y-1 flex-1 flex flex-col">
              <Label htmlFor="description" className="text-sm text-gray-300 font-footer">
                Description
              </Label>
              <textarea
                id="description"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="flex-1 w-full px-2 py-1.5 bg-slate-800/50 border border-white/10 rounded-md text-white placeholder:text-gray-500 font-footer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              />
            </div>

            {/* Budget and Submit button - placed at bottom */}
            <div className="flex-shrink-0 pt-1 flex items-end gap-2">
              <div className="flex-1 space-y-1">
                <Label htmlFor="budget" className="text-sm text-gray-300 font-footer">
                  Budget Range
                </Label>
                <div className="relative">
                  <select
                    id="budget"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full h-8 px-2 pr-8 bg-slate-800/50 border border-white/10 rounded-md text-white font-footer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-slate-800 text-white">
                      Select Budget Range
                    </option>
                    <option value="$0 - $1,000" className="bg-slate-800 text-white">
                      $0 - $1,000
                    </option>
                    <option value="$1,000 - $5,000" className="bg-slate-800 text-white">
                      $1,000 - $5,000
                    </option>
                    <option value="$5,000 - $10,000" className="bg-slate-800 text-white">
                      $5,000 - $10,000
                    </option>
                    <option value="$10,000 - $25,000" className="bg-slate-800 text-white">
                      $10,000 - $25,000
                    </option>
                    <option value="$25,000 - $50,000" className="bg-slate-800 text-white">
                      $25,000 - $50,000
                    </option>
                    <option value="$50,000 - $100,000" className="bg-slate-800 text-white">
                      $50,000 - $100,000
                    </option>
                    <option value="$100,000 - $250,000" className="bg-slate-800 text-white">
                      $100,000 - $250,000
                    </option>
                    <option value="$250,000 - $500,000" className="bg-slate-800 text-white">
                      $250,000 - $500,000
                    </option>
                    <option value="$500,000+" className="bg-slate-800 text-white">
                      $500,000+
                    </option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div className="pt-5">
                <Button
                  type="submit"
                  className="w-full lg:w-24 bg-orange-500 hover:bg-orange-600 text-white font-footer text-sm h-8"
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