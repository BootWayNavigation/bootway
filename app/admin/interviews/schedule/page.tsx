'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageContainer from '@/components/layout/PageContainer';
import { ArrowLeft, Calendar, Clock, MapPin, Video, Users, Phone, Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { getApplicationById, scheduleInterview } from '@/lib/apiClient'; // We need to expose scheduleInterview
import { toast } from 'sonner';

function ScheduleInterviewForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const applicationId = searchParams?.get('applicationId');

    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingApp, setIsFetchingApp] = useState(true);
    const [application, setApplication] = useState<any>(null);

    const [formData, setFormData] = useState({
        interviewType: 'video',
        scheduledDate: '',
        scheduledTime: '',
        duration: '60',
        location: '', // Meeting link or physical location
        interviewers: '', // Comma separated emails or names
        notes: ''
    });

    useEffect(() => {
        const fetchApplicationDetails = async () => {
            try {
                if (!applicationId) return;
                const response = await getApplicationById(applicationId);
                if (response.success && response.data) {
                    setApplication(response.data);
                } else {
                    toast.error('Failed to load application details');
                }
            } catch (error) {
                console.error('Error fetching application:', error);
                toast.error('Error loading application details');
            } finally {
                setIsFetchingApp(false);
            }
        };

        if (applicationId) {
            fetchApplicationDetails();
        } else {
            setIsFetchingApp(false);
            toast.error('No application selected');
        }
    }, [applicationId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.scheduledDate || !formData.scheduledTime) {
            toast.error('Please select both date and time');
            return;
        }

        setIsLoading(true);

        try {
            // Combine date and time
            const scheduledDateTime = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`);

            const payload = {
                applicationId,
                jobId: application.jobId._id,
                candidateId: application.candidateId?._id || application.candidateId, // Handle populated or ID
                interviewType: formData.interviewType,
                scheduledDate: scheduledDateTime.toISOString(),
                duration: parseInt(formData.duration),
                location: formData.location,
                interviewers: formData.interviewers.split(',').map(s => s.trim()).filter(Boolean),
                notes: formData.notes
            };

            console.log('Sending schedule payload:', payload);

            const result = await scheduleInterview(payload);

            if (result.success) {
                toast.success('Interview scheduled successfully!');
                router.push('/admin/interviews');
            } else {
                toast.error(`Failed: ${result.message}`);
            }
        } catch (error: any) {
            console.error('Error scheduling interview:', error);
            toast.error(error.message || 'Failed to schedule interview');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetchingApp) {
        return (
            <PageContainer>
                <div className="flex justify-center py-20">Loading...</div>
            </PageContainer>
        );
    }

    const candidateName = application?.candidateName || application?.candidateId?.fullName || 'Candidate';
    const jobTitle = application?.jobId?.title || 'Unknown Job';

    return (
        <PageContainer>
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            Schedule Interview
                        </h1>
                        <p className="text-white/80">
                            Arrange an interview with {candidateName} for {jobTitle}
                        </p>
                    </div>
                    <Button asChild variant="secondary">
                        <Link href={`/admin/applications/${applicationId}`} className="flex items-center">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Application
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="section-padding bg-muted/30">
                <div className="container-custom max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Interview Details</CardTitle>
                            <CardDescription>
                                Fill in the details to schedule the interview.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Date */}
                                    <div className="space-y-2">
                                        <Label>Date *</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="date"
                                                name="scheduledDate"
                                                value={formData.scheduledDate}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="space-y-2">
                                        <Label>Time *</Label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="time"
                                                name="scheduledTime"
                                                value={formData.scheduledTime}
                                                onChange={handleInputChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Type */}
                                    <div className="space-y-2">
                                        <Label>Interview Type</Label>
                                        <Select
                                            value={formData.interviewType}
                                            onValueChange={(val) => handleSelectChange('interviewType', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="video">Video Call</SelectItem>
                                                <SelectItem value="phone">Phone Call</SelectItem>
                                                <SelectItem value="in-person">In Person</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Duration */}
                                    <div className="space-y-2">
                                        <Label>Duration (minutes)</Label>
                                        <Select
                                            value={formData.duration}
                                            onValueChange={(val) => handleSelectChange('duration', val)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">15 minutes</SelectItem>
                                                <SelectItem value="30">30 minutes</SelectItem>
                                                <SelectItem value="45">45 minutes</SelectItem>
                                                <SelectItem value="60">1 hour</SelectItem>
                                                <SelectItem value="90">1.5 hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Location / Link */}
                                <div className="space-y-2">
                                    <Label>
                                        {formData.interviewType === 'in-person' ? 'Location Address' : 'Meeting Link / Phone Number'}
                                    </Label>
                                    <div className="relative">
                                        {formData.interviewType === 'video' ? (
                                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        ) : formData.interviewType === 'phone' ? (
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        ) : (
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        )}
                                        <Input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder={formData.interviewType === 'video' ? 'e.g., Zoom/Google Meet link' : ''}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Interviewers */}
                                <div className="space-y-2">
                                    <Label>Interviewers (Optional)</Label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            name="interviewers"
                                            value={formData.interviewers}
                                            onChange={handleInputChange}
                                            placeholder="Comma separated names or emails"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                    <Label>Notes for Interviewer</Label>
                                    <Textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        placeholder="Topics to cover, specific questions, etc."
                                        rows={3}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Scheduling...' : 'Schedule Interview'}
                                    </Button>
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </PageContainer>
    );
}

export default function ScheduleInterview() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <ScheduleInterviewForm />
        </Suspense>
    );
}
