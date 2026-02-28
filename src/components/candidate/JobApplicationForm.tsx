'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useApplyForJob, useJob } from '@/hooks/useApi';
import { Loader2, Upload, Briefcase, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface JobApplicationFormProps {
  jobId: string;
}

export default function JobApplicationForm({ jobId }: JobApplicationFormProps) {
  const router = useRouter();
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    linkedIn: '',
    portfolio: '',
    experience: '',
    coverLetter: '',
    resume: null as File | null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: job, isLoading: jobLoading } = useJob(jobId);
  const applyForJobMutation = useApplyForJob();

  // Update form data when user data is available (in case of delay or re-fetch)
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.fullName || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, resume: file }));
    if (errors.resume) {
      setErrors(prev => ({ ...prev, resume: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const newErrors: Record<string, string> = {};
    if (!formData.fullName?.trim()) newErrors.fullName = 'This field is mandatory';
    if (!formData.email?.trim()) newErrors.email = 'This field is mandatory';
    if (!formData.phone?.trim()) newErrors.phone = 'This field is mandatory';
    if (!formData.experience?.trim()) newErrors.experience = 'This field is mandatory';
    if (!formData.resume) newErrors.resume = 'This field is mandatory';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await applyForJobMutation.mutateAsync({
        jobId,
        candidateName: formData.fullName,
        candidateEmail: formData.email,
        candidatePhone: formData.phone,
        resume: formData.resume, // Send actual File object
        coverLetter: formData.coverLetter,
      });

      setSuccess(true);
      // Redirect to careers after 2 seconds since candidate doesn't need to track applications
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <Alert>
        <AlertDescription>Job not found.</AlertDescription>
      </Alert>
    );
  }

  if (success) {
    return (
      <Dialog open={success} onOpenChange={setSuccess}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <DialogTitle className="text-xl">
              Application Submitted!
            </DialogTitle>
            <DialogDescription className="text-center">
              Thank you for applying to the {job.title} position. We&apos;ll review
              your application and get back to you soon.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <Button asChild>
              <Link href="/">Browse More Jobs</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/careers/${job._id}`}>View Job Details</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-hero-gradient py-10 md:py-12">
        <div className="container-custom">
          <Link
            href={`/careers/${job._id}`}
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Details
          </Link>

          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Apply for {job.title}
          </h1>
          <p className="text-white/80">
            {job.department} • {job.location}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
              <CardDescription>
                Please fill out the form below to apply for this position.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className={errors.fullName ? "text-destructive" : ""}>Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 98765 43210"
                        className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className={errors.experience ? "text-destructive" : ""}>Years of Experience *</Label>
                      <Input
                        id="experience"
                        name="experience"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.experience}
                        onChange={handleInputChange}
                        placeholder="e.g., 5"
                        className={errors.experience ? "border-destructive focus-visible:ring-destructive" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.experience && <p className="text-sm text-destructive">{errors.experience}</p>}
                    </div>
                  </div>
                </div>

                {/* Online Profiles */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">Online Profiles</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                      <Input
                        id="linkedIn"
                        name="linkedIn"
                        value={formData.linkedIn}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/..."
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="portfolio">Portfolio URL</Label>
                      <Input
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleInputChange}
                        placeholder="https://yourportfolio.com"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label htmlFor="resume" className={errors.resume ? "text-destructive" : ""}>Resume / CV *</Label>
                  <div className={`border-2 border-dashed ${errors.resume ? 'border-destructive bg-destructive/5' : 'border-border'} rounded-lg p-6 text-center hover:border-primary/50 transition-colors`}>
                    <Input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <Label
                      htmlFor="resume"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className={`w-10 h-10 ${errors.resume ? 'text-destructive' : 'text-muted-foreground'} mb-3`} />
                      {formData.resume ? (
                        <span className="text-primary font-medium">
                          {formData.resume.name}
                        </span>
                      ) : (
                        <>
                          <span className={`${errors.resume ? 'text-destructive' : 'text-foreground'} font-medium`}>
                            Click to upload your resume
                          </span>
                          <span className="text-sm text-muted-foreground mt-1">
                            PDF, DOC, or DOCX (max 5MB)
                          </span>
                        </>
                      )}
                    </Label>
                  </div>
                  {errors.resume && <p className="text-sm text-destructive">{errors.resume}</p>}
                </div>

                {/* Cover Letter */}
                <div className="space-y-2">
                  <Label htmlFor="coverLetter">Achievement/Spotlight</Label>
                  <Textarea
                    id="coverLetter"
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Share your key achievements and highlights..."
                    rows={5}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
