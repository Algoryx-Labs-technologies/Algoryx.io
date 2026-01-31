import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { FolderKanban, CheckCircle2, XCircle, Plus, Edit, Trash2, X, Search } from 'lucide-react';
import { handleApiRequest, getAuthToken } from '../action-center/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedDeleteProjectId, setSelectedDeleteProjectId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

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
        const token = await getAuthToken();
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/clients`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
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
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch projects function
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/projects`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

  // Fetch projects on component mount
  useEffect(() => {
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

  const handleCreateProject = async () => {
    // Parse JSON fields before sending and clean up empty strings
    const formData: any = {
      ...projectForm,
      // Convert empty strings to null for optional foreign keys
      clientId: projectForm.clientId && projectForm.clientId.trim() !== '' ? projectForm.clientId : undefined,
      partnerId: projectForm.partnerId && projectForm.partnerId.trim() !== '' ? projectForm.partnerId : undefined,
      // Parse JSON fields
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
    // Remove undefined values
    Object.keys(formData).forEach(key => {
      if (formData[key] === undefined || formData[key] === '') {
        if (key !== 'clientId' && key !== 'partnerId') {
          delete formData[key];
        }
      }
    });

    await handleApiRequest(
      '/projects',
      'POST',
      formData,
      setLoading,
      setMessage,
      'Create Project',
      () => {
        resetProjectForm();
        setIsCreateModalOpen(false);
        fetchProjects();
      }
    );
  };

  const handleEditProject = async () => {
    if (!selectedProjectId) {
      setMessage({ type: 'error', text: 'Please select a project' });
      return;
    }

    // Parse JSON fields before sending and clean up empty strings
    const formData: any = {
      ...projectForm,
      // Convert empty strings to null for optional foreign keys
      clientId: projectForm.clientId && projectForm.clientId.trim() !== '' ? projectForm.clientId : undefined,
      partnerId: projectForm.partnerId && projectForm.partnerId.trim() !== '' ? projectForm.partnerId : undefined,
      // Parse JSON fields
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
    // Remove undefined values
    Object.keys(formData).forEach(key => {
      if (formData[key] === undefined || formData[key] === '') {
        if (key !== 'clientId' && key !== 'partnerId') {
          delete formData[key];
        }
      }
    });

    await handleApiRequest(
      `/projects/${selectedProjectId}`,
      'PATCH',
      formData,
      setLoading,
      setMessage,
      'Update Project',
      () => {
        setIsEditModalOpen(false);
        setSelectedProjectId('');
        fetchProjects();
      }
    );
  };

  const handleDeleteProject = async () => {
    if (!selectedDeleteProjectId) {
      setMessage({ type: 'error', text: 'Please select a project to delete' });
      return;
    }

    await handleApiRequest(
      `/projects/${selectedDeleteProjectId}`,
      'DELETE',
      {},
      setLoading,
      setMessage,
      'Delete Project',
      () => {
        setIsDeleteModalOpen(false);
        setSelectedDeleteProjectId('');
        fetchProjects();
      }
    );
  };

  const openEditModal = (project: Project) => {
    setSelectedProjectId(project.id);
    setProjectForm({
      clientId: project.clientId || '',
      partnerId: project.partnerId || '',
      description: project.description || '',
      readMe: project.readMe || '',
      techStack: project.techStack || '',
      clientRequirement: project.clientRequirement || '',
      projectInformation: project.projectInformation || '',
      projectTimeline: project.projectTimeline ? JSON.stringify(project.projectTimeline, null, 2) : '',
      projectStatus: project.projectStatus || '',
      projectFeatures: project.projectFeatures || '',
      priority: project.priority || '',
      progressStatus: project.progressStatus || '',
      miscellaneousData: project.miscellaneousData ? JSON.stringify(project.miscellaneousData, null, 2) : '',
      Budget: project.Budget || '',
      paymentStatus: project.paymentStatus || '',
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (projectId: string) => {
    setSelectedDeleteProjectId(projectId);
    setIsDeleteModalOpen(true);
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter((project) => {
    const searchLower = searchQuery.toLowerCase();
    const clientName = project.Client?.User
      ? `${project.Client.User.firstName || ''} ${project.Client.User.lastName || ''}`.trim() || project.Client.User.email
      : 'N/A';
    const description = project.description || '';
    const techStack = project.techStack || '';
    
    return (
      project.id.toLowerCase().includes(searchLower) ||
      clientName.toLowerCase().includes(searchLower) ||
      description.toLowerCase().includes(searchLower) ||
      techStack.toLowerCase().includes(searchLower) ||
      (project.projectStatus || '').toLowerCase().includes(searchLower) ||
      (project.priority || '').toLowerCase().includes(searchLower)
    );
  });

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
              <p className="text-gray-400 mt-1 font-footer">Manage and track all projects</p>
            </div>
            <Button
              onClick={() => {
                resetProjectForm();
                setIsCreateModalOpen(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Project
            </Button>
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

          {/* Projects List */}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      onClick={() => setIsCreateModalOpen(true)}
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
                                  {project.description ? (project.description.length > 40 ? `${project.description.substring(0, 40)}...` : project.description) : 'Untitled Project'}
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
                                  onClick={() => openEditModal(project)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  onClick={() => openDeleteModal(project.id)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
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

          {/* Create Project Modal */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-slate-900/95 z-10 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Plus className="h-5 w-5 text-blue-400" />
                        Create New Project
                      </CardTitle>
                      <CardDescription>Fill in the details to create a new project</CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        resetProjectForm();
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Client *</Label>
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
                    <Label className="text-gray-300">Client Requirement</Label>
                    <textarea
                      value={projectForm.clientRequirement}
                      onChange={(e) => setProjectForm({ ...projectForm, clientRequirement: e.target.value })}
                      className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      placeholder="Client requirements and specifications"
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
                    <Label className="text-gray-300">Project Information</Label>
                    <textarea
                      value={projectForm.projectInformation}
                      onChange={(e) => setProjectForm({ ...projectForm, projectInformation: e.target.value })}
                      className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      placeholder="Additional project information"
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
                    <Label className="text-gray-300">Project Timeline (JSON)</Label>
                    <textarea
                      value={projectForm.projectTimeline}
                      onChange={(e) => setProjectForm({ ...projectForm, projectTimeline: e.target.value })}
                      className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm"
                      placeholder='{"startDate": "2024-01-01", "endDate": "2024-12-31", "milestones": []}'
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
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCreateProject}
                      disabled={loading === 'Create Project'}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      {loading === 'Create Project' ? 'Creating...' : 'Create Project'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsCreateModalOpen(false);
                        resetProjectForm();
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Edit Project Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <CardHeader className="sticky top-0 bg-slate-900/95 z-10 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Edit className="h-5 w-5 text-blue-400" />
                        Edit Project
                      </CardTitle>
                      <CardDescription>Update project details</CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setSelectedProjectId('');
                        resetProjectForm();
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Client</Label>
                      <select
                        value={projectForm.clientId}
                        onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                        className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                        disabled={loadingClients}
                      >
                        <option value="">No client</option>
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
                    <Label className="text-gray-300">Client Requirement</Label>
                    <textarea
                      value={projectForm.clientRequirement}
                      onChange={(e) => setProjectForm({ ...projectForm, clientRequirement: e.target.value })}
                      className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      placeholder="Client requirements and specifications"
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
                    <Label className="text-gray-300">Project Information</Label>
                    <textarea
                      value={projectForm.projectInformation}
                      onChange={(e) => setProjectForm({ ...projectForm, projectInformation: e.target.value })}
                      className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                      placeholder="Additional project information"
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
                    <Label className="text-gray-300">Project Timeline (JSON)</Label>
                    <textarea
                      value={projectForm.projectTimeline}
                      onChange={(e) => setProjectForm({ ...projectForm, projectTimeline: e.target.value })}
                      className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm"
                      placeholder='{"startDate": "2024-01-01", "endDate": "2024-12-31", "milestones": []}'
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
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleEditProject}
                      disabled={loading === 'Update Project' || !selectedProjectId}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      {loading === 'Update Project' ? 'Updating...' : 'Update Project'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setSelectedProjectId('');
                        resetProjectForm();
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-md w-full">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-red-400" />
                    Delete Project
                  </CardTitle>
                  <CardDescription>This action cannot be undone</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-300">
                    Are you sure you want to delete this project? This will permanently remove the project and all associated data.
                  </p>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleDeleteProject}
                      disabled={loading === 'Delete Project'}
                      variant="destructive"
                      className="flex-1"
                    >
                      {loading === 'Delete Project' ? 'Deleting...' : 'Delete'}
                    </Button>
                    <Button
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setSelectedDeleteProjectId('');
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
