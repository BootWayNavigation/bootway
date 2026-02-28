'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
    Plus,
    Search,
    Trash2,
    MoreHorizontal,
    CheckCircle2,
    Clock,
    AlertCircle,
    CalendarDays,
    ArrowLeft,
    ClipboardList,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import PageContainer from '@/components/layout/PageContainer';
import { useProject, useTasks, useDeleteTask, useUpdateTask } from '@/hooks/useApi';

const PRIORITY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | null; color: string }> = {
    low: { label: 'Low', variant: 'secondary', color: 'text-gray-500' },
    medium: { label: 'Medium', variant: 'default', color: 'text-blue-500' },
    high: { label: 'High', variant: 'outline', color: 'text-orange-500' },
    urgent: { label: 'Urgent', variant: 'destructive', color: 'text-red-600' },
};

const STATUS_OPTIONS = [
    { value: 'todo', label: 'To Do', color: 'text-gray-700', bg: 'bg-gray-100' },
    { value: 'in-progress', label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100' },
    { value: 'review', label: 'Review', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    { value: 'completed', label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
];

function isOverdue(deadline: string, status: string) {
    return status !== 'completed' && new Date(deadline) < new Date();
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProjectDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params?.id as string;

    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: project, isLoading: loadingProject } = useProject(projectId);
    const { data: tasks = [], isLoading: loadingTasks } = useTasks({ project: projectId });
    const deleteTask = useDeleteTask();
    const updateTask = useUpdateTask();

    const filtered = tasks.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusChange = (id: string, status: string) => {
        updateTask.mutate({ id, updateData: { status } });
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteTask.mutateAsync(deleteId);
        setDeleteId(null);
    };

    if (loadingProject) {
        return (
            <PageContainer>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            </PageContainer>
        );
    }

    if (!project) {
        return (
            <PageContainer>
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <AlertCircle className="w-12 h-12 text-destructive opacity-50" />
                    <h2 className="text-xl font-bold">Project Not Found</h2>
                    <Button asChild variant="outline">
                        <Link href="/admin/project-management">Go Back</Link>
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            {/* Header */}
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom">
                    <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/10 -ml-2 mb-4" asChild>
                        <Link href="/admin/project-management">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Projects
                        </Link>
                    </Button>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">{project.name}</h1>
                                <Badge variant="outline" className="text-white border-white/30 capitalize">
                                    {project.status}
                                </Badge>
                            </div>
                            <p className="text-white/80 max-w-2xl">{project.description || 'No description provided.'}</p>
                        </div>
                        <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold shadow self-start md:self-center">
                            <Link href={`/admin/project-management/create?projectId=${projectId}`}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Task
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="section-padding bg-muted/30">
                <div className="container-custom space-y-6">
                    {/* Filters & Search */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tasks in this project..."
                                className="pl-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Task Table */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-primary" />
                                Project Tasks
                                <span className="text-muted-foreground font-normal text-sm ml-auto">
                                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {loadingTasks ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                                    <ClipboardList className="w-12 h-12 opacity-30" />
                                    <p className="text-base">No tasks found in this project</p>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/admin/project-management/create?projectId=${projectId}`}>
                                            <Plus className="w-4 h-4 mr-1" />
                                            Create first task
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[30%]">Task Name</TableHead>
                                                <TableHead>Assigned To</TableHead>
                                                <TableHead>Deadline</TableHead>
                                                <TableHead>Time (Hrs)</TableHead>
                                                <TableHead>Priority</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.map((task) => {
                                                const priorityCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
                                                const statusCfg = STATUS_OPTIONS.find(s => s.value === task.status) || STATUS_OPTIONS[0];
                                                const overdue = isOverdue(task.deadline, task.status);
                                                const empName = (task.assignedTo as any)?.user?.fullName ?? (task.assignedTo as any)?.position ?? '—';

                                                return (
                                                    <TableRow key={task._id}>
                                                        <TableCell className="font-medium">
                                                            <div className="max-w-[200px]">
                                                                <p className="truncate" title={task.title}>{task.title}</p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                                                    {empName.charAt(0).toUpperCase()}
                                                                </div>
                                                                <span className="text-sm truncate max-w-[120px]">{empName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className={`flex items-center gap-1 text-sm ${overdue ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                                                                {formatDate(task.deadline)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm font-medium">
                                                                {task.estimatedHours || 0}h
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={priorityCfg.variant as any}>{priorityCfg.label}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Select
                                                                value={task.status}
                                                                onValueChange={(val) => handleStatusChange(task._id, val)}
                                                            >
                                                                <SelectTrigger className={`w-32 h-7 text-xs border-none px-2 ${statusCfg.bg} ${statusCfg.color}`}>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {STATUS_OPTIONS.map(opt => (
                                                                        <SelectItem key={opt.value} value={opt.value}>
                                                                            {opt.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" title="View Details" onClick={() => router.push(`/admin/project-management/tasks/${task._id}`)}>
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                            <MoreHorizontal className="w-4 h-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => router.push(`/admin/project-management/create?edit=${task._id}`)}>
                                                                            Edit Task
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => router.push(`/admin/project-management/tasks/${task._id}`)}>
                                                                            View Details
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            className="text-destructive focus:text-destructive"
                                                                            onClick={() => setDeleteId(task._id)}
                                                                        >
                                                                            Delete Task
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </PageContainer>
    );
}
