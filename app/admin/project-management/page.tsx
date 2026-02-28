'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Plus,
    Search,
    Trash2,
    MoreHorizontal,
    Clock,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    Calendar,
    ArrowRight,
    ClipboardList,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useProjects, useDeleteProject, useTasks, useUpdateTask, useDeleteTask } from '@/hooks/useApi';
import { useRouter } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
    'planning': { label: 'Planning', color: 'text-gray-700', bg: 'bg-gray-100', variant: 'secondary' },
    'active': { label: 'Active', color: 'text-blue-700', bg: 'bg-blue-100', variant: 'default' },
    'completed': { label: 'Completed', color: 'text-green-700', bg: 'bg-green-100', variant: 'outline' },
};

function formatDate(dateStr?: string) {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProjectManagementPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const { data: projects = [], isLoading } = useProjects();
    const deleteProject = useDeleteProject();

    const filtered = projects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: projects.length,
        active: projects.filter(p => p.status === 'active').length,
        completed: projects.filter(p => p.status === 'completed').length,
        planning: projects.filter(p => p.status === 'planning').length,
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        await deleteProject.mutateAsync(deleteId);
        setDeleteId(null);
    };

    const { data: allTasks = [], isLoading: tasksLoading } = useTasks();
    const updateTask = useUpdateTask();
    const deleteTask = useDeleteTask();
    const [taskDeleteId, setTaskDeleteId] = useState<string | null>(null);

    const handleTaskStatusChange = (id: string, status: string) => {
        updateTask.mutate({ id, updateData: { status } });
    };

    const handleTaskDelete = async () => {
        if (!taskDeleteId) return;
        await deleteTask.mutateAsync(taskDeleteId);
        setTaskDeleteId(null);
    };

    const isOverdue = (deadline: string, status: string) => {
        return status !== 'completed' && new Date(deadline) < new Date();
    };

    const TASK_STATUS_OPTIONS = [
        { value: 'todo', label: 'To Do', color: 'text-gray-700', bg: 'bg-gray-100' },
        { value: 'in-progress', label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100' },
        { value: 'review', label: 'Review', color: 'text-yellow-700', bg: 'bg-yellow-100' },
        { value: 'completed', label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
    ];

    const PRIORITY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | null }> = {
        low: { label: 'Low', variant: 'secondary' },
        medium: { label: 'Medium', variant: 'default' },
        high: { label: 'High', variant: 'outline' },
        urgent: { label: 'Urgent', variant: 'destructive' },
    };

    return (
        <PageContainer>
            {/* Hero */}
            <section className="bg-hero-gradient py-8 md:py-10">
                <div className="container-custom flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 flex items-center gap-2">
                            <LayoutGrid className="w-7 h-7" />
                            Project Management
                        </h1>
                        <p className="text-white/80">Manage your projects and their associated tasks.</p>
                    </div>
                    <Button asChild className="bg-white text-primary hover:bg-white/90 font-semibold shadow">
                        <Link href="/admin/project-management/create-project">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Project
                        </Link>
                    </Button>
                </div>
            </section>

            <section className="section-padding bg-muted/30">
                <div className="container-custom space-y-6">

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Projects', value: stats.total, icon: <LayoutGrid className="w-5 h-5 text-primary" />, bg: 'bg-primary/10' },
                            { label: 'Active', value: stats.active, icon: <Clock className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
                            { label: 'Completed', value: stats.completed, icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, bg: 'bg-green-50' },
                            { label: 'Planning', value: stats.planning, icon: <AlertCircle className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
                        ].map(({ label, value, icon, bg }) => (
                            <Card key={label} className={`border-none shadow-sm ${bg}`}>
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">{value}</p>
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects..."
                                className="pl-9 bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Project Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <Card className="border-dashed py-20">
                            <CardContent className="flex flex-col items-center justify-center text-muted-foreground gap-4">
                                <LayoutGrid className="w-16 h-16 opacity-20" />
                                <div className="text-center">
                                    <p className="text-lg font-medium">No projects found</p>
                                    <p className="text-sm">Create a project to start organizing your tasks.</p>
                                </div>
                                <Button asChild variant="outline">
                                    <Link href="/admin/project-management/create-project">
                                        <Plus className="w-4 h-4 mr-2" />
                                        New Project
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((project) => (
                                <Card key={project._id} className="hover:shadow-md transition-shadow group">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <Badge variant={STATUS_CONFIG[project.status]?.variant || 'secondary'}>
                                                {STATUS_CONFIG[project.status]?.label || project.status}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/admin/project-management/create-project?edit=${project._id}`)}>
                                                        Edit Project
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => setDeleteId(project._id)}
                                                    >
                                                        Delete Project
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <CardTitle className="mt-2 line-clamp-1">{project.name}</CardTitle>
                                        <CardDescription className="line-clamp-2 min-h-[40px]">
                                            {project.description || 'No description provided.'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-col gap-3 text-sm text-muted-foreground mb-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                                            </div>
                                        </div>
                                        <Button asChild variant="secondary" className="w-full group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Link href={`/admin/project-management/${project._id}`}>
                                                View Project Tasks
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Standalone Tasks Section */}
                    <div className="pt-10">
                        <Card className="border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-white border-b border-muted/20">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <ClipboardList className="w-5 h-5 text-primary" />
                                        All Recent Tasks
                                    </CardTitle>
                                    <Button asChild variant="outline" size="sm">
                                        <Link href="/admin/project-management/create">
                                            <Plus className="w-4 h-4 mr-1" />
                                            Create Standalone Task
                                        </Link>
                                    </Button>
                                </div>
                                <CardDescription>Tasks across all projects and unassigned tasks.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {tasksLoading ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                                    </div>
                                ) : allTasks.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <ClipboardList className="w-12 h-12 opacity-30 mb-2" />
                                        <p>No tasks found</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="pl-6 w-[30%]">Task Name</TableHead>
                                                    <TableHead>Project</TableHead>
                                                    <TableHead>Assigned To</TableHead>
                                                    <TableHead>Deadline</TableHead>
                                                    <TableHead>Time (Hrs)</TableHead>
                                                    <TableHead>Priority</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="pr-6 text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {allTasks.slice(0, 10).map((task) => {
                                                    const priorityCfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.medium;
                                                    const statusCfg = TASK_STATUS_OPTIONS.find(s => s.value === task.status) || TASK_STATUS_OPTIONS[0];
                                                    const overdue = isOverdue(task.deadline, task.status);
                                                    const empName = (task.assignedTo as any)?.user?.fullName ?? (task.assignedTo as any)?.position ?? '—';

                                                    let projName = 'Standalone';
                                                    if (task.project) {
                                                        if (typeof task.project === 'object' && (task.project as any).name) {
                                                            projName = (task.project as any).name;
                                                        } else if (typeof task.project === 'string' && task.project !== 'none') {
                                                            // Fallback if it wasn't populated but has an ID
                                                            const foundProj = projects.find(p => p._id === task.project);
                                                            if (foundProj) projName = foundProj.name;
                                                        }
                                                    }

                                                    return (
                                                        <TableRow key={task._id}>
                                                            <TableCell className="pl-6 font-medium">
                                                                <div className="max-w-[200px]">
                                                                    <p className="truncate" title={task.title}>{task.title}</p>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Badge variant={projName === 'Standalone' ? 'secondary' : 'outline'} className="text-[10px] font-normal">
                                                                    {projName}
                                                                </Badge>
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
                                                                    onValueChange={(val) => handleTaskStatusChange(task._id, val)}
                                                                >
                                                                    <SelectTrigger className={`w-28 h-7 text-[10px] border-none px-2 ${statusCfg.bg} ${statusCfg.color}`}>
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {TASK_STATUS_OPTIONS.map(opt => (
                                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </TableCell>
                                                            <TableCell className="pr-6 text-right">
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
                                                                            onClick={() => setTaskDeleteId(task._id)}
                                                                        >
                                                                            Delete Task
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
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
                </div>
            </section>

            {/* Task Delete confirmation */}
            <AlertDialog open={!!taskDeleteId} onOpenChange={() => setTaskDeleteId(null)}>
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
                            onClick={handleTaskDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this project? This will NOT delete associated tasks but they will lose their project reference. This action cannot be undone.
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
