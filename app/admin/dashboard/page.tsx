'use client';

import Link from 'next/link';
import {
  Users,
  Briefcase,
  Calendar,
  CheckCircle,
  UserCheck,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageContainer from '@/components/layout/PageContainer';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/common/StatusBadge';
import { useApplications, useInterviews, useEmployees } from '@/hooks/useApi';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, user, logout } = useAuthContext();
  const router = useRouter();

  // Always call hooks at the top level (Rules of Hooks)
  const { data: applications = [] } = useApplications({});
  const { data: interviews = [] } = useInterviews({ status: 'scheduled', limit: 3 });
  const { data: employees = [] } = useEmployees();

  // Redirect to login if not authenticated or not authorized
  useEffect(() => {
    console.log('Admin Dashboard - Auth state:', {
      isAuthenticated,
      isLoading,
      user: user?.email,
      userRole: user?.role,
      isAdminOrHR: user && (user.role === 'admin' || user.role === 'hr')
    });

    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('Admin Dashboard - Redirecting to login (not authenticated)...');
        router.push('/admin/login');
      } else if (user && user.role !== 'admin' && user.role !== 'hr') {
        console.log('Admin Dashboard - Redirecting to home (unauthorized role)...');
        // Optional: Show a toast or clear auth before redirecting
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

  const handleLogout = () => {
    logout();
    // Force redirect after logout to ensure proper logout
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 100);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Don't render content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Calculate dashboard stats
  const dashboardStats = {
    totalApplications: applications.length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    interviews: interviews.filter(int => int.status === 'scheduled').length,
    selected: applications.filter(app => app.status === 'selected').length,
    activeEmployees: employees.length,
  };

  const recentApplications = applications.slice(0, 5);
  const upcomingInterviews = interviews.filter((i) => i.status === 'scheduled').slice(0, 3);

  return (
    <PageContainer>
      <section className="bg-hero-gradient py-8 md:py-10">
        <div className="container-custom">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              HR Dashboard
            </h1>
            <p className="text-white/80">
              Welcome back, {user?.fullName || 'Admin'}! Here&apos;s an overview of your recruitment pipeline.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-muted/30">
        <div className="container-custom space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StatsCard
              title="Total Applications"
              value={dashboardStats.totalApplications}
              icon={<Briefcase className="w-6 h-6" />}
              variant="primary"
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Shortlisted"
              value={dashboardStats.shortlisted}
              icon={<UserCheck className="w-6 h-6" />}
              variant="info"
            />
            <StatsCard
              title="Interviews"
              value={dashboardStats.interviews}
              icon={<Calendar className="w-6 h-6" />}
              variant="warning"
            />
            <StatsCard
              title="Selected"
              value={dashboardStats.selected}
              icon={<CheckCircle className="w-6 h-6" />}
              variant="success"
            />
            <StatsCard
              title="Active Employees"
              value={dashboardStats.activeEmployees}
              icon={<Users className="w-6 h-6" />}
              variant="default"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Applications</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/applications" className="flex items-center">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {app.candidateName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {app.job?.title || 'Job Title'}
                        </p>
                      </div>
                      <StatusBadge status={app.status as any} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Interviews */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Upcoming Interviews</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/interviews" className="flex items-center">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {upcomingInterviews.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingInterviews.map((interview) => (
                      <div
                        key={interview._id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {(interview.candidateId as any)?.fullName || (interview.applicationId as any)?.candidateName || 'Candidate Name'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(interview.scheduledDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            at {new Date(interview.scheduledDate).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        {interview.meetingLink || (interview.location && interview.location.startsWith('http')) ? (
                          <Button variant="outline" size="sm" asChild>
                            <a href={interview.meetingLink || interview.location} target="_blank" rel="noopener noreferrer">
                              Join
                            </a>
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" disabled>
                            Join
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming interviews
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/admin/jobs" className="flex flex-col items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    <span>Post New Job</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/admin/applications" className="flex flex-col items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Review Applications</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/admin/interviews" className="flex flex-col items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>Schedule Interview</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/admin/employees" className="flex flex-col items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    <span>View Employees</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageContainer>
  );
}
