import { format } from 'date-fns';
import {
    Briefcase,
    MapPin,
    Calendar,
    Building2,
    Clock,
    CheckCircle2,
    Circle,
    Loader2,
    XCircle,
    Trophy
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useMyApplications } from '@/hooks/useApi';
import { Application, Job } from '@/services/apiService';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Timeline steps configuration
const TIMELINE_STEPS = [
    { id: 'applied', label: 'Applied', icon: CheckCircle2 },
    { id: 'under-review', label: 'Under Review', icon: Loader2 },
    { id: 'shortlisted', label: 'Shortlisted', icon: Trophy },
    { id: 'interview', label: 'Interview', icon: Calendar },
    { id: 'selected', label: 'Selected', icon: Briefcase },
];

const getStepStatus = (stepId: string, currentStatus: string) => {
    const statusOrder = ['applied', 'under-review', 'shortlisted', 'interview', 'selected'];

    // Map 'offer' to 'selected' or 'interview' if needed, but for now treating it as visual step skipping or just sticking to user list.
    // Actually, if status is 'offer' (legacy), we should probably map it to 'interview' completed or 'selected' upcoming?
    // Let's assume 'offer' implies everything before it is done.
    // If backend still sends 'offer', we need to handle it. Let's add it to order just in case, but hidden from UI steps?
    // Or just Map 'offer' -> 'interview' (completed) in the visual check?
    // For simplicity, let's keep statusOrder strictly to what's shown in UI, and handle 'offer' as a state between interview and selected.

    const fullStatusOrder = ['applied', 'under-review', 'shortlisted', 'interview', 'offer', 'selected'];
    const currentStatusNormalized = currentStatus === 'rejected' ? 'applied' : currentStatus;

    const currentIndex = fullStatusOrder.indexOf(currentStatusNormalized);
    const stepIndex = fullStatusOrder.indexOf(stepId);

    if (currentStatus === 'rejected') return 'rejected';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
};

const ApplicationTimeline = ({ status }: { status: string }) => {
    return (
        <div className="relative flex justify-between items-center w-full mt-6 mb-2">
            {/* Progress Bar Background */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />

            {/* Active Progress Bar (simplified logic for visual fill) */}
            <div
                className={cn(
                    "absolute top-1/2 left-0 h-1 -z-10 -translate-y-1/2 rounded-full transition-all duration-500",
                    status === 'rejected' ? "bg-destructive/50" : "bg-primary"
                )}
                style={{
                    width: `${Math.min(
                        (TIMELINE_STEPS.findIndex(s => s.id === (status === 'rejected' ? 'applied' : status)) / (TIMELINE_STEPS.length - 1)) * 100,
                        100
                    )}%`
                }}
            />

            {TIMELINE_STEPS.map((step) => {
                const stepStatus = getStepStatus(step.id, status);
                const Icon = step.icon;

                return (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-1">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            stepStatus === 'completed' && "border-primary bg-primary text-primary-foreground",
                            stepStatus === 'current' && "border-primary bg-background text-primary animate-pulse shadow-[0_0_0_4px_rgba(var(--primary),0.2)]",
                            stepStatus === 'upcoming' && "border-muted-foreground/30 text-muted-foreground/30",
                            status === 'rejected' && "border-destructive text-destructive"
                        )}>
                            {stepStatus === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                        </div>
                        <span className={cn(
                            "text-xs font-medium text-center hidden sm:block",
                            stepStatus === 'completed' && "text-primary",
                            stepStatus === 'current' && "text-foreground font-bold",
                            stepStatus === 'upcoming' && "text-muted-foreground",
                            status === 'rejected' && "text-destructive"
                        )}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

const ApplicationCard = ({ application }: { application: Application }) => {
    const job = application.job || (typeof application.jobId === 'object' ? application.jobId as unknown as Job : null);

    if (!job) return null;

    const isRejected = application.status === 'rejected';
    const isSelected = application.status === 'selected';

    return (
        <Card className={cn(
            "hover:shadow-lg transition-all duration-300 border-l-4 overflow-hidden group",
            isSelected ? "border-l-green-500" : "border-l-primary"
        )}>
            <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">{job.department}</span>
                        </div>
                        <CardTitle className={cn(
                            "text-2xl font-bold text-foreground transition-colors",
                            isSelected ? "group-hover:text-green-600" : "group-hover:text-primary"
                        )}>
                            {job.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                {job.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" />
                                <span className="capitalize">{job.type}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge
                            variant={isRejected ? "destructive" : "outline"}
                            className={cn(
                                "px-3 py-1 capitalize text-sm",
                                isSelected && "bg-green-100 text-green-700 border-green-200 hover:bg-green-100",
                                application.status === 'offer' && "bg-primary/10 text-primary border-primary/20",
                            )}
                        >
                            {application.status.replace('-', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Applied {format(new Date(application.appliedAt), 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-6">
                <div className="mt-2 px-2">
                    {isRejected ? (
                        <div className="flex flex-col items-center justify-center py-4 text-destructive bg-destructive/5 rounded-lg border border-destructive/10">
                            <XCircle className="w-8 h-8 mb-2 opacity-80" />
                            <span className="font-semibold">Application Not Selected</span>
                            <span className="text-sm opacity-80">Thank you for your interest. Best of luck!</span>
                        </div>
                    ) : isSelected ? (
                        <div className="flex flex-col items-center justify-center py-6 text-green-700 bg-green-50 rounded-lg border border-green-100">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                <Trophy className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="font-bold text-lg mb-1">Congratulations! You&apos;re Selected!</span>
                            <span className="text-sm opacity-90">We are thrilled to offer you this position. Check your email for next steps.</span>
                        </div>
                    ) : (
                        <ApplicationTimeline status={application.status} />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const ApplicationListSkeleton = () => (
    <div className="space-y-6">
        {[1, 2].map((i) => (
            <Card key={i} className="w-full h-48">
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-8 w-64" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                        <Skeleton className="h-12 w-full mt-8" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function ApplicationList() {
    const { data: applications, isLoading, error } = useMyApplications();

    if (isLoading) {
        return <ApplicationListSkeleton />;
    }

    if (error) {
        return (
            <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="pt-6 text-center text-destructive">
                    <p>Error loading applications. Please try again later.</p>
                </CardContent>
            </Card>
        );
    }

    if (!applications || applications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-b from-muted/30 to-background rounded-xl border border-dashed">
                <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <Briefcase className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Start Your Journey</h3>
                <p className="text-muted-foreground mb-8 text-center max-w-sm">
                    You haven&apos;t applied to any jobs yet. Your next career move is just an application away!
                </p>
                <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link href="/careers">Explore Opportunities</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold tracking-tight">Your Applications</h2>
                <Badge variant="secondary" className="px-3 py-1">
                    {applications.length} Active
                </Badge>
            </div>
            <div className="grid gap-6">
                {applications.map((application) => (
                    <ApplicationCard key={application._id} application={application} />
                ))}
            </div>
        </div>
    );
}
