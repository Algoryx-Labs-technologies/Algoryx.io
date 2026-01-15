import React, { useState } from 'react';
import { Check } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ScrollReveal } from './ScrollReveal';

export function WorkWithAlgoryxLabs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    requirement: '',
    hearAboutUs: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.requirement || !formData.hearAboutUs) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Handle form submission
    console.log('Form submitted:', formData);
    
    // Show checkmark and open success dialog
    setFormSubmitted(true);
    setSuccessDialogOpen(true);
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      company: '',
      requirement: '',
      hearAboutUs: '',
    });
    
    // Reset to submit button after 2 seconds
    setTimeout(() => {
      setFormSubmitted(false);
    }, 2000);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="work-with-labs" className="py-16 relative font-waitlist">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto">
          {/* Glowing background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 blur-3xl"></div>
          
          <ScrollReveal>
            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-8 md:p-10">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Work With Algoryx Labs
                  </span>
                </h2>

                <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                  Tell us about your requirement and our team will reach out to you.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-white text-sm">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                    className="bg-slate-900/50 border-white/20 text-white placeholder:text-gray-500 h-10"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-white text-sm">
                    Email Address <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                    className="bg-slate-900/50 border-white/20 text-white placeholder:text-gray-500 h-10"
                  />
                </div>

                {/* Company / Organization */}
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-white text-sm">
                    Company / Organization <span className="text-gray-500 text-xs">(optional)</span>
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Enter your company or organization"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    className="bg-slate-900/50 border-white/20 text-white placeholder:text-gray-500 h-10"
                  />
                </div>

                {/* Your Requirement */}
                <div className="space-y-1.5">
                  <Label htmlFor="requirement" className="text-white text-sm">
                    Your Requirement <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    id="requirement"
                    placeholder="Tell us about your requirement..."
                    value={formData.requirement}
                    onChange={(e) => handleChange('requirement', e.target.value)}
                    required
                    rows={3}
                    className="bg-slate-900/50 border-white/20 text-white placeholder:text-gray-500 resize-none"
                  />
                </div>

                {/* How did you hear about us */}
                <div className="space-y-1.5">
                  <Label htmlFor="hearAboutUs" className="text-white text-sm">
                    How did you hear about us? <span className="text-red-400">*</span>
                  </Label>
                  <Select
                    value={formData.hearAboutUs}
                    onValueChange={(value) => handleChange('hearAboutUs', value)}
                  >
                    <SelectTrigger className="bg-slate-900/50 border-white/20 text-white h-10">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/20 text-white">
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="google">Google Search</SelectItem>
                      <SelectItem value="friend">Friend / Referral</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="community">Community / WhatsApp</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 h-10 text-base font-semibold flex items-center justify-center"
                  >
                    {formSubmitted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      'Submit Requirement'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <DialogContent className="max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500/30">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              Success!
            </DialogTitle>
            <DialogDescription className="text-gray-300 pt-4">
              Our team will reach out to you. Thanks for showing interest in Algoryx!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}

