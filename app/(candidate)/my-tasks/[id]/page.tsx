'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import {
    ArrowLeft, ClipboardCheck, Clock, Calendar, AlertCircle, Tag, CheckCircle2, FileText, Link as LinkIcon, LayoutGrid, Paperclip
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useTask, useSubmitTask } from '@/hooks/useApi';
import { toast } from 'sonner';

export default function CandidateTaskDetailPage() {
    const params = useParams();
    const router = useRouter();
    const taskId = params.id as string;

    const { data: task, isLoading, error } = useTask(taskId);
    const submitTask = useSubmitTask();

    const [submissionNote, setSubmissionNote] = useState('');
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [status, setStatus] = useState<string>('in-progress');
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [submissionFiles, setSubmissionFiles] = useState<File[]>([]);

    // Initialize state when task loads
    React.useEffect(() => {
        if (task) {
            setSubmissionNote(task.submissionNote || '');
            setSubmissionUrl(task.submissionUrl || '');
            setStatus(task.status || 'in-progress');
            setSubmissionFiles([]);
        }
    }, [task]);

    if (isLoading) {
        return (
            <PageContainer>
                <div className="container-custom max-w-4xl py-8 space-y-6">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </PageContainer>
        );
    }

    if (error || !task) {
        return (
            <PageContainer>
                <div className="container-custom max-w-4xl py-8">
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="pt-6 text-center text-destructive">
                            <p>Failed to load task details. It may not exist or isn&apos;t assigned to you.</p>
                            <Button variant="outline" className="mt-4" asChild>
                                <Link href="/my-tasks">Back to My Tasks</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let payload: any;
            if (submissionFiles.length > 0) {
                const formData = new FormData();
                formData.append('status', status);
                formData.append('submissionNote', submissionNote);
                formData.append('submissionUrl', submissionUrl);
                submissionFiles.forEach(file => {
                    formData.append('submissionFiles', file);
                });
                payload = formData;
            } else {
                payload = {
                    status: status as any,
                    submissionNote,
                    submissionUrl
                };
            }

            await submitTask.mutateAsync({
                id: taskId,
                data: payload
            });
            setIsEditing(false);
            toast.success('Task submitted successfully!');
            setSubmissionFiles([]);

            // Redirect to main tasks page as requested by user
            router.push('/my-tasks');
        } catch (err) {
            console.error('Submission failed', err);
            toast.error('Failed to submit task.');
        } finally {
            setSubmitting(false);
        }
    };

    const isReadOnly = task.status === 'completed' && !isEditing;
    const isDeadlinePassed = task.deadline ? new Date(task.deadline) < new Date() : false;

    return (
        <PageContainer>
            <div className="container-custom max-w-4xl py-8">
                {/* Back Link */}
                <div className="mb-6">
                    <Button variant="ghost" className="-ml-4 text-muted-foreground" asChild>
                        <Link href="/my-tasks">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to My Tasks
                        </Link>
                    </Button>
                </div>

                {isDeadlinePassed && task.status !== 'completed' && (
                    <Card className="mb-6 border-amber-300 bg-amber-50">
                        <CardContent className="py-4 flex items-center gap-3 text-amber-800">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="text-sm font-medium"> The deadline for this task has passed. You can no longer accept or submit work.</p>
                        </CardContent>
                    </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Task Header info */}
                        <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant={
                                    task.status === 'completed' ? 'default' :
                                        task.status === 'review' ? 'secondary' : 'outline'
                                } className={task.status === 'completed' ? 'bg-green-600 hover:bg-green-700' : ''}>
                                    Status: {task.status.replace('-', ' ').toUpperCase()}
                                </Badge>
                                <Badge variant={task.priority === 'urgent' ? 'destructive' : 'secondary'}>
                                    {task.priority.toUpperCase()} Priority
                                </Badge>
                            </div>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4">
                                {task.title}
                            </h1>

                            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground bg-muted/20 p-6 rounded-xl border">
                                {task.description ? (
                                    <div dangerouslySetInnerHTML={{ __html: task.description.replace(/\n/g, '<br/>') }} />
                                ) : (
                                    <span className="italic">No detailed description provided.</span>
                                )}
                            </div>
                        </div>

                        {/* Submission Area */}
                        <Card className="border-primary/20 shadow-sm overflow-hidden">
                            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-primary" />
                                    Your Submission
                                </h3>
                            </div>
                            <CardContent className="pt-6">
                                {isReadOnly ? (
                                    <div className="space-y-6">
                                        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-4 flex items-start gap-3 text-green-800 dark:text-green-300">
                                            <CheckCircle2 className="w-5 h-5 mt-0.5" />
                                            <div>
                                                <p className="font-medium">This task is completed successfully.</p>
                                                <p className="text-sm opacity-80 mt-1">HR has reviewed and approved your submission.</p>
                                            </div>
                                        </div>

                                        {task.submissionUrl && (
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Attached Link</h4>
                                                <a href={task.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5 break-all">
                                                    <LinkIcon className="w-4 h-4 shrink-0" />
                                                    {task.submissionUrl}
                                                </a>
                                            </div>
                                        )}

                                        {task.submissionAttachments && task.submissionAttachments.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-2">Attached Files</h4>
                                                <div className="flex flex-col gap-2">
                                                    {task.submissionAttachments.map((fileUrl: string, index: number) => (
                                                        <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 rounded border hover:bg-muted/50 transition-colors text-sm">
                                                            <Paperclip className="w-4 h-4 text-primary shrink-0" />
                                                            <span className="truncate">Submission File {index + 1}</span>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {task.submissionNote && (
                                            <div>
                                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Notes</h4>
                                                <div className="bg-muted/40 p-4 rounded-lg text-sm whitespace-pre-wrap">
                                                    {task.submissionNote}
                                                </div>
                                            </div>
                                        )}

                                        <Button 
                                            variant="outline" 
                                            className="w-full" 
                                            onClick={() => setIsEditing(true)}
                                            disabled={isDeadlinePassed}
                                        >
                                            Update Submission
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="space-y-4">
                                            <div className="space-y-1.5 text-sm">
                                                <Label htmlFor="status" className="font-semibold">Update Status</Label>
                                                <Select 
                                                    value={status} 
                                                    onValueChange={setStatus}
                                                    disabled={isDeadlinePassed}
                                                >
                                                    <SelectTrigger id="status" className="w-full md:w-[200px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                                        <SelectItem 
                                                            value="review" 
                                                            disabled={task.status !== 'in-progress' && task.status !== 'review'}
                                                        >
                                                            Ready for Review
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {status === 'review' && !isDeadlinePassed && (
                                                <>
                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="submissionUrl" className="font-semibold flex items-center gap-1.5">
                                                            <LinkIcon className="w-4 h-4" /> Work Link <span className="text-muted-foreground font-normal">(optional)</span>
                                                        </Label>
                                                        <Input
                                                            id="submissionUrl"
                                                            placeholder="e.g. Google Doc link, GitHub PR, Figma design, etc."
                                                            value={submissionUrl}
                                                            onChange={e => setSubmissionUrl(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="submissionNote" className="font-semibold flex items-center gap-1.5">
                                                            <FileText className="w-4 h-4" /> Submission Notes
                                                        </Label>
                                                        <Textarea
                                                            id="submissionNote"
                                                            placeholder="Describe what you've done, blockers, or notes for the reviewer..."
                                                            rows={5}
                                                            value={submissionNote}
                                                            onChange={e => setSubmissionNote(e.target.value)}
                                                            className="resize-y"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label htmlFor="submissionFiles" className="font-semibold flex items-center gap-1.5">
                                                            <Paperclip className="w-4 h-4" /> Attach Files <span className="text-muted-foreground font-normal">(optional)</span>
                                                        </Label>
                                                        <Input
                                                            id="submissionFiles"
                                                            type="file"
                                                            multiple
                                                            onChange={(e) => {
                                                                if (e.target.files) {
                                                                    setSubmissionFiles(Array.from(e.target.files));
                                                                }
                                                            }}
                                                            className="cursor-pointer file:cursor-pointer"
                                                        />
                                                        {submissionFiles.length > 0 && (
                                                            <p className="text-xs text-muted-foreground">
                                                                {submissionFiles.length} file(s) selected
                                                            </p>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex gap-3 justify-end pt-2">
                                            {task.status === 'completed' && (
                                                <Button type="button" variant="ghost" onClick={() => {
                                                    setIsEditing(false);
                                                    setSubmissionNote(task.submissionNote || '');
                                                    setSubmissionUrl(task.submissionUrl || '');
                                                    setStatus(task.status);
                                                }}>
                                                    Cancel
                                                </Button>
                                            )}
                                            <Button 
                                                type="submit" 
                                                disabled={submitting || isDeadlinePassed || (status === 'in-progress' && task.status === 'in-progress')}
                                            >
                                                {submitting ? 'Submitting...' : 
                                                 isDeadlinePassed ? 'Deadline Passed' :
                                                 status === 'in-progress' ? (task.status === 'in-progress' ? 'Accepted' : 'Accept Task') : 
                                                 'Submit Work'}
                                            </Button>
                                        </div>

                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {(task.project as any)?.name && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardHeader className="pb-3 text-sm font-semibold uppercase tracking-wider text-primary flex flex-row items-center gap-2">
                                    <LayoutGrid className="w-4 h-4" />
                                    Project Context
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase font-semibold">Project Name</p>
                                        <p className="font-bold text-foreground">{(task.project as any).name}</p>
                                    </div>
                                    {(task.project as any).description && (
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase font-semibold">Description</p>
                                            <p className="text-sm text-foreground line-clamp-4 leading-relaxed">
                                                {(task.project as any).description}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        <Card>
                            <CardHeader className="pb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Task Details
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Deadline</p>
                                        <p className="font-semibold">{format(new Date(task.deadline), 'EEEE, MMM d, yyyy')}</p>
                                    </div>
                                </div>

                                {task.estimatedHours && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Estimated Time</p>
                                            <p>{task.estimatedHours} hours</p>
                                        </div>
                                    </div>
                                )}

                                {task.tags && task.tags.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Tag className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium mb-1.5">Tags</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {task.tags.map((tag: string, i: number) => (
                                                    <Badge key={i} variant="secondary" className="text-xs">{tag}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
