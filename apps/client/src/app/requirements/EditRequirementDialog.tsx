import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { X, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface Requirement {
  uid: string;
  projectId?: string;
  projectTitle?: string;
  Budget?: string;
  description?: string;
  priority?: string;
  answer?: string;
  created_at: string;
  updated_at: string;
  status?: 'pending' | 'answered' | 'reviewed';
}

interface EditRequirementDialogProps {
  open: boolean;
  onClose: () => void;
  requirement: Requirement | null;
  onSuccess?: (updatedRequirement: Requirement) => void;
}

export function EditRequirementDialog({
  open,
  onClose,
  requirement,
  onSuccess
}: EditRequirementDialogProps) {
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    Budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Reset form when requirement changes or dialog opens/closes
  useEffect(() => {
    if (open && requirement) {
      setFormData({
        projectTitle: requirement.projectTitle || '',
        description: requirement.description || '',
        Budget: requirement.Budget || '',
      });
      setShowSuccess(false);
    }
  }, [open, requirement]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleSave = async () => {
    if (!requirement) return;

    setLoading(true);

    try {
      const response = await apiClient.patch(`/requirements/${requirement.uid}`, {
        projectTitle: formData.projectTitle,
        description: formData.description,
        Budget: formData.Budget,
      });

      if (response.success && response.data) {
        // Immediately call success callback with updated requirement to update the UI
        if (onSuccess && response.data) {
          onSuccess(response.data as Requirement);
        }
        
        // Show success message
        setShowSuccess(true);
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 2000);
      } else {
        alert(response.error || 'Failed to update requirement');
      }
    } catch (error) {
      console.error('Error updating requirement:', error);
      alert('Failed to update requirement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!open || !requirement) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-white/10 p-6 shadow-2xl max-w-2xl w-full mx-4 animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-2xl font-semibold font-hero text-white">
            Edit Requirement
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-5">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
              Project Title
            </label>
            <Input
              value={formData.projectTitle}
              onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
              className="bg-white/5 border-white/10 text-white focus:border-blue-500/50"
              placeholder="Enter project title"
              disabled={loading}
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
              Budget
            </label>
            <div className="relative">
              <select
                value={formData.Budget}
                onChange={(e) => setFormData({ ...formData, Budget: e.target.value })}
                disabled={loading}
                className="w-full h-10 px-3 pr-8 bg-white/5 border border-white/10 rounded-md text-white font-footer text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 font-footer">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white text-sm font-footer min-h-[120px] resize-none focus:outline-none focus:border-blue-500/50 disabled:opacity-50"
              placeholder="Enter project description"
              disabled={loading}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-6 pt-6 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-white/10 text-gray-400 hover:text-white hover:border-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-600/90 backdrop-blur-sm border-t border-green-500/50 rounded-b-xl p-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2 className="h-5 w-5 text-green-100" />
              <span className="font-footer text-sm font-medium">
                Requirement updated successfully!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

