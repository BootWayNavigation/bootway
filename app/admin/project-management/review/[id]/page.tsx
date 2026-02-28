'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    ClipboardCheck,
    CalendarDays,
    Clock,
    Tag,
    Paperclip,
    CheckCircle2,
    Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import PageContainer from '@/components/layout/PageContainer';
import { useTask, useUpdateTask } from '@/hooks/useApi';
import { toast } from 'sonner';

export default function ReviewTaskPage() {
    const params = useParams();
    const router = useRouter();
    const taskId = params.id as string;

    const { data: task, isLoading, error } = useTask(taskId);
    const updateTask = useUpdateTask();

    const handleApprove = async () => {
        try {
            await updateTask.mutateAsync({
                id: taskId,
                updateData: { status: 'completed' }
            });
            toast.success('Task marked as Completed Successfully!');
            router.push('/admin/project-management');
        } catch (error) {
            toast.error('Failed to approve task');
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <PageContainer>
                <div className="container-custom py-8 space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </PageContainer>
        );
    }

    if (error || !task) {
        return (
            <PageContainer>
                <div className="container-custom py-8">
                    <div className="p-6 bg-red-50 text-red-600 rounded-lg text-center">
                        Task not found or failed to load.
                    </div>
                    <Button variant="ghost" onClick={() => router.push('/admin/project-management')} className="mt-4">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tasks
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="bg-muted/30 border-b">
                <div className="container-custom py-4">
                    <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground">
                        <Link href="/admin/project-management">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Project Management
                        </Link>
                    </Button>
                </div>
            </div>

            <section className="section-padding">
                <div className="container-custom max-w-4xl">
                    <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                <ClipboardCheck className="w-7 h-7 text-primary" />
                                Review Candidate Submission
                            </h1>
                            <p className="text-muted-foreground mt-1">
                                Review the completed work from the assigned candidate
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Candidate Submission block */}
                        <Card className="border-primary shadow-md overflow-hidden">
                            <div className="bg-primary/5 px-6 py-4 border-b border-primary/20">
                                <h3 className="font-semibold text-xl flex items-center gap-2">
                                    <ClipboardCheck className="w-6 h-6 text-primary" />
                                    Submission Details
                                </h3>
                            </div>
                            <CardContent className="pt-6 space-y-6">
                                {task.submissionUrl && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-muted-foreground" />
                                            Attached Link
                                        </h4>
                                        <div className="bg-primary/5 border border-primary/10 rounded-lg p-3">
                                            <a href={task.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium break-all">
                                                {task.submissionUrl}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {task.submissionNote && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                                            <ClipboardCheck className="w-4 h-4 text-muted-foreground" />
                                            Candidate Notes
                                        </h4>
                                        <div className="bg-muted border rounded-lg p-5 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
                                            {task.submissionNote}
                                        </div>
                                    </div>
                                )}

                                {(!task.submissionUrl && !task.submissionNote) && (
                                    <div className="text-muted-foreground italic text-center py-6 bg-muted/30 rounded-lg">
                                        No explicit URL or notes were provided by the candidate.
                                    </div>
                                )}

                                {/* Action to Complete */}
                                {task.status !== 'completed' ? (
                                    <div className="pt-6 border-t mt-4 flex flex-col sm:flex-row items-center gap-4">
                                        <Button
                                            size="lg"
                                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold text-base"
                                            onClick={handleApprove}
                                        >
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            Approve &amp; Mark as Completed
                                        </Button>
                                        <p className="text-sm text-muted-foreground text-center sm:text-left">
                                            This will finalize the task and notify the candidate.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="pt-6 border-t mt-4">
                                        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 border border-green-200">
                                            <CheckCircle2 className="w-6 h-6" />
                                            <div>
                                                <p className="font-semibold">Task Completed</p>
                                                <p className="text-sm">This submission has already been approved.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Task Original Details block */}
                        <Card>
                            <CardHeader className="bg-muted/30 border-b">
                                <CardTitle className="text-lg">Original Task Instructions</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                                    {task.description && (
                                        <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground whitespace-pre-wrap border border-border/50">
                                            {task.description}
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Deadline</p>
                                        <p className="font-medium">{new Date(task.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Estimated</p>
                                        <p className="font-medium">{task.estimatedHours ? `${task.estimatedHours} hours` : '—'}</p>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1">Status</p>
                                        <Badge variant="outline" className="capitalize">{task.status}</Badge>
                                    </div>
                                    <div className="p-3 bg-muted/40 rounded-lg border border-border/50">
                                        <p className="text-xs text-muted-foreground mb-1">Priority</p>
                                        <Badge variant="outline" className="capitalize">{task.priority}</Badge>
                                    </div>
                                </div>

                                {task.tags && task.tags.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><Tag className="w-4 h-4 text-muted-foreground" /> Tags</p>
                                        <div className="flex flex-wrap gap-2">
                                            {task.tags.map((tag: string) => (
                                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {task.attachments && task.attachments.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-2 flex items-center gap-1.5"><Paperclip className="w-4 h-4 text-muted-foreground" /> Attachments</p>
                                        <ul className="space-y-2">
                                            {task.attachments.map((fileUrl: string, i: number) => {
                                                const fileName = fileUrl.split('/').pop() || `Attachment ${i + 1}`;
                                                return (
                                                    <li key={i}>
                                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded-md hover:bg-muted/80 text-sm text-primary transition-colors border border-transparent hover:border-border">
                                                            <Paperclip className="w-4 h-4 shrink-0" />
                                                            <span className="truncate">{fileName}</span>
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PageContainer>
    );
}
