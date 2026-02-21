'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PageContainer from '@/components/layout/PageContainer';
import JobApplicationForm from '@/components/candidate/JobApplicationForm';
import { useAuthContext } from '@/contexts/AuthContext';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.jobId as string;
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/candidate/login?redirect=/careers/${jobId}/apply`);
    }
  }, [authLoading, isAuthenticated, router, jobId]);

  if (authLoading) {
    return (
      <PageContainer>
        <div className="container-custom section-padding flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Checking authentication...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (!jobId) {
    return (
      <PageContainer>
        <div className="container-custom section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Job ID</h1>
          <Button asChild>
            <Link href="/careers">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <JobApplicationForm jobId={jobId} />
    </PageContainer>
  );
}
