'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Clock,
    User,
    Tag,
    Paperclip,
    AlertCircle,
    CheckCircle2,
    Settings,
    FileText,
    ExternalLink,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import { useTask } from '@/hooks/useApi';

const PRIORITY_CONFIG: Record<string, { label: string, variant: string, icon: any }> = {
    low: { label: 'Low', variant: 'secondary', icon: null },
    medium: { label: 'Medium', variant: 'default', icon: null },
    high: { label: 'High', variant: 'destructive', icon: AlertCircle },
    urgent: { label: 'Urgent', variant: 'destructive', icon: AlertCircle },
};

const STATUS_CONFIG: Record<string, { label: string, color: string, bg: string }> = {
    todo: { label: 'To Do', color: 'text-slate-600', bg: 'bg-slate-100' },
    'in-progress': { label: 'In Progress', color: 'text-blue-600', bg: 'bg-blue-100' },
    review: { label: 'Review', color: 'text-orange-600', bg: 'bg-orange-100' },
    completed: { label: 'Completed', color: 'text-green-600', bg: 'bg-green-100' },
};

export default function TaskDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const taskId = params?.id as string;

    const { data: task, isLoading, error } = useTask(taskId);

    if (isLoading) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </PageContainer>
        );
    }

    if (error || !task) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <AlertCircle className="w-12 h-12 text-destructive" />
                    <h2 className="text-xl font-bold">Task Not Found</h2>
                    <p className="text-muted-foreground">The task you are looking for does not exist or has been deleted.</p>
                    <Button onClick={() => router.back()}>Go Back</Button>
                </div>
            </PageContainer>
        );
    }

    const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
    const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;
    const empName = (task.assignedTo as any)?.user?.fullName ?? (task.assignedTo as any)?.position ?? 'Unassigned';
    const creatorName = (task.createdBy as any)?.fullName ?? 'Unknown';

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <PageContainer>
            {/* Header */}
            <section className="bg-hero-gradient py-8 md:py-12">
                <div className="container-custom">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/80 hover:text-white hover:bg-white/10 mb-6 -ml-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to List
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
                        <div className="space-y-4 max-w-3xl">
                            <div className="flex flex-wrap gap-2">
                                <Badge className={`${status.bg} ${status.color} border-none`}>
                                    {status.label}
                                </Badge>
                                <Badge variant={priority.variant as any} className="gap-1">
                                    {priority.icon && <priority.icon className="w-3 h-3" />}
                                    {priority.label} Priority
                                </Badge>
                                {(task.project as any)?.name && (
                                    <Badge variant="outline" className="text-white border-white/30 truncate max-w-[200px]">
                                        Project: {(task.project as any).name}
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                {task.title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="secondary" onClick={() => router.push(`/admin/project-management/create?edit=${task._id}`)}>
                                <Settings className="w-4 h-4 mr-2" />
                                Edit Task
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section-padding bg-muted/30">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Main Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-primary mb-2">
                                        <FileText className="w-5 h-5" />
                                        <span className="font-semibold text-sm uppercase tracking-wider">Description</span>
                                    </div>
                                    <CardTitle className="text-xl">Task Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="prose prose-slate max-w-none text-muted-foreground whitespace-pre-wrap">
                                        {task.description || 'No description provided for this task.'}
                                    </div>

                                    {task.tags && task.tags.length > 0 && (
                                        <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
                                            {task.tags.map((tag: string, i: number) => (
                                                <Badge key={i} variant="outline" className="gap-1 flex items-center">
                                                    <Tag className="w-3 h-3" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2 text-primary mb-2">
                                        <Paperclip className="w-5 h-5" />
                                        <span className="font-semibold text-sm uppercase tracking-wider">Resources</span>
                                    </div>
                                    <CardTitle className="text-xl">Attachments & Links</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {task.attachments && task.attachments.length > 0 ? (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {task.attachments.map((file: string, i: number) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
                                                            <Paperclip className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-medium truncate">{file}</span>
                                                    </div>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <a href={file} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <p>No attachments provided.</p>
                                        </div>
                                    )}

                                    {(task.submissionUrl || task.submissionNote || (task.submissionAttachments && task.submissionAttachments.length > 0)) && (
                                        <div className="mt-8 pt-6 border-t space-y-4">
                                            <h4 className="font-semibold flex items-center gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                Submission Details
                                            </h4>
                                            {task.submissionUrl && (
                                                <a
                                                    href={task.submissionUrl.startsWith('http') ? task.submissionUrl : `https://${task.submissionUrl}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-primary hover:underline text-sm font-medium mb-4"
                                                >
                                                    <ExternalLink className="w-4 h-4 shrink-0" />
                                                    <span className="truncate max-w-sm md:max-w-md lg:max-w-lg">{task.submissionUrl}</span>
                                                </a>
                                            )}
                                            {task.submissionAttachments && task.submissionAttachments.length > 0 && (
                                                <div className="space-y-2 mb-4">
                                                    <p className="text-sm font-medium text-muted-foreground">Attached Files:</p>
                                                    <div className="grid sm:grid-cols-2 gap-4">
                                                        {task.submissionAttachments.map((fileUrl: string, index: number) => (
                                                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors border-primary/20">
                                                                <div className="flex items-center gap-3 overflow-hidden">
                                                                    <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
                                                                        <Paperclip className="w-4 h-4" />
                                                                    </div>
                                                                    <span className="text-sm font-medium truncate">Candidate Submission File {index + 1}</span>
                                                                </div>
                                                                <Button variant="ghost" size="icon" asChild>
                                                                    <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                                                        <ExternalLink className="w-4 h-4" />
                                                                    </a>
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {task.submissionNote && (
                                                <div className="p-4 rounded-lg bg-green-50 text-green-900 border border-green-200 text-sm">
                                                    <p className="font-medium mb-1 underline text-green-800">Note:</p>
                                                    {task.submissionNote}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg">Assignment Info</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                            {empName.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Assigned To</p>
                                            <p className="font-semibold">{empName}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t space-y-4 text-sm">
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span>Deadline</span>
                                            </div>
                                            <span className="font-medium text-red-600 font-medium">
                                                {formatDate(task.deadline)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                <span>Estimated Time</span>
                                            </div>
                                            <span className="font-medium">
                                                {task.estimatedHours || 0} Hours
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <User className="w-4 h-4" />
                                                <span>Created By</span>
                                            </div>
                                            <span className="font-medium">
                                                {creatorName}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-primary/5 border-primary/10">
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-primary" />
                                            System Note
                                        </h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            This task was created on {formatDate(task.createdAt)}. Any updates to status will be tracked and visible to the project administrator.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </PageContainer>
    );
}
