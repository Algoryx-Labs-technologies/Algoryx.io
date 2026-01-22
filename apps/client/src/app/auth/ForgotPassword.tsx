import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, FlaskConical, Sparkles, TrendingUp, Shield } from 'lucide-react';
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
      <div className="h-screen overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
        {/* Background gradient effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center max-w-7xl mx-auto w-full">
              {/* Left Side - Labs Content */}
              <div className="flex flex-col justify-center space-y-3 md:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs w-fit">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Algoryx Labs</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Custom AI/ML & Quant
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    Research Solutions
                  </span>
                </h1>
                
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-snug max-w-xl">
                  Get onboarded to our client portal and get in touch with our research team to develop bespoke trading algorithms, risk models, and quantitative strategies tailored to your specific needs.
                </p>

                {/* Key Features */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2.5 p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10">
                    <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">Custom Strategy Development</div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">Tailored algorithms & optimization</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10">
                    <TrendingUp className="w-4 h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">ML Model Deployment</div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">Advanced machine learning solutions</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10">
                    <Shield className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white">Risk Management</div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">Comprehensive risk analysis</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Success Card */}
              <div className="w-full flex items-center justify-center lg:justify-end">
                <div className="w-full max-w-lg">
          <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden relative z-10">
            {/* Decorative element */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-[1.5] group-hover:from-blue-500/20 group-hover:to-cyan-500/20 group-hover:blur-2xl transition-all duration-500"></div>
            
            <CardHeader className="space-y-2 text-center px-6 pt-6 pb-4 relative z-10">
              <div className="flex justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-green-500/40 group-hover:to-emerald-500/40 group-hover:shadow-[0_0_10px_rgba(34,197,94,0.2)] transition-all duration-300">
                  <CheckCircle2 className="w-6 h-6 text-green-400 group-hover:text-green-300 transition-colors" />
                </div>
              </div>
              <CardTitle className="text-2xl font-semibold font-hero text-white">
                Check your email
              </CardTitle>
              <CardDescription className="text-sm font-footer text-gray-400">
                We've sent a password reset link to <span className="text-blue-400 font-medium">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 relative z-10">
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-white/5 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-300 font-footer mb-3">
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </p>
                  <p className="text-xs text-gray-500 font-footer">
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
                    className="flex-1 h-9 text-sm font-footer border-white/10 hover:border-white/20 hover:bg-white/10 bg-slate-800/80 text-gray-300 hover:text-white"
                  >
                    <Mail className="w-3.5 h-3.5 mr-2" />
                    Resend Email
                  </Button>
                  <Button
                    onClick={onBack}
                    className="flex-1 h-9 text-sm font-footer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                    Back to Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center max-w-7xl mx-auto w-full">
            {/* Left Side - Labs Content */}
            <div className="flex flex-col justify-center space-y-3 md:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 text-xs w-fit">
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Algoryx Labs</span>
              </div>
              
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Custom AI/ML & Quant
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Research Solutions
                </span>
              </h1>
              
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-snug max-w-xl">
                Get onboarded to our client portal and get in touch with our research team to develop bespoke trading algorithms, risk models, and quantitative strategies tailored to your specific needs.
              </p>

              {/* Key Features */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2.5 p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10">
                  <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">Custom Strategy Development</div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">Tailored algorithms & optimization</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10">
                  <TrendingUp className="w-4 h-4 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">ML Model Deployment</div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">Advanced machine learning solutions</div>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-2.5 bg-slate-100/80 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-white/10">
                  <Shield className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white">Risk Management</div>
                    <div className="text-[10px] text-gray-600 dark:text-gray-400">Comprehensive risk analysis</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Forgot Password Card */}
            <div className="w-full flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-lg">
          <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden relative z-10">
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-[1.5] group-hover:from-blue-500/20 group-hover:to-cyan-500/20 group-hover:blur-2xl transition-all duration-500"></div>
          
          <CardHeader className="space-y-2 text-center px-6 pt-6 pb-4 relative z-10">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-cyan-500/40 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all duration-300">
                <Mail className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold font-hero text-white">
              Forgot Password?
            </CardTitle>
            <CardDescription className="text-sm font-footer text-gray-400">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 relative z-10">
            <form onSubmit={handleSubmit} className="space-y-3">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-sm text-red-400 font-footer">{error}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="reset-email" className="font-footer text-gray-300 text-xs">Email</Label>
                <div className="relative">
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50 disabled:opacity-50"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-9 text-sm font-footer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                size="lg"
              >
                <Mail className="h-3.5 w-3.5 mr-2" />
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-xs font-footer text-blue-400 hover:text-blue-300 hover:underline transition-colors inline-flex items-center"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

