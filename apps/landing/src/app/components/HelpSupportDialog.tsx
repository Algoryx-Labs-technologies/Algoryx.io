import React, { useState } from 'react';
import { Check, Loader2, Paperclip } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  submitSupportTicket,
  type SupportCategory,
  type SupportPriority,
} from '../../lib/api';

const dialogContentClass =
  'max-w-lg max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&>button]:!border-0 [&>button]:!bg-transparent [&>button]:!shadow-none [&>button]:!ring-0 [&>button]:!p-0 [&>button]:hover:!bg-transparent [&>button]:focus:!ring-0 [&>button]:focus:!ring-offset-0 [&>button]:rounded-none';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  category: '' as SupportCategory | '',
  priority: '' as SupportPriority | '',
  description: '',
};

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

type HelpSupportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HelpSupportDialog({ open, onOpenChange }: HelpSupportDialogProps) {
  const [formData, setFormData] = useState(initialForm);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialForm);
    setAttachment(null);
    setErrorMessage(null);
    setSubmitted(false);
  };

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) {
      resetForm();
    }
  };

  const handleChange = (field: keyof typeof initialForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachment(null);
      return;
    }
    if (file.size > MAX_ATTACHMENT_BYTES) {
      setErrorMessage('Attachment must be 5 MB or smaller');
      e.target.value = '';
      setAttachment(null);
      return;
    }
    setErrorMessage(null);
    setAttachment(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.category ||
      !formData.priority ||
      !formData.description
    ) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitSupportTicket({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        attachment,
      });

      if (response.success) {
        setSubmitted(true);
        setFormData(initialForm);
        setAttachment(null);
      } else {
        setErrorMessage(response.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Help &amp; Support</DialogTitle>
          <DialogDescription className="text-gray-400">
            Describe your issue and our team will get back to you.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-gray-300 text-sm">
              Your support request was submitted successfully. We&apos;ll respond by email
              soon.
            </p>
            <Button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-900"
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="support-name" className="text-white text-sm">
                  Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="support-name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  placeholder="Your name"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="support-email" className="text-white text-sm">
                  Email <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="support-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="support-subject" className="text-white text-sm">
                Subject <span className="text-red-400">*</span>
              </Label>
              <Input
                id="support-subject"
                value={formData.subject}
                onChange={(e) => handleChange('subject', e.target.value)}
                required
                placeholder="Brief summary"
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 h-10"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-white text-sm">
                  Category <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleChange('category', v)}
                  required
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-10 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="feature-request">Feature request</SelectItem>
                    <SelectItem value="account">Account</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-white text-sm">
                  Priority <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(v) => handleChange('priority', v)}
                  required
                >
                  <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white h-10 w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="support-description" className="text-white text-sm">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="support-description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                required
                placeholder="Tell us what you need help with..."
                rows={4}
                className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="support-attachment" className="text-white text-sm">
                Attachment <span className="text-gray-500 font-normal">(optional)</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="support-attachment"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,.txt,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="bg-gray-800/50 border-gray-700 text-gray-300 file:mr-3 file:rounded file:border-0 file:bg-gray-700 file:px-3 file:py-1.5 file:text-sm file:text-white"
                />
              </div>
              {attachment && (
                <p className="text-gray-400 text-xs flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  {attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)
                </p>
              )}
              <p className="text-gray-500 text-xs">PDF, images, text, Word, or Excel — max 5 MB</p>
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm" role="alert">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium h-10"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit request'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
