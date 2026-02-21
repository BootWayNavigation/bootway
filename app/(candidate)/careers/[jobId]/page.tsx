'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  MapPin,
  Clock,
  Briefcase,
  IndianRupee,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import { useJob } from '@/hooks/useApi';

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = params?.jobId as string;
  const { data: job, isLoading, error } = useJob(jobId);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="container-custom section-padding flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading job details...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !job) {
    return (
      <PageContainer>
        <div className="container-custom section-padding text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Careers
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  }

  const typeLabels = {
    'full-time': 'Full Time',
    'part-time': 'Part Time',
    contract: 'Contract',
    internship: 'Internship',
  } as const;

  return (
    <PageContainer>
      {/* Header */}
      <section className="bg-hero-gradient py-12 md:py-16">
        <div className="container-custom">
          <Link
            href={`/careers/${job._id}`}
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Details
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full">
                  {typeLabels[job.type as keyof typeof typeLabels]}
                </span>
                <span className="px-3 py-1 bg-accent text-accent-foreground text-sm font-medium rounded-full">
                  {job.department}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {job.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-white/80">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  <span>BootWay</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-5 h-5" />
                    <span>{job.salary}</span>
                  </div>
                )}
              </div>
            </div>

            <Button size="lg" variant="hero" className="bg-white text-primary hover:bg-gray-100 shrink-0">
              <Link href={`/careers/${job._id}/apply`} className="flex items-center">
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Role</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Interested in this role?
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Apply now and take the first step towards joining our team.
                  </p>
                  <Button size="lg" className="w-full" asChild>
                    <Link href={`/careers/${job._id}/apply`} className="flex items-center justify-center">
                      <Briefcase className="w-4 h-4 mr-2" />
                      Apply for this Job
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Benefits & Perks</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
