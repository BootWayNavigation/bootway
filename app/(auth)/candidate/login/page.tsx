'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthContext } from '@/contexts/AuthContext';
import { authService } from '@/services/apiService';

function CandidateLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams?.get('redirect') || '/';

    const [view, setView] = useState<'login' | 'reset'>('login');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        newPassword: '',
        confirmPassword: '',
    });

    const { login, loginLoading } = useAuthContext();
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData.email, formData.password);
            router.push(redirect);
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address first.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword(formData.email) as any;
            if (response.success) {
                // In a real app, we would tell the user to check their email.
                // Here, we simulate the flow by getting the token from the response (dev mode)
                // or just assuming the flow continues if it was a real link.
                // Since the backend returns the token for this simulation:
                if (response.resetToken) {
                    setResetToken(response.resetToken);
                    setView('reset');
                } else {
                    setError('Password reset link sent to your email.');
                }
            } else {
                setError(response.message || 'Failed to send reset link.');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to request password reset.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(resetToken, {
                password: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            alert('Password reset successfully! Logging you in...');

            // Auto login
            await login(formData.email, formData.newPassword);
            router.push(redirect);

        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <Card className="shadow-xl border-border/50">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/assets/images/logo/logo-b-re.png" alt="BootWay" className="h-10 w-auto" />
                        </div>
                        <CardTitle className="text-2xl">
                            {view === 'login' ? 'Candidate Login' : 'Reset Password'}
                        </CardTitle>
                        <CardDescription>
                            {view === 'login'
                                ? 'Sign in to apply for jobs and track your applications'
                                : `Reset password for ${formData.email || 'your account'}`
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={view === 'login' ? handleLoginSubmit : handleResetSubmit} className="space-y-4">
                            {view === 'login' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="you@example.com"
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                className="pl-10 pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <label className="flex items-center gap-2">
                                            <input type="checkbox" className="rounded border-border" />
                                            <span className="text-muted-foreground">Remember me</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleForgotPassword}
                                            disabled={loading}
                                            className="text-primary hover:underline"
                                        >
                                            {loading ? 'Sending...' : 'Forgot password?'}
                                        </button>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={loginLoading}
                                    >
                                        {loginLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword">New Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="newPassword"
                                                name="newPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                placeholder="Enter new password"
                                                className="pl-10 pr-10"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Retype Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                placeholder="Retype new password"
                                                className="pl-10 pr-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="lg"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Password'
                                        )}
                                    </Button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setError('');
                                            setView('login');
                                        }}
                                        className="w-full text-center text-sm text-primary hover:underline mt-4"
                                    >
                                        Back to Login
                                    </button>
                                </>
                            )}
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don&apos;t have an account? </span>
                            <Link href={`/candidate/signup?redirect=${redirect}`} className="text-primary hover:underline font-medium">
                                Sign up
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function CandidateLoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <CandidateLoginForm />
        </Suspense>
    );
}
