import { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useSidebar } from '../contexts/SidebarContext';
import { cn } from '../components/ui/utils';
import { Button } from '../components/ui/button';
import { CheckCircle2, XCircle, Plus } from 'lucide-react';
import { handleApiRequest, getAuthToken } from '../action-center/utils';
import { ProjectTable } from './ProjectTable';
import { ProjectModals } from './ProjectModals';

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

export function ProjectsPage() {
  const { isCollapsed } = useSidebar();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedDeleteProjectId, setSelectedDeleteProjectId] = useState<string>('');
  const [selectedViewProject, setSelectedViewProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    clientId: '',
    partnerId: '',
    projectName: '',
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
        const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/clients`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setClients(result.data);
          } else {
            console.error('Failed to fetch clients:', result.message || 'Unknown error');
          }
        } else {
          const error = await response.json();
          console.error('Failed to fetch clients:', error.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  // Fetch projects on component mount
  const fetchProjects = async (): Promise<Project[]> => {
    setLoadingProjects(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/${API_VERSION}/admin/projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setProjects(result.data);
          return result.data;
        } else {
          console.error('Failed to fetch projects:', result.message || 'Unknown error');
          setMessage({ type: 'error', text: 'Failed to fetch projects' });
          return [];
        }
      } else {
        const error = await response.json();
        console.error('Failed to fetch projects:', error.message || 'Unknown error');
        setMessage({ type: 'error', text: error.message || 'Failed to fetch projects' });
        return [];
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage({ type: 'error', text: 'Failed to fetch projects' });
      return [];
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetProjectForm = () => {
    setProjectForm({
      clientId: '',
      partnerId: '',
      projectName: '',
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
        setIsSuccessDialogOpen(true);
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


  const openDeleteModal = (projectId: string) => {
    setSelectedDeleteProjectId(projectId);
    setIsDeleteModalOpen(true);
  };

  const openViewModal = (project: Project) => {
    setSelectedViewProject(project);
    setSelectedProjectId(project.id);
    setIsEditMode(false); // Start in view mode
    // Populate form with project data for editing
    setProjectForm({
      clientId: project.clientId || '',
      partnerId: project.partnerId || '',
      projectName: project.projectName || '',
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
    setIsViewModalOpen(true);
  };

  const refreshSelectedProject = async (projectId: string) => {
    // Fetch fresh projects list and find the updated project
    const freshProjects = await fetchProjects();
    const updatedProject = freshProjects.find((p) => p.id === projectId);
    if (updatedProject) {
      setSelectedViewProject(updatedProject);
      // Update form with refreshed project data
      setProjectForm({
        clientId: updatedProject.clientId || '',
        partnerId: updatedProject.partnerId || '',
        projectName: updatedProject.projectName || '',
        readMe: updatedProject.readMe || '',
        techStack: updatedProject.techStack || '',
        clientRequirement: updatedProject.clientRequirement || '',
        projectInformation: updatedProject.projectInformation || '',
        projectTimeline: updatedProject.projectTimeline ? JSON.stringify(updatedProject.projectTimeline, null, 2) : '',
        projectStatus: updatedProject.projectStatus || '',
        projectFeatures: updatedProject.projectFeatures || '',
        priority: updatedProject.priority || '',
        progressStatus: updatedProject.progressStatus || '',
        miscellaneousData: updatedProject.miscellaneousData ? JSON.stringify(updatedProject.miscellaneousData, null, 2) : '',
        Budget: updatedProject.Budget || '',
        paymentStatus: updatedProject.paymentStatus || '',
      });
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
          <ProjectTable
            projects={projects}
            loadingProjects={loadingProjects}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onViewProject={openViewModal}
            onDeleteProject={openDeleteModal}
            onCreateProject={() => {
              resetProjectForm();
              setIsCreateModalOpen(true);
            }}
          />

          {/* Modals */}
          <ProjectModals
            isCreateModalOpen={isCreateModalOpen}
            isDeleteModalOpen={isDeleteModalOpen}
            isViewModalOpen={isViewModalOpen}
            isEditMode={isEditMode}
            isSuccessDialogOpen={isSuccessDialogOpen}
            clients={clients}
            loadingClients={loadingClients}
            selectedViewProject={selectedViewProject}
            selectedProjectId={selectedProjectId}
            selectedDeleteProjectId={selectedDeleteProjectId}
            projectForm={projectForm}
            loading={loading}
            onCloseCreateModal={() => {
              setIsCreateModalOpen(false);
              resetProjectForm();
            }}
            onCloseDeleteModal={() => {
              setIsDeleteModalOpen(false);
              setSelectedDeleteProjectId('');
            }}
            onCloseViewModal={() => {
              setIsViewModalOpen(false);
              setSelectedViewProject(null);
              setIsEditMode(false);
              setSelectedProjectId('');
            }}
            onCloseSuccessDialog={() => setIsSuccessDialogOpen(false)}
            onCreateProject={handleCreateProject}
            onDeleteProject={handleDeleteProject}
            onSetEditMode={setIsEditMode}
            onProjectFormChange={setProjectForm}
            onResetForm={resetProjectForm}
            onSetMessage={setMessage}
            onSetLoading={setLoading}
            onRefreshProjects={fetchProjects}
            onRefreshSelectedProject={refreshSelectedProject}
          />
        </div>
      </div>
    </div>
  );
}
