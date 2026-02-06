import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, User, AlertCircle, Phone, Globe, MapPin, FlaskConical, Sparkles, TrendingUp, Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import countriesData from '../../countries.json';
import { ForgotPassword } from './ForgotPassword';
import { useAuth } from '../contexts/AuthContext';
import { WorldMap } from '../components/WorldMap';

type AuthMode = 'signin' | 'signup';

interface Country {
  flag: string;
  country: string;
  code: string;
}

export function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, signInWithGoogle, signUpWithGoogle } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shine, setShine] = useState(false);
  const [countries] = useState<Country[]>(() => {
    // Sort countries alphabetically by name
    return (countriesData as Country[]).sort((a, b) => a.country.localeCompare(b.country));
  });
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

  // Check for error in URL parameters
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'authentication_failed':
          setError('Google authentication failed. Please try again.');
          break;
        case 'no_session':
          setError('No session found. Please try signing in again.');
          break;
        default:
          setError('An error occurred during authentication. Please try again.');
      }
      // Clear the error parameter from URL
      navigate('/auth', { replace: true });
    }
  }, [searchParams, navigate]);

  // Trigger shine effect on mount and every 10 seconds
  useEffect(() => {
    // Initial shine
    setShine(true);
    const timer = setTimeout(() => setShine(false), 2000);

    // Repeat every 10 seconds
    const interval = setInterval(() => {
      setShine(true);
      setTimeout(() => setShine(false), 2000);
    }, 10000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate step 1 fields
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return;
    }
    if (!formData.country) {
      setError('Country is required');
      return;
    }

    setSignupStep(2);
  };

  const handleBackStep = () => {
    setSignupStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        // If on step 1, go to step 2
        if (signupStep === 1) {
          handleNextStep(e);
          setLoading(false);
          return;
        }

        // Step 2 validation
        if (!formData.email.trim()) {
          setError('Email is required');
          setLoading(false);
          return;
        }
        if (!formData.password) {
          setError('Password is required');
          setLoading(false);
          return;
        }

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
        setSignupStep(1);
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

  const handleGoogleAuth = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { error: googleError } = mode === 'signin' 
        ? await signInWithGoogle() 
        : await signUpWithGoogle();

      if (googleError) {
        setError(googleError.message);
        setGoogleLoading(false);
      }
      // If successful, the user will be redirected to the callback page
      // which will then redirect to dashboard
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl"></div>
      </div>

      {/* World Map Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full max-w-4xl h-full max-h-[600px]">
            <WorldMap className="w-full h-full" />
          </div>
        </div>
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
            <Card className={`group relative bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-slate-900/90 hover:to-slate-800/70 hover:shadow-[0_0_8px_rgba(59,130,246,0.08)] transition-all duration-300 overflow-hidden relative z-10 ${shine ? 'shine-effect' : ''}`}>
              {shine && (
                <div className="absolute inset-0 shine-overlay pointer-events-none z-30 rounded-xl"></div>
              )}
          {/* Decorative element */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-full blur-xl group-hover:scale-[1.5] group-hover:from-blue-500/20 group-hover:to-cyan-500/20 group-hover:blur-2xl transition-all duration-500"></div>
          
          <CardHeader className="space-y-2 text-center px-6 pt-6 pb-4 relative z-10">
            {mode === 'signup' && signupStep === 2 && (
              <div className="absolute top-6 left-6">
                <Button
                  type="button"
                  onClick={handleBackStep}
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-footer border-white/10 hover:border-white/20 hover:bg-white/10 bg-slate-800/80 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Back
                </Button>
              </div>
            )}
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-blue-500/40 group-hover:to-cyan-500/40 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all duration-300">
                <User className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold font-hero text-white">
              {mode === 'signin' ? 'Welcome back to Algoryx Labs' : `Register to get started ${signupStep === 2 ? '(Step 2/2)' : '(Step 1/2)'}`}
            </CardTitle>
            <CardDescription className="text-sm font-footer text-gray-400">
              {mode === 'signin'
                ? 'Enter your credentials to access your account'
                : signupStep === 1
                ? 'Enter your personal information'
                : 'Enter your account credentials'}
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

              {/* Signup Step 1: First Name, Last Name, Country, State */}
              {mode === 'signup' && signupStep === 1 && (
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
                          required
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
                          required
                          className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                        />
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="font-footer text-gray-300 text-xs">Country</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
                      <Select
                        value={formData.country}
                        onValueChange={(value) => handleInputChange('country', value)}
                        required
                      >
                        <SelectTrigger className="pl-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50">
                          {formData.country && (() => {
                            const selectedCountry = countries.find(c => c.country === formData.country);
                            return selectedCountry ? (
                              <img 
                                src={selectedCountry.flag} 
                                alt={selectedCountry.country} 
                                className="absolute left-10 w-4 h-4 flex-shrink-0 pointer-events-none"
                              />
                            ) : null;
                          })()}
                          <SelectValue placeholder="Select a country" className={formData.country ? "pl-6" : ""} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800/95 border-white/10 text-white max-h-[300px]">
                          {countries.map((country) => (
                            <SelectItem
                              key={country.code}
                              value={country.country}
                              className="text-sm font-footer text-white hover:bg-slate-700/50 focus:bg-slate-700/50"
                            >
                              <div className="flex items-center gap-2">
                                <img src={country.flag} alt={country.country} className="w-4 h-4 flex-shrink-0" />
                                <span>{country.country}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

              {/* Signup Step 2: Phone, Email, Password, Confirm Password */}
              {mode === 'signup' && signupStep === 2 && (
                <>
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
                        className="pl-10 pr-10 h-9 text-sm font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
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
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="font-footer text-gray-300 text-xs">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
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
                </>
              )}

              {/* Signin: Email and Password */}
              {mode === 'signin' && (
                <>
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
                </>
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

              <div className="flex gap-3">
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
                  ) : signupStep === 1 ? (
                    <>
                      Next
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" />
                      Sign Up
                    </>
                  )}
                </Button>
              </div>
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

              {/* Show Google auth on signin or any signup step */}
              <div className="mt-5">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={handleGoogleAuth}
                  disabled={googleLoading || loading}
                  className="w-full h-11 font-footer border-white/10 hover:border-white/20 hover:bg-white/10 bg-slate-800/80 text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    'Loading...'
                  ) : (
                    <>
                      <img 
                        src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw" 
                        alt="Google" 
                        className="h-5 w-5 mr-2"
                      />
                      {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs font-footer">
              <span className="text-gray-400">
                {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setSignupStep(1);
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

