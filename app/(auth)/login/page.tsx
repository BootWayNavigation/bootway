'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuthContext } from '@/contexts/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

function UnifiedLoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams?.get('redirect') || null;
    const [error, setError] = useState('');

    const { googleLogin, googleLoginLoading } = useAuthContext();

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setError('');
            const result = await googleLogin(credentialResponse.credential);
            const role = result?.role;

            if (role === 'admin' || role === 'hr') {
                window.location.href = '/admin/dashboard';
            } else {
                router.push(redirect || '/careers');
            }
        } catch (err: any) {
            setError(err.message || 'Google login failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <div className="w-full max-w-sm">
                <Link
                    href="/careers"
                    className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Careers
                </Link>

                <Card className="shadow-xl border-border/50">
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/assets/images/logo/logo-b-re.png" alt="BootWay" className="h-10 w-auto" />
                        </div>
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in to continue to BootWay
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-6 flex flex-col items-center gap-4">
                        {error && (
                            <Alert variant="destructive" className="w-full">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {googleLoginLoading ? (
                            <div className="flex items-center gap-2 text-muted-foreground py-6">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Signing you in...</span>
                            </div>
                        ) : (
                            <div className="w-full flex justify-center py-2">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('Google login failed. Please try again.')}
                                    useOneTap
                                    theme="filled_blue"
                                    shape="pill"
                                    size="large"
                                    text="signin_with"
                                    width="280"
                                />
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground text-center pb-2">
                            HR &amp; Admin accounts are redirected to the dashboard automatically.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-muted/30">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <UnifiedLoginForm />
        </Suspense>
    );
}
