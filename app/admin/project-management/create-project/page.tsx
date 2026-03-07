'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    LayoutGrid,
    Loader2,
    Save,
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
import PageContainer from '@/components/layout/PageContainer';
import { useCreateProject, useUpdateProject, useProject } from '@/hooks/useApi';
import { toast } from 'sonner';

function CreateProjectContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEdit = !!editId;

    const { data: project, isLoading: loadingProject } = useProject(editId as string, {
        enabled: isEdit,
    });

    const createProject = useCreateProject();
    const updateProject = useUpdateProject();

    const [form, setForm] = useState({
        name: '',
        description: '',
        status: 'planning',
        startDate: '',
        endDate: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit && project) {
            setForm({
                name: project.name || '',
                description: project.description || '',
                status: project.status || 'planning',
                startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
                endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
            });
        }
    }, [isEdit, project]);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.name.trim()) newErrors.name = 'Project name is required.';
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setSubmitting(true);
        try {
            if (isEdit && editId) {
                await updateProject.mutateAsync({ id: editId, updateData: form as any });
                toast.success('Project updated successfully');
            } else {
                await createProject.mutateAsync(form as any);
                toast.success('Project created successfully');
            }
            router.push('/admin/project-management');
        } catch (err: any) {
            toast.error(err.message || 'Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom">
                    <div className="flex items-center gap-3 mb-3">
                        <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 -ml-2" asChild>
                            <Link href="/admin/project-management">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        <LayoutGrid className="w-7 h-7" />
                        {isEdit ? 'Edit Project' : 'Create New Project'}
                    </h1>
                    <p className="text-white/80">
                        {isEdit ? 'Update project details and settings.' : 'A project acts as a container for grouped tasks.'}
                    </p>
                </div>
            </section>

            <section className="section-padding bg-muted/30">
                <div className="container-custom max-w-2xl">
                    {isEdit && loadingProject ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Project Name *</Label>
                                        <Input
                                            id="name"
                                            placeholder="e.g., Q1 Marketing Campaign"
                                            value={form.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={errors.name ? 'border-destructive' : ''}
                                        />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            placeholder="What is this project about?"
                                            rows={4}
                                            value={form.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Settings & Timeline</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                                            <SelectTrigger id="status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="planning">Planning</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="startDate">Start Date</Label>
                                            <Input
                                                id="startDate"
                                                type="date"
                                                value={form.startDate}
                                                onChange={(e) => handleChange('startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="endDate">End Date</Label>
                                            <Input
                                                id="endDate"
                                                type="date"
                                                value={form.endDate}
                                                onChange={(e) => handleChange('endDate', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex gap-3 justify-end">
                                <Button variant="outline" asChild disabled={submitting}>
                                    <Link href="/admin/project-management">Cancel</Link>
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? (
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    {isEdit ? 'Update Project' : 'Create Project'}
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </section>
        </PageContainer>
    );
}

function CreateProjectFallback() {
    return (
        <PageContainer>
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                        <LayoutGrid className="w-7 h-7" />
                        Create Project
                    </h1>
                </div>
            </section>
            <section className="section-padding bg-muted/30">
                <div className="container-custom max-w-2xl flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </section>
        </PageContainer>
    );
}

export default function CreateProjectPage() {
    return (
        <Suspense fallback={<CreateProjectFallback />}>
            <CreateProjectContent />
        </Suspense>
    );
}
