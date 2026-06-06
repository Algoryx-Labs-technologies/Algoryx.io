import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  Shield,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MpinInput, MPIN_DIGIT_COUNT } from './MpinInput';

export function AuthPage() {
  const navigate = useNavigate();
  const { signIn, admin } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showMpin, setShowMpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    adminId: '',
    password: '',
    mpin: '',
  });

  if (admin) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  const handleCredentialsNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.adminId.trim() || !formData.password) {
      setError('Please enter your Admin ID and password.');
      return;
    }

    setStep(2);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.mpin.length !== MPIN_DIGIT_COUNT) {
      setError(`Please enter your ${MPIN_DIGIT_COUNT}-digit MPIN.`);
      return;
    }

    setLoading(true);

    try {
      const { error: signInError } = await signIn(
        formData.adminId.trim(),
        formData.password,
        formData.mpin,
      );

      if (signInError) {
        setError(signInError.message);
        if (signInError.field === 'adminId' || signInError.field === 'password') {
          setFormData((prev) => ({ ...prev, mpin: '' }));
          setStep(1);
        }
        setLoading(false);
        return;
      }

      navigate('/dashboard');
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError(null);
    setFormData((prev) => ({ ...prev, mpin: '' }));
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-400/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/10 dark:bg-blue-700/15 rounded-full blur-3xl" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20 dark:opacity-10" />

        <div className="relative z-10 space-y-4">
          <div className="text-center space-y-3 px-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl font-semibold font-hero text-white">Admin sign in</h1>
            <p className="text-base font-footer text-gray-400">
              {step === 1
                ? 'Step 1 of 2 — enter your Admin ID and password'
                : 'Step 2 of 2 — enter your MPIN to complete sign in'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-400 font-footer">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleCredentialsNext}>
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg overflow-hidden">
                <CardHeader className="px-8 pt-6 pb-2">
                  <CardTitle className="text-lg font-semibold font-hero text-white">
                    Account credentials
                  </CardTitle>
                  <CardDescription className="font-footer text-gray-400">
                    Enter your Admin ID and password
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="adminId" className="font-footer text-gray-300">
                      Admin ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="adminId"
                        type="text"
                        autoComplete="username"
                        placeholder="Admin ID"
                        value={formData.adminId}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, adminId: e.target.value }))
                        }
                        required
                        className="pl-10 h-11 font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-footer text-gray-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, password: e.target.value }))
                        }
                        required
                        className="pl-10 pr-10 h-11 font-footer bg-slate-800/80 border-white/5 text-white placeholder:text-gray-500 focus:border-blue-500/50"
                      />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 font-footer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                    size="lg"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </form>
          ) : (
            <form onSubmit={handleSignIn}>
              <Card className="bg-gradient-to-br from-slate-900/70 to-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg overflow-hidden">
                <CardHeader className="px-8 pt-6 pb-2">
                  <CardTitle className="text-lg font-semibold font-hero text-white">
                    MPIN verification
                  </CardTitle>
                  <CardDescription className="font-footer text-gray-400">
                    Enter your 6-digit MPIN to complete sign in
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-footer text-gray-300">MPIN</Label>
                      <button
                        type="button"
                        onClick={() => setShowMpin(!showMpin)}
                        className="flex items-center gap-1.5 text-sm font-footer text-gray-400 hover:text-white"
                        aria-label={showMpin ? 'Hide MPIN' : 'Show MPIN'}
                      >
                        {showMpin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        {showMpin ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <MpinInput
                      value={formData.mpin}
                      onChange={(mpin) => setFormData((prev) => ({ ...prev, mpin }))}
                      showValue={showMpin}
                      disabled={loading}
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      disabled={loading}
                      className="h-11 font-footer border-white/10 bg-slate-800/80 text-gray-300 hover:text-white hover:bg-slate-700/80"
                      size="lg"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || formData.mpin.length !== MPIN_DIGIT_COUNT}
                      className="flex-1 h-11 font-footer bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-50"
                      size="lg"
                    >
                      {loading ? (
                        'Signing in…'
                      ) : (
                        <>
                          <LogIn className="h-4 w-4" />
                          Sign in
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
