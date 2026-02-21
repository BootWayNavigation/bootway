import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// PATCH /api/jobs/[id]/toggle
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const job = await Job.findById(params.id);
        if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });

        job.isActive = !job.isActive;
        (job as any).status = job.isActive ? 'active' : 'closed';
        await job.save();

        return NextResponse.json({
            success: true,
            message: `Job ${job.isActive ? 'activated' : 'deactivated'} successfully`,
            data: job
        });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
