'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    ClipboardList,
    Paperclip,
    X,
    Loader2,
    ClipboardCheck,
    CheckCircle2,
    Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import PageContainer from '@/components/layout/PageContainer';
import { useCreateTask, useUpdateTask, useEmployees, useTask, useProjects, useProject } from '@/hooks/useApi';
import React from 'react';
import { toast } from 'sonner';

export default function CreateTaskPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEdit = !!editId;

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: employees = [], isLoading: employeesLoading } = useEmployees();
    const { data: existingTask, isLoading: taskLoading } = useTask(editId as string, {
        enabled: isEdit,
    } as any);

    const createTask = useCreateTask();
    const updateTask = useUpdateTask();

    const urlProjectId = searchParams.get('projectId');
    const { data: projects = [] } = useProjects();
    const { data: selectedProject } = useProject(urlProjectId || '', { enabled: !!urlProjectId });

    // form state
    const [form, setForm] = useState({
        title: '',
        description: '',
        projectId: urlProjectId || '',
        assignedTo: '',
        deadline: '',
        priority: 'medium',
        status: 'todo',
        estimatedHours: '',
        tags: '',
    });

    const [attachments, setAttachments] = useState<File[]>([]);
    const [existingAttachments, setExistingAttachments] = useState<string[]>([]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    // Populate form if editing
    React.useEffect(() => {
        if (isEdit && existingTask) {
            setForm({
                title: existingTask.title || '',
                description: existingTask.description || '',
                projectId: typeof existingTask.project === 'string'
                    ? existingTask.project
                    : (existingTask.project as any)?._id || '',
                assignedTo: typeof existingTask.assignedTo === 'string'
                    ? existingTask.assignedTo
                    : existingTask.assignedTo?._id || '',
                deadline: existingTask.deadline ? new Date(existingTask.deadline).toISOString().split('T')[0] : '',
                priority: existingTask.priority || 'medium',
                status: existingTask.status || 'todo',
                estimatedHours: existingTask.estimatedHours ? existingTask.estimatedHours.toString() : '',
                tags: existingTask.tags ? existingTask.tags.join(', ') : '',
            });
            if (existingTask.attachments) setExistingAttachments(existingTask.attachments);
        }
    }, [isEdit, existingTask]);

    // Update projectId if it comes from URL later (though useSearchParams is usually stable)
    React.useEffect(() => {
        if (urlProjectId && !isEdit) {
            setForm(prev => ({ ...prev, projectId: urlProjectId }));
        }
    }, [urlProjectId, isEdit]);

    // handlers
    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setAttachments(prev => [...prev, ...files]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.title.trim()) newErrors.title = 'Task title is required.';
        if (!form.assignedTo) newErrors.assignedTo = 'Assignee is required.';
        if (!form.deadline) newErrors.deadline = 'Deadline is required.';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            toast.error('Please fix the errors in the form');
            return;
        }

        setSubmitting(true);
        try {
            const finalProjectId = (form.projectId && form.projectId !== 'none' && form.projectId !== '')
                ? form.projectId
                : undefined;

            const payload: any = {
                ...form,
                project: finalProjectId,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                estimatedHours: form.estimatedHours ? parseFloat(form.estimatedHours) : undefined,
                attachments: existingAttachments,
            };

            if (isEdit) {
                await updateTask.mutateAsync({ id: editId!, updateData: payload });
                toast.success('Task updated successfully');
            } else {
                await createTask.mutateAsync(payload);
                toast.success('Task created successfully');
            }

            // Route back to project or project management
            const redirectId = finalProjectId || form.projectId;
            if (redirectId && redirectId !== 'none') {
                router.push(`/admin/project-management/${redirectId}`);
            } else {
                router.push('/admin/project-management');
            }
        } catch (err: any) {
            toast.error(err.message || 'Error saving task');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageContainer>
            {/* Hero */}
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom">
                    <div className="flex items-center gap-3 mb-3">
                        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 -ml-2" asChild>
                            <Link href={form.projectId ? `/admin/project-management/${form.projectId}` : "/admin/project-management"}>
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        <ClipboardList className="w-7 h-7" />
                        {isEdit ? 'Edit Task' : 'Create New Task'}
                    </h1>
                    <p className="text-white/80">
                        {isEdit ? 'Update task details and assignments.' : 'Assign work to employees and track progress.'}
                    </p>
                </div>
            </section>

            <section className="section-padding bg-muted/30">
                <div className="container-custom max-w-4xl">
                    {isEdit && taskLoading ? (
                        <div className="flex justify-center p-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Task Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Project Selection */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="projectId">
                                                Project (Optional)
                                            </Label>
                                            <Select
                                                value={form.projectId}
                                                onValueChange={(v) => handleChange('projectId', v)}
                                                disabled={!!urlProjectId && !isEdit}
                                            >
                                                <SelectTrigger id="projectId" className={errors.projectId ? 'border-destructive' : ''}>
                                                    <SelectValue placeholder="Select a project" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Standalone / No Project</SelectItem>
                                                    {projects.map((p) => (
                                                        <SelectItem key={p._id} value={p._id}>
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.projectId && <p className="text-xs text-destructive">{errors.projectId}</p>}
                                        </div>

                                        {/* Task Title */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="title">
                                                Task Title <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="title"
                                                placeholder="e.g. Design Dashboard UI"
                                                value={form.title}
                                                onChange={(e) => handleChange('title', e.target.value)}
                                                className={errors.title ? 'border-destructive' : ''}
                                            />
                                            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-1.5">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Details about the task..."
                                            rows={4}
                                            value={form.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {/* Assigned To */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="assignedTo">
                                                Assign To <span className="text-destructive">*</span>
                                            </Label>
                                            <Select value={form.assignedTo} onValueChange={(v) => handleChange('assignedTo', v)}>
                                                <SelectTrigger id="assignedTo" className={errors.assignedTo ? 'border-destructive' : ''}>
                                                    <SelectValue placeholder={employeesLoading ? 'Loading employees...' : 'Select Employee'} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {employees.map((emp: any) => (
                                                        <SelectItem key={emp._id} value={emp._id}>
                                                            {emp.user?.fullName ?? emp.position}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors.assignedTo && <p className="text-xs text-destructive">{errors.assignedTo}</p>}
                                        </div>

                                        {/* Deadline */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="deadline">
                                                Set Deadline <span className="text-destructive">*</span>
                                            </Label>
                                            <Input
                                                id="deadline"
                                                type="date"
                                                value={form.deadline}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => handleChange('deadline', e.target.value)}
                                                className={errors.deadline ? 'border-destructive' : ''}
                                            />
                                            {errors.deadline && <p className="text-xs text-destructive">{errors.deadline}</p>}
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-4">
                                        {/* Priority */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="priority">Set Priority</Label>
                                            <Select value={form.priority} onValueChange={(v) => handleChange('priority', v)}>
                                                <SelectTrigger id="priority">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="low">🟢 Low</SelectItem>
                                                    <SelectItem value="medium">🔵 Medium</SelectItem>
                                                    <SelectItem value="high">🟠 High</SelectItem>
                                                    <SelectItem value="urgent">🔴 Urgent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Status */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="status">Initial Status</Label>
                                            <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                                                <SelectTrigger id="status">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="todo">To Do</SelectItem>
                                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                                    <SelectItem value="review">Review</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Estimated Hours */}
                                        <div className="space-y-1.5">
                                            <Label htmlFor="estimatedHours">Estimated Hours</Label>
                                            <Input
                                                id="estimatedHours"
                                                type="number"
                                                min={0}
                                                step={0.5}
                                                placeholder="e.g. 8"
                                                value={form.estimatedHours}
                                                onChange={(e) => handleChange('estimatedHours', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Extra */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Additional Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="tags">Tags</Label>
                                        <Input
                                            id="tags"
                                            placeholder="design, frontend, urgent (comma-separated)"
                                            value={form.tags}
                                            onChange={(e) => handleChange('tags', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label>Attach Files (optional)</Label>
                                        <div
                                            className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-5 text-center hover:border-primary/50 transition-colors cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <Paperclip className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">Click to attach files</p>
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        {(attachments.length > 0 || existingAttachments.length > 0) && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {existingAttachments.map((f, i) => (
                                                    <Badge key={i} variant="secondary" className="gap-1">
                                                        {f}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => setExistingAttachments(prev => prev.filter((_, idx) => idx !== i))} />
                                                    </Badge>
                                                ))}
                                                {attachments.map((f, i) => (
                                                    <Badge key={i} variant="outline" className="gap-1">
                                                        {f.name}
                                                        <X className="w-3 h-3 cursor-pointer" onClick={() => removeAttachment(i)} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit */}
                            <div className="flex items-center gap-3 justify-end pb-6">
                                <Button type="button" variant="outline" asChild>
                                    <Link href={form.projectId ? `/admin/project-management/${form.projectId}` : "/admin/project-management"}>Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={submitting} className="min-w-[140px]">
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <ClipboardList className="w-4 h-4 mr-2" />
                                    )}
                                    {isEdit ? 'Save Changes' : 'Create Task'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </PageContainer>
    );
}
