'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import { useInterviews } from '@/hooks/useApi';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';

export default function AdminInterviews() {
  const { data: interviews = [], isLoading, error } = useInterviews();

  return (
    <PageContainer>
      <section className="bg-hero-gradient py-8 md:py-10">
        <div className="container-custom flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Interviews Management
            </h1>
            <p className="text-white/80">
              Schedule and manage interviews.
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/admin/dashboard" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-muted-foreground">
              Error loading interviews. Please try again.
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No interviews scheduled yet.
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <Link key={interview._id} href={`/admin/interviews/${interview._id}`} className="block transition-transform hover:scale-[1.01]">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-8 h-8 text-primary" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {(interview.candidateId as any)?.fullName || (interview.applicationId as any)?.candidateName || 'Candidate Name'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {(interview.jobId as any)?.title || 'Job Title'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {interview.scheduledDate ?
                              new Date(interview.scheduledDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }) + ' at ' +
                              new Date(interview.scheduledDate).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                              : 'Date not set'
                            }
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-muted-foreground capitalize">
                            {interview.status}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageContainer>
  );
}
