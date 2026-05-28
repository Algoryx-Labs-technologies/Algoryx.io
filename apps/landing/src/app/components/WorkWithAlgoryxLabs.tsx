import React, { useState } from 'react';
import { Check, Loader2, MapPin, Phone } from 'lucide-react';
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
import { submitLandingEnquiry } from '../../lib/api';

const MAP_EMBED_SRC =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.994128055255!2d72.52821727600804!3d23.023987816274047!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84d7246eaa59%3A0xdd7d07e9a7fff65e!2sAum%20Enercon%20Pvt.%20Ltd!5e0!3m2!1sen!2sin!4v1779483697506!5m2!1sen!2sin';

export function WorkWithAlgoryxLabs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    company: '',
    requirement: '',
    hearAboutUs: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mapInteractive, setMapInteractive] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.requirement || !formData.hearAboutUs) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitLandingEnquiry({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        companyOrg: formData.company || undefined,
        message: formData.requirement,
        haveSource: formData.hearAboutUs,
      });

      if (response.success) {
        setFormSubmitted(true);
        setSuccessDialogOpen(true);
        setFormData({
          fullName: '',
          email: '',
          phoneNumber: '',
          company: '',
          requirement: '',
          hearAboutUs: '',
        });
        setTimeout(() => setFormSubmitted(false), 2000);
      } else {
        setErrorMessage(response.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section id="work-with-labs" className="py-10 md:py-12 relative font-waitlist scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/70 backdrop-blur-sm shadow-[0_0_28px_rgba(59,130,246,0.05)]">
            <div className="grid lg:grid-cols-2 lg:items-stretch gap-6 lg:gap-8 p-5 sm:p-6 md:p-7">
              <div>
                <p className="text-sm font-medium text-cyan-400/90 mb-1.5">Let&apos;s talk</p>
                <h2 className="text-xl sm:text-2xl font-bold mb-1.5 text-white">
                  Work With Algoryx Labs
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Tell us about your requirement and our team will reach out to you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-white text-sm">
                      Full Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Your name"
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      required
                      className="bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-white text-sm">
                      Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Your email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      required
                      className="bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="phoneNumber" className="text-white text-sm">
                      Phone <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange('phoneNumber', e.target.value)}
                      required
                      className="bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-white text-sm">
                      Company <span className="text-gray-500 text-xs">(optional)</span>
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Company or organization"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="requirement" className="text-white text-sm">
                      Your message <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      id="requirement"
                      placeholder="Your message"
                      value={formData.requirement}
                      onChange={(e) => handleChange('requirement', e.target.value)}
                      required
                      rows={3}
                      className="bg-slate-950/50 border-white/15 text-white placeholder:text-gray-500 resize-none min-h-[88px]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hearAboutUs" className="text-white text-sm">
                      How did you hear about us? <span className="text-red-400">*</span>
                    </Label>
                    <Select value={formData.hearAboutUs} onValueChange={(value) => handleChange('hearAboutUs', value)}>
                      <SelectTrigger className="bg-slate-950/50 border-white/15 text-white h-10">
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

                  {errorMessage && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                      {errorMessage}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || formSubmitted}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 h-11 px-8 font-semibold disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : formSubmitted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      'Send message'
                    )}
                  </Button>
                </form>
              </div>

              <div className="flex flex-col h-full min-h-0">
                <p className="text-sm font-medium text-cyan-400/90 mb-1.5">Visit us</p>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 leading-snug">
                  Algoryx Labs and Technologies & Company
                </h3>
                <div className="flex gap-2.5 text-sm text-gray-400 leading-relaxed mb-4">
                  <MapPin className="w-4 h-4 text-cyan-400/80 shrink-0 mt-0.5" />
                  <address className="not-italic">
                  UL-17, Arjun Tower,
                    <br />
                    Shivranjani Cross Road, Satellite, Ahmedabad — 380015
                    <br />
                    Gujarat, India
                  </address>
                </div>

                <ul className="space-y-2.5 text-sm text-gray-400 mb-4 lg:mb-5 shrink-0">
                  <li>
                    <a
                      href="tel:+917016465159"
                      className="inline-flex items-start gap-2.5 hover:text-cyan-300 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-cyan-400/80 shrink-0 mt-0.5" />
                      <span>
                        +91 70164 65159
                        <span className="text-gray-500"> (India HQ)</span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="tel:+14375597909"
                      className="inline-flex items-start gap-2.5 hover:text-cyan-300 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-cyan-400/80 shrink-0 mt-0.5" />
                      <span>
                        +1 (437) 559-7909
                        <span className="text-gray-500"> (Canada)</span>
                      </span>
                    </a>
                  </li>
                </ul>

                <div className="relative w-full flex-1 min-h-[200px] sm:min-h-[240px] lg:min-h-[260px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
                  <iframe
                    title="Algoryx Labs and Technologies — Satellite, Ahmedabad"
                    src={MAP_EMBED_SRC}
                    className={`absolute inset-0 h-full w-full border-0 ${mapInteractive ? '' : 'pointer-events-none'}`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {!mapInteractive && (
                    <button
                      type="button"
                      className="absolute inset-0 z-10 cursor-pointer"
                      onClick={() => setMapInteractive(true)}
                      aria-label="Interact with map"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

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
