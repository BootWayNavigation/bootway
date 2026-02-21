'use client';

import PageContainer from '@/components/layout/PageContainer';
import ApplicationList from '@/components/candidate/ApplicationList';

export default function ApplicationsPage() {
    return (
        <PageContainer>
            <div className="container-custom py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Applications</h1>
                    <p className="text-muted-foreground">
                        Track the status of your job applications.
                    </p>
                </div>

                <ApplicationList />
            </div>
        </PageContainer>
    );
}
