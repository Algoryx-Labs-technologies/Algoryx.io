import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setIsSubmitted(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl">
          {/* Background gradient effects - matching landing theme */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
          </div>

          {/* Animated grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

          <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden relative z-10">
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-[1.5] group-hover:from-blue-500/20 group-hover:to-cyan-500/20 group-hover:blur-2xl transition-all duration-500"></div>
            
            <CardHeader className="space-y-3 text-center px-8 pt-8 relative z-10">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-green-500/40 group-hover:to-emerald-500/40 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all duration-300">
                  <CheckCircle2 className="w-8 h-8 text-green-400 group-hover:text-green-300 transition-colors" />
                </div>
              </div>
              <CardTitle className="text-3xl md:text-4xl font-semibold font-hero text-white">
                Check your email
              </CardTitle>
              <CardDescription className="text-base font-footer text-gray-400">
                We've sent a password reset link to <span className="text-blue-400 font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 relative z-10">
              <div className="space-y-6">
                <div className="bg-slate-800/50 border border-white/5 rounded-xl p-6 text-center">
                  <p className="text-gray-300 font-footer mb-4">
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </p>
                  <p className="text-sm text-gray-500 font-footer">
                    The link will expire in 1 hour for security reasons.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail('');
                    }}
                    className="flex-1 h-11 font-footer border-white/10 hover:border-white/20 hover:bg-white/10 bg-slate-800/80 text-gray-300 hover:text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Email
                  </Button>
                  <Button
                    onClick={onBack}
                    className="flex-1 h-11 font-footer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        {/* Background gradient effects - matching landing theme */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10"></div>

        <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden relative z-10">
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-[1.5] group-hover:from-blue-500/20 group-hover:to-cyan-500/20 group-hover:blur-2xl transition-all duration-500"></div>
          
          <CardHeader className="space-y-3 text-center px-8 pt-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-cyan-500/40 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all duration-300">
                <Mail className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-semibold font-hero text-white">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-base font-footer text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-sm text-red-400 font-footer">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="reset-email" className="font-footer text-gray-300">Email</Label>
                <div className="relative">
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 h-11 text-base font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50 disabled:opacity-50"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 text-base font-footer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                size="lg"
              >
                <Mail className="h-4 w-4 mr-2" />
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm font-footer text-blue-400 hover:text-blue-300 hover:underline transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

