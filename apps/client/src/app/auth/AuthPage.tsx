import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, User, AlertCircle, Phone, Globe, MapPin, FlaskConical, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { ForgotPassword } from './ForgotPassword';
import { useAuth } from '../contexts/AuthContext';

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    country: '',
    state: '',
  });

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Validate password match
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Validate password length
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const { error: signUpError } = await signUp(
          formData.email,
          formData.password,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber || undefined,
            country: formData.country || undefined,
            state: formData.state || undefined,
          }
        );

        if (signUpError) {
          setError(signUpError.message);
          setLoading(false);
          return;
        }

        // Show success message or redirect
        alert('Account created! Please check your email to verify your account.');
        setMode('signin');
        setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phoneNumber: '', country: '', state: '' });
      } else {
        const { error: signInError } = await signIn(formData.email, formData.password);

        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }

        // Redirect to dashboard on successful sign in
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

            {/* Right Side - Auth Card */}
            <div className="w-full flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-lg">
            <Card className="group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden relative z-10">
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-[1.5] group-hover:from-blue-500/20 group-hover:to-cyan-500/20 group-hover:blur-2xl transition-all duration-500"></div>
          
          <CardHeader className="space-y-2 text-center px-6 pt-6 pb-4 relative z-10">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-cyan-500/40 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all duration-300">
                <User className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold font-hero text-white">
              {mode === 'signin' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-sm font-footer text-gray-400">
              {mode === 'signin'
                ? 'Enter your credentials to access your account'
                : 'Enter your information to get started'}
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

              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName" className="font-footer text-gray-300 text-xs">First Name</Label>
                      <div className="relative">
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                        />
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName" className="font-footer text-gray-300 text-xs">Last Name</Label>
                      <div className="relative">
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                        />
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="phoneNumber" className="font-footer text-gray-300 text-xs">Phone Number</Label>
                      <div className="relative">
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phoneNumber}
                          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                          className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                        />
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="country" className="font-footer text-gray-300 text-xs">Country</Label>
                      <div className="relative">
                        <Input
                          id="country"
                          type="text"
                          placeholder="United States"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                        />
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="font-footer text-gray-300 text-xs">State/Province</Label>
                    <div className="relative">
                      <Input
                        id="state"
                        type="text"
                        placeholder="California"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                      />
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="font-footer text-gray-300 text-xs">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="font-footer text-gray-300 text-xs">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="pl-10 pr-10 h-11 text-base font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="font-footer text-gray-300 text-xs">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required={mode === 'signup'}
                      className="pl-10 pr-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'signin' && (
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-footer text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-9 text-sm font-footer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                size="lg"
              >
                {loading ? (
                  'Loading...'
                ) : mode === 'signin' ? (
                  <>
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3.5 w-3.5" />
                    Sign Up
                  </>
                )}
              </Button>
            </form>

              <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 px-3 text-gray-400 font-footer">Or continue with</span>
                </div>
              </div>

              {/* OAuth providers can be added later if needed */}
              {/* <div className="mt-5 grid grid-cols-2 gap-4">
                <Button variant="outline" type="button" className="w-full h-11 font-footer border-white/10 hover:border-white/20 hover:bg-white/10 bg-slate-800/80 text-gray-300 hover:text-white">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button variant="outline" type="button" className="w-full h-11 font-footer border-white/10 hover:border-white/20 hover:bg-white/10 bg-slate-800/80 text-gray-300 hover:text-white">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div> */}
            </div>

            <div className="mt-4 text-center text-xs font-footer">
              <span className="text-gray-400">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setFormData({ email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phoneNumber: '', country: '', state: '' });
                  setError(null);
                }}
                className="text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
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

