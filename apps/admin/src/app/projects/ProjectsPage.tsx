import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { FolderKanban, CheckCircle2, XCircle } from 'lucide-react';
import { handleApiRequest, getAuthToken } from '../action-center/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

interface Client {
  uid: string;
  userId: string;
  User: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    phoneNumber: string | null;
    country: string | null;
    state: string | null;
    role: string;
    created_at: Date;
  };
}

interface Project {
  id: string;
  clientId: string | null;
  adminId: string | null;
  partnerId: string | null;
  description: string | null;
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

export function ProjectsPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    clientId: '',
    partnerId: '',
    description: '',
    readMe: '',
    techStack: '',
    clientRequirement: '',
    projectInformation: '',
    projectTimeline: '',
    projectStatus: '',
    projectFeatures: '',
    priority: '',
    progressStatus: '',
    miscellaneousData: '',
    Budget: '',
    paymentStatus: '',
  });

  // Fetch clients on component mount
  useEffect(() => {
    const fetchClients = async () => {
      setLoadingClients(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/clients`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch clients');
        }

        if (result.success && result.data) {
          setClients(result.data);
        }
      } catch (error: any) {
        console.error('Error fetching clients:', error);
        // Don't show error message to user, just log it
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/projects`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch projects');
        }

        if (result.success && result.data) {
          setProjects(result.data);
        }
      } catch (error: any) {
        console.error('Error fetching projects:', error);
        setMessage({ type: 'error', text: 'Failed to fetch projects' });
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const resetProjectForm = () => {
    setProjectForm({
      clientId: '',
      partnerId: '',
      description: '',
      readMe: '',
      techStack: '',
      clientRequirement: '',
      projectInformation: '',
      projectTimeline: '',
      projectStatus: '',
      projectFeatures: '',
      priority: '',
      progressStatus: '',
      miscellaneousData: '',
      Budget: '',
      paymentStatus: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        isCollapsed ? "md:ml-20" : "md:ml-80"
      )}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white font-hero">Projects</h1>
              <p className="text-gray-400 mt-1 font-footer">Manage projects - Create, Update, Delete</p>
            </div>
          </div>

          {/* Message Alert */}
          {message && (
            <div className={cn(
              "p-4 rounded-lg flex items-center gap-2",
              message.type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' : 'bg-red-500/20 border border-red-500/50 text-red-400'
            )}>
              {message.type === 'success' ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Forms */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Project */}
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-blue-400" />
                  Create Project
                </CardTitle>
                <CardDescription>Create a new project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Client (Optional)</Label>
                  <select
                    value={projectForm.clientId}
                    onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    disabled={loadingClients}
                  >
                    <option value="">Select a client</option>
                    {clients.map((client) => {
                      const clientName = client.User.firstName || client.User.lastName
                        ? `${client.User.firstName || ''} ${client.User.lastName || ''}`.trim()
                        : client.User.email;
                      return (
                        <option key={client.uid} value={client.uid}>
                          {clientName} ({client.User.email})
                        </option>
                      );
                    })}
                  </select>
                  {loadingClients && (
                    <p className="text-gray-400 text-sm mt-1">Loading clients...</p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    placeholder="Project description"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Tech Stack</Label>
                  <Input
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="e.g., React, Node.js, PostgreSQL"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Priority</Label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="mid">Mid</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Project Status</Label>
                  <select
                    value={projectForm.projectStatus}
                    onChange={(e) => setProjectForm({ ...projectForm, projectStatus: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  >
                    <option value="">Select status</option>
                    <option value="not_started">Not Started</option>
                    <option value="initiated">Initiated</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Partner ID (Optional)</Label>
                  <Input
                    value={projectForm.partnerId}
                    onChange={(e) => setProjectForm({ ...projectForm, partnerId: e.target.value })}
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="Enter partner ID"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">ReadMe</Label>
                  <textarea
                    value={projectForm.readMe}
                    onChange={(e) => setProjectForm({ ...projectForm, readMe: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    placeholder="Project README content"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Client Requirement</Label>
                  <textarea
                    value={projectForm.clientRequirement}
                    onChange={(e) => setProjectForm({ ...projectForm, clientRequirement: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    placeholder="Client requirements and specifications"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Project Information</Label>
                  <textarea
                    value={projectForm.projectInformation}
                    onChange={(e) => setProjectForm({ ...projectForm, projectInformation: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    placeholder="Additional project information"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Project Timeline (JSON)</Label>
                  <textarea
                    value={projectForm.projectTimeline}
                    onChange={(e) => setProjectForm({ ...projectForm, projectTimeline: e.target.value })}
                    className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm"
                    placeholder='{"startDate": "2024-01-01", "endDate": "2024-12-31", "milestones": []}'
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Project Features</Label>
                  <textarea
                    value={projectForm.projectFeatures}
                    onChange={(e) => setProjectForm({ ...projectForm, projectFeatures: e.target.value })}
                    className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    placeholder="List of project features"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Progress Status</Label>
                  <Input
                    value={projectForm.progressStatus}
                    onChange={(e) => setProjectForm({ ...projectForm, progressStatus: e.target.value })}
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="e.g., 50%, Phase 2, etc."
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Miscellaneous Data (JSON)</Label>
                  <textarea
                    value={projectForm.miscellaneousData}
                    onChange={(e) => setProjectForm({ ...projectForm, miscellaneousData: e.target.value })}
                    className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm"
                    placeholder='{"key": "value"}'
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Budget</Label>
                  <Input
                    value={projectForm.Budget}
                    onChange={(e) => setProjectForm({ ...projectForm, Budget: e.target.value })}
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="Enter budget"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Payment Status</Label>
                  <select
                    value={projectForm.paymentStatus}
                    onChange={(e) => setProjectForm({ ...projectForm, paymentStatus: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  >
                    <option value="">Select payment status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <Button
                  onClick={() => {
                    // Parse JSON fields before sending
                    const formData = {
                      ...projectForm,
                      projectTimeline: projectForm.projectTimeline ? (() => {
                        try {
                          return JSON.parse(projectForm.projectTimeline);
                        } catch {
                          return projectForm.projectTimeline;
                        }
                      })() : undefined,
                      miscellaneousData: projectForm.miscellaneousData ? (() => {
                        try {
                          return JSON.parse(projectForm.miscellaneousData);
                        } catch {
                          return projectForm.miscellaneousData;
                        }
                      })() : undefined,
                    };
                    handleApiRequest('/projects', 'POST', formData, setLoading, setMessage, 'Create Project', resetProjectForm);
                  }}
                  disabled={loading === 'Create Project'}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  {loading === 'Create Project' ? 'Creating...' : 'Create Project'}
                </Button>
              </CardContent>
            </Card>

            {/* Update Project */}
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-blue-400" />
                  Update Project
                </CardTitle>
                <CardDescription>Update an existing project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Project ID *</Label>
                  <Input
                    id="update-project-id"
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="Enter project ID"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Description</Label>
                  <textarea
                    id="update-project-description"
                    className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                    placeholder="Project description"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Project Status</Label>
                  <select
                    id="update-project-status"
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  >
                    <option value="">Select status</option>
                    <option value="not_started">Not Started</option>
                    <option value="initiated">Initiated</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
                <Button
                  onClick={async () => {
                    const projectId = (document.getElementById('update-project-id') as HTMLInputElement)?.value;
                    const description = (document.getElementById('update-project-description') as HTMLTextAreaElement)?.value;
                    const status = (document.getElementById('update-project-status') as HTMLSelectElement)?.value;
                    if (!projectId) {
                      setMessage({ type: 'error', text: 'Project ID is required' });
                      return;
                    }
                    await handleApiRequest(`/projects/${projectId}`, 'PATCH', { description, projectStatus: status }, setLoading, setMessage, 'Update Project');
                  }}
                  disabled={loading === 'Update Project'}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  {loading === 'Update Project' ? 'Updating...' : 'Update Project'}
                </Button>
              </CardContent>
            </Card>

            {/* Delete Project */}
            <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-red-400" />
                  Delete Project
                </CardTitle>
                <CardDescription>Delete a project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Project ID *</Label>
                  <Input
                    id="delete-project-id"
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="Enter project ID"
                  />
                </div>
                <Button
                  onClick={async () => {
                    const projectId = (document.getElementById('delete-project-id') as HTMLInputElement)?.value;
                    if (!projectId) {
                      setMessage({ type: 'error', text: 'Project ID is required' });
                      return;
                    }
                    if (confirm('Are you sure you want to delete this project?')) {
                      await handleApiRequest(`/projects/${projectId}`, 'DELETE', {}, setLoading, setMessage, 'Delete Project');
                    }
                  }}
                  disabled={loading === 'Delete Project'}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                >
                  {loading === 'Delete Project' ? 'Deleting...' : 'Delete Project'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* All Projects Display */}
          <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FolderKanban className="h-5 w-5 text-blue-400" />
                All Projects
              </CardTitle>
              <CardDescription>View all existing projects</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingProjects ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Loading projects...</p>
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No projects found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">ID</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Description</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Client</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Priority</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Budget</th>
                        <th className="text-left py-3 px-4 text-gray-300 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => {
                        const clientName = project.Client?.User
                          ? `${project.Client.User.firstName || ''} ${project.Client.User.lastName || ''}`.trim() || project.Client.User.email
                          : 'N/A';
                        const statusColor = project.projectStatus === 'completed' || project.projectStatus === 'delivered'
                          ? 'text-green-400'
                          : project.projectStatus === 'in_progress'
                          ? 'text-blue-400'
                          : 'text-gray-400';
                        const priorityColor = project.priority === 'high'
                          ? 'text-red-400'
                          : project.priority === 'mid'
                          ? 'text-yellow-400'
                          : 'text-gray-400';
                        return (
                          <tr key={project.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-4 text-white text-sm font-mono">{project.id.substring(0, 8)}...</td>
                            <td className="py-3 px-4 text-gray-300 text-sm">
                              {project.description ? (project.description.length > 50 ? `${project.description.substring(0, 50)}...` : project.description) : 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-gray-300 text-sm">{clientName}</td>
                            <td className={`py-3 px-4 text-sm capitalize ${statusColor}`}>
                              {project.projectStatus?.replace('_', ' ') || 'N/A'}
                            </td>
                            <td className={`py-3 px-4 text-sm capitalize ${priorityColor}`}>
                              {project.priority || 'N/A'}
                            </td>
                            <td className="py-3 px-4 text-gray-300 text-sm">{project.Budget || 'N/A'}</td>
                            <td className="py-3 px-4 text-gray-400 text-sm">
                              {new Date(project.created_at).toLocaleDateString()}
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
        </div>
      </div>
    </div>
  );
}
