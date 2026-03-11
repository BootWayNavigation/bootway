'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function Redirect() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams?.get('redirect');

    useEffect(() => {
        router.replace(`/login${redirect ? `?redirect=${redirect}` : ''}`);
    }, [router, redirect]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
}

export default function CandidateLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-muted/30"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <Redirect />
        </Suspense>
    );
}
