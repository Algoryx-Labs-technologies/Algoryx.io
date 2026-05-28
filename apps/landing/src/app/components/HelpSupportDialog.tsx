import React, { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
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

const dialogCloseButtonClass =
  '[&>button]:!border-0 [&>button]:!bg-transparent [&>button]:!shadow-none [&>button]:!ring-0 [&>button]:!p-0 [&>button]:hover:!bg-transparent [&>button]:focus:!ring-0 [&>button]:focus:!ring-offset-0 [&>button]:rounded-none';

const formDialogContentClass = `max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 ${dialogCloseButtonClass} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`;

const successDialogContentClass = `max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 ${dialogCloseButtonClass}`;

const fieldClass =
  'bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 h-10';

const initialForm = {
  name: '',
  email: '',
  subject: '',
  category: '' as SupportCategory | '',
  priority: '' as SupportPriority | '',
  description: '',
};

type HelpSupportDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HelpSupportDialog({ open, onOpenChange }: HelpSupportDialogProps) {
  const [formData, setFormData] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resetForm = () => {
    setFormData(initialForm);
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
      });

      if (response.success) {
        setSubmitted(true);
        setFormData(initialForm);
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
      <DialogContent
        className={submitted ? successDialogContentClass : formDialogContentClass}
      >
        {submitted ? (
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              Success!
            </DialogTitle>
            <DialogDescription className="text-gray-300 pt-4 text-base leading-relaxed">
              Your support request was submitted successfully. Our team will contact you within
              24–48 hours at the email you provided. Thanks for reaching out to Algoryx!
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-white text-2xl">Help &amp; Support</DialogTitle>
              <DialogDescription className="text-gray-400">
                Describe your issue and our team will get back to you.
              </DialogDescription>
            </DialogHeader>

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
                  className={fieldClass}
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
                  className={fieldClass}
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
                className={fieldClass}
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
                  <SelectTrigger className={`${fieldClass} w-full`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
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
                  <SelectTrigger className={`${fieldClass} w-full`}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
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
                className="bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 resize-none min-h-[88px]"
              />
            </div>

            {errorMessage && (
              <p
                className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 h-10 font-semibold disabled:opacity-50"
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
