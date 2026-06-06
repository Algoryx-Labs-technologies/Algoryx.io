import React, { useState } from 'react';
import { Check, Loader2, Star } from 'lucide-react';
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
import { submitFeedback, type FeedbackType } from '../../lib/api';

const dialogCloseButtonClass =
  '[&>button]:!border-0 [&>button]:!bg-transparent [&>button]:!shadow-none [&>button]:!ring-0 [&>button]:!p-0 [&>button]:hover:!bg-transparent [&>button]:focus:!ring-0 [&>button]:focus:!ring-offset-0 [&>button]:rounded-none';

const formDialogContentClass = `max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 ${dialogCloseButtonClass} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`;

const successDialogContentClass = `max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30 ${dialogCloseButtonClass}`;

const fieldClass =
  'bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 h-10';

const initialForm = {
  name: '',
  email: '',
  type: '' as FeedbackType | '',
  rating: 0,
  message: '',
};

type FeedbackDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
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

  const handleChange = (field: keyof typeof initialForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name || !formData.email || !formData.type || !formData.message) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitFeedback({
        name: formData.name,
        email: formData.email,
        type: formData.type,
        rating: formData.rating > 0 ? (formData.rating as 1 | 2 | 3 | 4 | 5) : undefined,
        message: formData.message,
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
              Thank you!
            </DialogTitle>
            <DialogDescription className="text-gray-300 pt-4 text-base leading-relaxed">
              Your feedback was submitted successfully. We read every message and use it to improve
              Algoryx. Thanks for helping us build something better.
            </DialogDescription>
          </DialogHeader>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-white text-2xl">Share Feedback</DialogTitle>
              <DialogDescription className="text-gray-400">
                Tell us what you think — we&apos;d love to hear from you.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-name" className="text-white text-sm">
                    Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="feedback-name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    required
                    placeholder="Your name"
                    className={fieldClass}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="feedback-email" className="text-white text-sm">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="feedback-email"
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
                <Label className="text-white text-sm">
                  Feedback type <span className="text-red-400">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => handleChange('type', v)}
                  required
                >
                  <SelectTrigger className={`${fieldClass} w-full`}>
                    <SelectValue placeholder="What is this about?" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/20 text-white">
                    <SelectItem value="website">Website experience</SelectItem>
                    <SelectItem value="product">Product or platform</SelectItem>
                    <SelectItem value="service">Services &amp; delivery</SelectItem>
                    <SelectItem value="suggestion">Feature suggestion</SelectItem>
                    <SelectItem value="content">Content &amp; documentation</SelectItem>
                    <SelectItem value="support">Support experience</SelectItem>
                    <SelectItem value="pricing">Pricing &amp; plans</SelectItem>
                    <SelectItem value="bug">Bug or issue report</SelectItem>
                    <SelectItem value="partnership">Partnership inquiry</SelectItem>
                    <SelectItem value="praise">Compliment or praise</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-white text-sm">Overall rating (optional)</Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        handleChange('rating', formData.rating === value ? 0 : value)
                      }
                      className="p-1 rounded transition-colors hover:bg-white/5"
                      aria-label={`Rate ${value} out of 5`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          value <= formData.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="feedback-message" className="text-white text-sm">
                  Your feedback <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="feedback-message"
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  required
                  placeholder="Share your thoughts, ideas, or suggestions..."
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
                  'Submit feedback'
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
