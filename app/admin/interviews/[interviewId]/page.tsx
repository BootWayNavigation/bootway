'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import { ArrowLeft, Calendar, Clock, MapPin, Video, User, Briefcase, CheckCircle, XCircle, AlertCircle, Save } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getInterviewById, updateInterview } from '@/lib/apiClient';
import { useDeleteInterview, useUpdateApplication } from '@/hooks/useApi';
import { toast } from 'sonner';

const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'rescheduled', label: 'Rescheduled' },
    { value: 'Selected', label: 'Selected (Auto Delete)' },
];

export default function InterviewDetails() {
    const router = useRouter();
    const params = useParams() as { interviewId: string };
    const interviewId = params.interviewId;

    const [interview, setInterview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const deleteInterviewMutation = useDeleteInterview();
    const updateApplicationMutation = useUpdateApplication();

    const fetchInterview = useCallback(async () => {
        try {
            const response = await getInterviewById(interviewId);
            if (response.success && response.data) {
                setInterview(response.data);
                setStatus(response.data.status);
                setNotes(response.data.notes || '');
            } else {
                toast.error('Failed to fetch interview details');
                router.push('/admin/interviews');
            }
        } catch (error) {
            console.error('Error fetching interview:', error);
            toast.error('Error loading interview');
        } finally {
            setIsLoading(false);
        }
    }, [interviewId, router]);

    useEffect(() => {
        if (interviewId) {
            fetchInterview();
        }
    }, [interviewId, fetchInterview]);

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            if (status === 'Selected') {
                if (window.confirm('Setting status to Selected will remove this interview from the schedule and mark the application as Selected. Continue?')) {
                    const appId = interview.applicationId?._id || interview.applicationId;
                    if (appId) {
                        try {
                            await updateApplicationMutation.mutateAsync({
                                id: appId,
                                updateData: { status: 'selected' }
                            });
                            toast.success('Application status updated to Selected');
                        } catch (err) {
                            console.error('Failed to update application status:', err);
                            toast.error('Failed to update application status');
                            setIsSaving(false);
                            return;
                        }
                    }

                    await deleteInterviewMutation.mutateAsync(interviewId);
                    toast.success('Interview removed (Candidate Selected)');
                    router.push('/admin/interviews');
                    return;
                } else {
                    setIsSaving(false);
                    return;
                }
            }

            const result = await updateInterview(interviewId, { status, notes });
            if (result.success) {
                toast.success('Interview updated successfully');
                fetchInterview(); // Refresh data
            } else {
                toast.error('Failed to update interview');
            }
        } catch (error) {
            console.error('Error updating interview:', error);
            toast.error('Error updating interview');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this interview? This action cannot be undone.')) {
            try {
                await deleteInterviewMutation.mutateAsync(interviewId);
                toast.success('Interview deleted successfully');
                router.push('/admin/interviews');
            } catch (error) {
                console.error('Error deleting interview:', error);
                toast.error('Failed to delete interview');
            }
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

    if (!interview) return null;

    // Safe accessors
    const candidateName = interview.candidateId?.fullName || interview.applicationId?.candidateName || 'Unknown Candidate';
    const jobTitle = interview.jobId?.title || 'Unknown Job';
    const interviewType = interview.interviewType || 'video';
    const scheduledDate = new Date(interview.scheduledDate);
    const location = interview.location || interview.meetingLink || 'Not specified';

    return (
        <PageContainer>
            {/* Hero Header */}
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Interview Details
                        </h1>
                        <p className="text-white/80">
                            Manage interview schedule and feedback
                        </p>
                    </div>
                    <Button asChild variant="secondary" >
                        <Link href="/admin/interviews" className="flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Interviews
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
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide border ${interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                            interview.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                                                interview.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                                    'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                            {interview.status}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Interview for <span className="font-medium text-foreground">{jobTitle}</span>
                                    </p>
                                </div>
                                <div className="text-sm text-muted-foreground bg-muted px-3 py-1.5 rounded-full flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {scheduledDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Main Info */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Logistics Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        Interview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Time</p>
                                        <div className="flex items-center gap-2 font-medium">
                                            {scheduledDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            <span className="text-muted-foreground font-normal">
                                                ({interview.duration} min)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-sm font-medium text-muted-foreground">Format</p>
                                        <div className="flex items-center gap-2 font-medium capitalize">
                                            {interviewType === 'video' ? <Video className="w-4 h-4 text-muted-foreground" /> : <MapPin className="w-4 h-4 text-muted-foreground" />}
                                            {interviewType} Interview
                                        </div>
                                    </div>

                                    <div className="space-y-1 md:col-span-2">
                                        <p className="text-sm font-medium text-muted-foreground">Location / Link</p>
                                        <div className="p-3 bg-muted rounded-md text-sm break-all">
                                            {location.startsWith('http') ? (
                                                <a href={location} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-2">
                                                    {location}
                                                    <ArrowLeft className="w-3 h-3 rotate-135" />
                                                </a>
                                            ) : (
                                                location
                                            )}
                                        </div>
                                    </div>

                                    {interview.interviewers && interview.interviewers.length > 0 && (
                                        <div className="space-y-1 md:col-span-2">
                                            <p className="text-sm font-medium text-muted-foreground">Interviewers</p>
                                            <div className="flex flex-wrap gap-2">
                                                {interview.interviewers.map((name: string, idx: number) => (
                                                    <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                                                        {name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Additional Details */}
                            {interview.notes && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">Original Notes</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{interview.notes}</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Update Status Card */}
                            <Card className="border-primary/20 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">Interview Status</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Select value={status} onValueChange={setStatus}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map(option => (
                                                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-muted-foreground">Feedback / Notes</p>
                                        <Textarea
                                            placeholder="Add notes about the interview outcome..."
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={5}
                                        />
                                    </div>

                                    <Button className="w-full" onClick={handleUpdate} disabled={isSaving}>
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

                            <Card>
                                <CardContent className="p-4 space-y-3">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/admin/applications/${interview.applicationId?._id || interview.applicationId}`}>
                                            <User className="w-4 h-4 mr-2" />
                                            View Full Application
                                        </Link>
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        className="w-full justify-start bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                                        onClick={handleDelete}
                                    >
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Delete Interview
                                    </Button>
                                </CardContent>
                            </Card>

                        </div>

                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
