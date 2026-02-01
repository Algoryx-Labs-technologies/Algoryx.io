import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Plus, Trash2, Eye, X, CheckCircle2, Edit } from 'lucide-react';
import { handleApiRequest } from '../action-center/utils';

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

interface ProjectForm {
  clientId: string;
  partnerId: string;
  projectName: string;
  readMe: string;
  techStack: string;
  clientRequirement: string;
  projectInformation: string;
  projectTimeline: string;
  projectStatus: string;
  projectFeatures: string;
  priority: string;
  progressStatus: string;
  miscellaneousData: string;
  Budget: string;
  paymentStatus: string;
}

interface ProjectModalsProps {
  // Modal states
  isCreateModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isViewModalOpen: boolean;
  isEditMode: boolean;
  isSuccessDialogOpen: boolean;
  
  // Data
  clients: Client[];
  loadingClients: boolean;
  selectedViewProject: Project | null;
  selectedProjectId: string;
  selectedDeleteProjectId: string;
  projectForm: ProjectForm;
  loading: string | null;
  
  // Callbacks
  onCloseCreateModal: () => void;
  onCloseDeleteModal: () => void;
  onCloseViewModal: () => void;
  onCloseSuccessDialog: () => void;
  onCreateProject: () => void;
  onDeleteProject: () => void;
  onSetEditMode: (mode: boolean) => void;
  onProjectFormChange: (form: ProjectForm) => void;
  onResetForm: () => void;
  onSetMessage: (message: { type: 'success' | 'error'; text: string } | null) => void;
  onSetLoading: (loading: string | null) => void;
  onRefreshProjects: () => void;
}

export function ProjectModals({
  isCreateModalOpen,
  isDeleteModalOpen,
  isViewModalOpen,
  isEditMode,
  isSuccessDialogOpen,
  clients,
  loadingClients,
  selectedViewProject,
  selectedProjectId,
  selectedDeleteProjectId: _selectedDeleteProjectId,
  projectForm,
  loading,
  onCloseCreateModal,
  onCloseDeleteModal,
  onCloseViewModal,
  onCloseSuccessDialog,
  onCreateProject,
  onDeleteProject,
  onSetEditMode,
  onProjectFormChange,
  onResetForm,
  onSetMessage,
  onSetLoading,
  onRefreshProjects,
}: ProjectModalsProps) {
  const handleUpdateProject = async () => {
    if (!selectedProjectId) {
      onSetMessage({ type: 'error', text: 'Project ID is missing' });
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
      onSetLoading,
      onSetMessage,
      'Update Project',
      () => {
        onCloseViewModal();
        onSetEditMode(false);
        onRefreshProjects();
      }
    );
  };

  const handleCancelEdit = () => {
    onSetEditMode(false);
    // Reset form to original project data
    if (selectedViewProject) {
      onProjectFormChange({
        clientId: selectedViewProject.clientId || '',
        partnerId: selectedViewProject.partnerId || '',
        projectName: selectedViewProject.projectName || '',
        readMe: selectedViewProject.readMe || '',
        techStack: selectedViewProject.techStack || '',
        clientRequirement: selectedViewProject.clientRequirement || '',
        projectInformation: selectedViewProject.projectInformation || '',
        projectTimeline: selectedViewProject.projectTimeline ? JSON.stringify(selectedViewProject.projectTimeline, null, 2) : '',
        projectStatus: selectedViewProject.projectStatus || '',
        projectFeatures: selectedViewProject.projectFeatures || '',
        priority: selectedViewProject.priority || '',
        progressStatus: selectedViewProject.progressStatus || '',
        miscellaneousData: selectedViewProject.miscellaneousData ? JSON.stringify(selectedViewProject.miscellaneousData, null, 2) : '',
        Budget: selectedViewProject.Budget || '',
        paymentStatus: selectedViewProject.paymentStatus || '',
      });
    }
  };

  return (
    <>
      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                    onCloseCreateModal();
                    onResetForm();
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
                    onChange={(e) => onProjectFormChange({ ...projectForm, clientId: e.target.value })}
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
                    onChange={(e) => onProjectFormChange({ ...projectForm, partnerId: e.target.value })}
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="Enter partner ID"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Priority</Label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => onProjectFormChange({ ...projectForm, priority: e.target.value })}
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
                    onChange={(e) => onProjectFormChange({ ...projectForm, projectStatus: e.target.value })}
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
                    onChange={(e) => onProjectFormChange({ ...projectForm, Budget: e.target.value })}
                    className="bg-slate-800/50 border-white/10 text-white mt-1"
                    placeholder="Enter budget"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Payment Status</Label>
                  <select
                    value={projectForm.paymentStatus}
                    onChange={(e) => onProjectFormChange({ ...projectForm, paymentStatus: e.target.value })}
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
                <Label className="text-gray-300">Project Name</Label>
                <Input
                  value={projectForm.projectName}
                  onChange={(e) => onProjectFormChange({ ...projectForm, projectName: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label className="text-gray-300">Tech Stack</Label>
                <Input
                  value={projectForm.techStack}
                  onChange={(e) => onProjectFormChange({ ...projectForm, techStack: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                />
              </div>
              <div>
                <Label className="text-gray-300">Client Requirement</Label>
                <textarea
                  value={projectForm.clientRequirement}
                  onChange={(e) => onProjectFormChange({ ...projectForm, clientRequirement: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  placeholder="Client requirements and specifications"
                />
              </div>
              <div>
                <Label className="text-gray-300">ReadMe</Label>
                <textarea
                  value={projectForm.readMe}
                  onChange={(e) => onProjectFormChange({ ...projectForm, readMe: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  placeholder="Project README content"
                />
              </div>
              <div>
                <Label className="text-gray-300">Project Information</Label>
                <textarea
                  value={projectForm.projectInformation}
                  onChange={(e) => onProjectFormChange({ ...projectForm, projectInformation: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  placeholder="Additional project information"
                />
              </div>
              <div>
                <Label className="text-gray-300">Project Features</Label>
                <textarea
                  value={projectForm.projectFeatures}
                  onChange={(e) => onProjectFormChange({ ...projectForm, projectFeatures: e.target.value })}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1"
                  placeholder="List of project features"
                />
              </div>
              <div>
                <Label className="text-gray-300">Progress Status</Label>
                <Input
                  value={projectForm.progressStatus}
                  onChange={(e) => onProjectFormChange({ ...projectForm, progressStatus: e.target.value })}
                  className="bg-slate-800/50 border-white/10 text-white mt-1"
                  placeholder="e.g., 50%, Phase 2, etc."
                />
              </div>
              <div>
                <Label className="text-gray-300">Project Timeline (JSON)</Label>
                <textarea
                  value={projectForm.projectTimeline}
                  onChange={(e) => onProjectFormChange({ ...projectForm, projectTimeline: e.target.value })}
                  className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm"
                  placeholder='{"startDate": "2024-01-01", "endDate": "2024-12-31", "milestones": []}'
                />
              </div>
              <div>
                <Label className="text-gray-300">Miscellaneous Data (JSON)</Label>
                <textarea
                  value={projectForm.miscellaneousData}
                  onChange={(e) => onProjectFormChange({ ...projectForm, miscellaneousData: e.target.value })}
                  className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm"
                  placeholder='{"key": "value"}'
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={onCreateProject}
                  disabled={loading === 'Create Project'}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                >
                  {loading === 'Create Project' ? 'Creating...' : 'Create Project'}
                </Button>
                <Button
                  onClick={() => {
                    onCloseCreateModal();
                    onResetForm();
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
                  onClick={onDeleteProject}
                  disabled={loading === 'Delete Project'}
                  variant="destructive"
                  className="flex-1"
                >
                  {loading === 'Delete Project' ? 'Deleting...' : 'Delete'}
                </Button>
                <Button
                  onClick={onCloseDeleteModal}
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

      {/* View Project Details Modal */}
      {isViewModalOpen && selectedViewProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-white/10 max-w-5xl w-full max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <CardHeader className="sticky top-0 bg-slate-900/95 z-10 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5 text-green-400" />
                    Project Details
                  </CardTitle>
                  <CardDescription>View and edit project information</CardDescription>
                </div>
                <Button
                  onClick={() => {
                    onCloseViewModal();
                    onSetEditMode(false);
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
                  <Label className="text-gray-300">Project Name</Label>
                  <Input
                    value={projectForm.projectName}
                    onChange={(e) => onProjectFormChange({ ...projectForm, projectName: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-slate-800/50 border-white/10 text-white mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter project name"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Client</Label>
                  <select
                    value={projectForm.clientId}
                    onChange={(e) => onProjectFormChange({ ...projectForm, clientId: e.target.value })}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isEditMode || loadingClients}
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
                    onChange={(e) => onProjectFormChange({ ...projectForm, partnerId: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-slate-800/50 border-white/10 text-white mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter partner ID"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Priority</Label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => onProjectFormChange({ ...projectForm, priority: e.target.value })}
                    disabled={!isEditMode}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onChange={(e) => onProjectFormChange({ ...projectForm, projectStatus: e.target.value })}
                    disabled={!isEditMode}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    onChange={(e) => onProjectFormChange({ ...projectForm, Budget: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-slate-800/50 border-white/10 text-white mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter budget"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Payment Status</Label>
                  <select
                    value={projectForm.paymentStatus}
                    onChange={(e) => onProjectFormChange({ ...projectForm, paymentStatus: e.target.value })}
                    disabled={!isEditMode}
                    className="w-full rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select payment status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <Label className="text-gray-300">Progress Status</Label>
                  <Input
                    value={projectForm.progressStatus}
                    onChange={(e) => onProjectFormChange({ ...projectForm, progressStatus: e.target.value })}
                    disabled={!isEditMode}
                    className="bg-slate-800/50 border-white/10 text-white mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="e.g., 50%, Phase 2, etc."
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Tech Stack</Label>
                <Input
                  value={projectForm.techStack}
                  onChange={(e) => onProjectFormChange({ ...projectForm, techStack: e.target.value })}
                  disabled={!isEditMode}
                  className="bg-slate-800/50 border-white/10 text-white mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="e.g., React, Node.js, PostgreSQL"
                />
              </div>
              <div>
                <Label className="text-gray-300">Client Requirement</Label>
                <textarea
                  value={projectForm.clientRequirement}
                  onChange={(e) => onProjectFormChange({ ...projectForm, clientRequirement: e.target.value })}
                  disabled={!isEditMode}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Client requirements and specifications"
                />
              </div>
              <div>
                <Label className="text-gray-300">ReadMe</Label>
                <textarea
                  value={projectForm.readMe}
                  onChange={(e) => onProjectFormChange({ ...projectForm, readMe: e.target.value })}
                  disabled={!isEditMode}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Project README content"
                />
              </div>
              <div>
                <Label className="text-gray-300">Project Information</Label>
                <textarea
                  value={projectForm.projectInformation}
                  onChange={(e) => onProjectFormChange({ ...projectForm, projectInformation: e.target.value })}
                  disabled={!isEditMode}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Additional project information"
                />
              </div>
              <div>
                <Label className="text-gray-300">Project Features</Label>
                <textarea
                  value={projectForm.projectFeatures}
                  onChange={(e) => onProjectFormChange({ ...projectForm, projectFeatures: e.target.value })}
                  disabled={!isEditMode}
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="List of project features"
                />
              </div>
              <div>
                <Label className="text-gray-300">Project Timeline (JSON)</Label>
                <textarea
                  value={projectForm.projectTimeline}
                  onChange={(e) => onProjectFormChange({ ...projectForm, projectTimeline: e.target.value })}
                  disabled={!isEditMode}
                  className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder='{"startDate": "2024-01-01", "endDate": "2024-12-31", "milestones": []}'
                />
              </div>
              <div>
                <Label className="text-gray-300">Miscellaneous Data (JSON)</Label>
                <textarea
                  value={projectForm.miscellaneousData}
                  onChange={(e) => onProjectFormChange({ ...projectForm, miscellaneousData: e.target.value })}
                  disabled={!isEditMode}
                  className="w-full min-h-[80px] rounded-md border border-white/10 bg-slate-800/50 text-white px-3 py-2 mt-1 font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder='{"key": "value"}'
                />
              </div>

              {/* Read-only Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <Label className="text-gray-400 text-sm">Created At</Label>
                  <p className="text-gray-400 text-sm mt-1">
                    {selectedViewProject ? new Date(selectedViewProject.created_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400 text-sm">Last Updated</Label>
                  <p className="text-gray-400 text-sm mt-1">
                    {selectedViewProject ? new Date(selectedViewProject.updated_at).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <Label className="text-gray-400 text-sm">Project ID</Label>
                  <p className="text-gray-500 text-xs font-mono mt-1">{selectedViewProject?.id}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                {!isEditMode ? (
                  <>
                    <Button
                      onClick={() => onSetEditMode(true)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                    <Button
                      onClick={() => {
                        onCloseViewModal();
                        onSetEditMode(false);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleUpdateProject}
                      disabled={loading === 'Update Project' || !selectedProjectId}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    >
                      {loading === 'Update Project' ? 'Updating...' : 'Update Project'}
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Dialog */}
      {isSuccessDialogOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-green-500/50 max-w-md w-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    Success!
                  </CardTitle>
                  <CardDescription>Project created successfully</CardDescription>
                </div>
                <Button
                  onClick={onCloseSuccessDialog}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">Project Created Successfully!</p>
                  <p className="text-gray-400 text-sm">Your project has been created and is now available in the projects list.</p>
                </div>
              </div>
              <Button
                onClick={onCloseSuccessDialog}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600"
              >
                Got it
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

