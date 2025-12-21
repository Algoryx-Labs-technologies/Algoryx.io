import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ArrowRight } from 'lucide-react';
import { WaitlistConfirmation } from './WaitlistConfirmation';
import { ScrollReveal } from './ScrollReveal';

export function Waitlist() {
  const [email, setEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup
    console.log('Waitlist signup:', email);
    setSubmittedEmail(email);
    setShowConfirmation(true);
    setEmail('');
  };

  return (
    <section className="py-24 relative font-waitlist">
      <div className="container mx-auto px-6">
        <div className="relative max-w-4xl mx-auto">
          {/* Glowing background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20 blur-3xl"></div>
          
          <ScrollReveal>
            <div className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Be the First to Access
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Algoryx Courses
              </span>
            </h2>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join our waitlist and get exclusive early access to courses, special discounts, and insider updates on Indian market strategies.
            </p>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-slate-900/50 border-white/20 text-white placeholder:text-gray-500 h-12"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white border-0 px-8 h-12 whitespace-nowrap"
                >
                  Get Early Access
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">500+ on waitlist</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span className="text-sm text-gray-400">Launch: Q1 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span className="text-sm text-gray-400">Early bird discount</span>
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <WaitlistConfirmation
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        email={submittedEmail}
      />
    </section>
  );
}
