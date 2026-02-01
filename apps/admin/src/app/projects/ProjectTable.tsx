import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { FolderKanban, Plus, Eye, Trash2, Search } from 'lucide-react';
import { cn } from '../components/ui/utils';

interface ProjectData {
  id: string;
  clientId: string | null;
  adminId: string | null;
  partnerId: string | null;
  projectName: string | null;
  readMe: string | null;
  techStack: string | null;
  clientRequirement: string | null;
  projectInformation: string | null;
  projectTimeline: any;
  projectStatus: string | null;
  projectFeatures: string | null;
  priority: string | null;
  progressStatus: string | null;
  miscellaneousData: any;
  paymentStatus: string | null;
  updated_at: Date;
  created_at: Date;
  Budget: string | null;
  Client: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      phoneNumber: string | null;
    };
  } | null;
  Partner: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
  Admin: {
    uid: string;
    User: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  } | null;
}

interface ProjectTableProps {
  projects: ProjectData[];
  loadingProjects: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewProject: (project: ProjectData) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateProject: () => void;
}

const getStatusColor = (status: string | null) => {
  switch (status) {
    case 'completed':
    case 'delivered':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    case 'in_progress':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
    case 'initiated':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getPriorityColor = (priority: string | null) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'mid':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    case 'low':
      return 'bg-green-500/20 text-green-400 border-green-500/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

export function ProjectTable({
  projects,
  loadingProjects,
  searchQuery,
  onSearchChange,
  onViewProject,
  onDeleteProject,
  onCreateProject,
}: ProjectTableProps) {
  const filteredProjects = projects.filter((project) => {
    const searchLower = searchQuery.toLowerCase();
    const clientName = project.Client?.User
      ? `${project.Client.User.firstName || ''} ${project.Client.User.lastName || ''}`.trim() || project.Client.User.email
      : 'N/A';
    const projectName = project.projectName || '';
    const techStack = project.techStack || '';
    
    return (
      project.id.toLowerCase().includes(searchLower) ||
      clientName.toLowerCase().includes(searchLower) ||
      projectName.toLowerCase().includes(searchLower) ||
      techStack.toLowerCase().includes(searchLower) ||
      (project.projectStatus || '').toLowerCase().includes(searchLower) ||
      (project.priority || '').toLowerCase().includes(searchLower)
    );
  });

  return (
    <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <FolderKanban className="h-5 w-5 text-blue-400" />
              All Projects ({filteredProjects.length})
            </CardTitle>
            <CardDescription>View and manage all projects</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-slate-800/50 border-white/10 text-white"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loadingProjects ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <p className="text-gray-400 mt-4">Loading projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderKanban className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              {searchQuery ? 'No projects found matching your search' : 'No projects found'}
            </p>
            {!searchQuery && (
              <Button
                onClick={onCreateProject}
                className="mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Project</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Client</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Priority</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Tech Stack</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Budget</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const clientName = project.Client?.User
                    ? `${project.Client.User.firstName || ''} ${project.Client.User.lastName || ''}`.trim() || project.Client.User.email
                    : 'No Client';
                  return (
                    <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">
                            {project.projectName ? (project.projectName.length > 40 ? `${project.projectName.substring(0, 40)}...` : project.projectName) : 'Untitled Project'}
                          </span>
                          <span className="text-gray-500 text-xs font-mono mt-1">{project.id.substring(0, 8)}...</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-col">
                          <span className="text-gray-300">{clientName}</span>
                          {project.Client?.User?.email && (
                            <span className="text-gray-500 text-xs">{project.Client.User.email}</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          getStatusColor(project.projectStatus)
                        )}>
                          {project.projectStatus?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
                          getPriorityColor(project.priority)
                        )}>
                          {project.priority || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300 text-sm">
                          {project.techStack ? (project.techStack.length > 30 ? `${project.techStack.substring(0, 30)}...` : project.techStack) : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-300 text-sm font-medium">
                          {project.Budget || 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-gray-400 text-sm">
                          {new Date(project.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => onViewProject(project)}
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            title="View & Edit Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => onDeleteProject(project.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Delete Project"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

