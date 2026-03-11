'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Since signup is now handled automatically through Google Login,
// redirect users to the candidate login page.
function SignupRedirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams?.get('redirect') || '/careers';

    useEffect(() => {
        router.replace(`/candidate/login?redirect=${redirect}`);
    }, [router, redirect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}

export default function CandidateSignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <SignupRedirect />
        </Suspense>
    );
}
