'use client';

import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useMyTasks } from '@/hooks/useApi';
import { format } from 'date-fns';
import { ClipboardList, Calendar, Clock, CheckCircle2, AlertCircle, LayoutGrid } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyTasksPage() {
    const { data: tasks, isLoading, error } = useMyTasks();

    if (isLoading) {
        return (
            <PageContainer>
                <div className="container-custom py-8">
                    <Skeleton className="h-10 w-48 mb-6" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
                    </div>
                </div>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <div className="container-custom py-8">
                    <Card className="border-destructive/50 bg-destructive/5">
                        <CardContent className="pt-6 text-center text-destructive">
                            <p>Error loading your tasks. Please try again later.</p>
                        </CardContent>
                    </Card>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="container-custom py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <ClipboardList className="w-8 h-8 text-primary" />
                        My Assigned Tasks
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and submit work for your assigned onboarding tasks.
                    </p>
                </div>

                {!tasks || tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 dark:bg-muted/10 rounded-xl border border-dashed">
                        <CheckCircle2 className="w-12 h-12 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-bold mb-2">No Tasks Assigned</h3>
                        <p className="text-muted-foreground text-center">
                            You currently have no tasks assigned to you.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => (
                            <Card key={task._id} className="hover:shadow-md transition-shadow flex flex-col h-full">
                                <CardHeader className="pb-3 border-b bg-muted/20">
                                    <div className="flex justify-between items-start gap-4 mb-2">
                                        <CardTitle className="text-lg line-clamp-2">
                                            {task.title}
                                        </CardTitle>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant={
                                            task.priority === 'urgent' ? 'destructive' :
                                                task.priority === 'high' ? 'default' :
                                                    task.priority === 'low' ? 'outline' : 'secondary'
                                        } className="capitalize text-xs">
                                            {task.priority} Priority
                                        </Badge>
                                        <Badge variant="outline" className={`capitalize text-xs ${task.status === 'completed' ? 'border-green-500 text-green-700 bg-green-50' :
                                            task.status === 'review' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                                                task.status === 'in-progress' ? 'border-amber-500 text-amber-700 bg-amber-50' : ''
                                            }`}>
                                            {task.status === 'review' ? 'Reviewing' : task.status.replace('-', ' ')}
                                        </Badge>
                                        {(task.project as any)?.name && (
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px]">
                                                Proj: {(task.project as any).name}
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 flex-1 flex flex-col">
                                    {(task.project as any)?.description && (
                                        <div className="mb-3 p-2 bg-primary/5 rounded border border-primary/10">
                                            <p className="text-[10px] font-bold text-primary uppercase mb-1 flex items-center gap-1">
                                                <LayoutGrid className="w-3 h-3" />
                                                Project Detail
                                            </p>
                                            <p className="text-[11px] text-muted-foreground line-clamp-2 italic">
                                                {(task.project as any).description}
                                            </p>
                                        </div>
                                    )}
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                                        {task.description || 'No description provided.'}
                                    </p>

                                    <div className="space-y-2 text-sm text-muted-foreground mb-6">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            <span>Deadline: <strong className="text-foreground">{format(new Date(task.deadline), 'MMM d, yyyy')}</strong></span>
                                        </div>
                                        {task.estimatedHours && (
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                <span>Est. Time: {task.estimatedHours} hours</span>
                                            </div>
                                        )}
                                    </div>

                                    <Button asChild className="w-full mt-auto" variant={task.status === 'completed' ? 'outline' : 'default'}>
                                        <Link href={`/my-tasks/${task._id}`}>
                                            {task.status === 'completed' ? 'View Details' : 'View & Submit'}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
