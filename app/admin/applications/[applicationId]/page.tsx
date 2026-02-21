'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import { ArrowLeft, Mail, Phone, FileText, Download, Calendar, Save, Briefcase, User, GraduationCap } from 'lucide-react';
import StatusBadge from '@/components/common/StatusBadge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getApplicationById, updateApplication } from '@/lib/apiClient';
import { toast } from 'sonner';

const statusOptions = [
    { value: 'applied', label: 'Applied' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'shortlisted', label: 'Shortlisted' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'selected', label: 'Selected' },
    { value: 'rejected', label: 'Rejected' },
];

export default function ApplicationDetails() {
    const router = useRouter();
    const params = useParams() as { applicationId: string };
    const applicationId = params.applicationId;
    const [application, setApplication] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const fetchApplication = useCallback(async () => {
        try {
            const response = await getApplicationById(applicationId);
            if (response.success && response.data) {
                setApplication(response.data);
                setStatus(response.data.status);
            } else {
                toast.error('Failed to fetch application details');
                router.push('/admin/applications');
            }
        } catch (error) {
            console.error('Error fetching application:', error);
            toast.error('Error loading application');
        } finally {
            setIsLoading(false);
        }
    }, [applicationId, router]);

    useEffect(() => {
        if (applicationId) {
            fetchApplication();
        }
    }, [applicationId, fetchApplication]);

    const handleStatusUpdate = async () => {
        setIsSaving(true);
        try {
            const result = await updateApplication(applicationId, { status });
            if (result.success) {
                toast.success('Application status updated');
                fetchApplication(); // Refresh data
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error updating status');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </PageContainer>
        );
    }

    if (!application) return null;

    // Handle different data structures safely
    const jobTitle = application.jobId?.title || application.job?.title || 'Unknown Job';
    const jobDepartment = application.jobId?.department || 'Department';
    const candidateName = application.candidateName || application.candidateId?.fullName || 'Unknown Candidate';
    const candidateEmail = application.candidateEmail || application.candidateId?.email || '';
    const candidatePhone = application.candidatePhone || application.candidateId?.phone || '';
    const candidateSkills = application.candidateId?.skills || [];

    return (
        <PageContainer>
            {/* Hero Header */}
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Candidate Details
                        </h1>
                        <p className="text-white/80">
                            View and manage candidate application details
                        </p>
                    </div>
                    <Button asChild variant="secondary">
                        <Link href="/admin/applications" className="flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Applications
                        </Link>
                    </Button>
                </div>
            </section>

            <div className="section-padding bg-muted/30">
                <div className="container-custom space-y-6">
                    {/* Key Details Card */}
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h2 className="text-2xl font-bold">{candidateName}</h2>
                                        <StatusBadge status={application.status} />
                                    </div>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Applied for <span className="font-medium text-foreground">{jobTitle}</span>
                                        <span>•</span>
                                        {jobDepartment}
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                                    Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Contact Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-primary" />
                                        Candidate Profile
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Email</p>
                                            <a href={`mailto:${candidateEmail}`} className="text-foreground hover:text-primary transition-colors font-medium">
                                                {candidateEmail}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Phone className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                            <p className="font-medium">{candidatePhone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Cover Letter */}
                            {application.coverLetter && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-primary" />
                                            Cover Letter
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-muted/30 p-4 rounded-lg border">
                                            <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed text-sm">
                                                {application.coverLetter}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Skills */}
                            {candidateSkills.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <GraduationCap className="w-5 h-5 text-primary" />
                                            Skills
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-2">
                                            {candidateSkills.map((skill: string, index: number) => (
                                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Right Column - Actions & Resume */}
                        <div className="space-y-6">

                            {/* Update Status */}
                            <Card className="border-primary/20 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Application Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button className="w-full" onClick={handleStatusUpdate} disabled={isSaving}>
                                        {isSaving ? (
                                            <>
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                Update Status
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="p-4">
                                    <Button className="w-full" variant="outline" asChild>
                                        <Link href={`/admin/interviews/schedule?applicationId=${application._id}`}>
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Schedule Interview
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Resume */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Resume / CV</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {application.resume ? (
                                        <>
                                            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-dashed border-muted-foreground/30">
                                                <FileText className="w-8 h-8 text-primary/60" />
                                                <div className="overflow-hidden">
                                                    <p className="font-medium text-sm truncate">Resume.pdf</p>
                                                    <p className="text-xs text-muted-foreground">PDF Document</p>
                                                </div>
                                            </div>
                                            <Button className="w-full" asChild variant="secondary" size="sm">
                                                <a href={application.resume} target="_blank" rel="noopener noreferrer">
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download
                                                </a>
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                            <p className="text-sm">No resume uploaded</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
