import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';
import { requireAuth, handleAuthError } from '@/lib/auth-helpers';

// GET /api/applications/candidate/my-applications
export async function GET(req: NextRequest) {
    try {
        const currentUser = requireAuth(req);
        await connectDB();

        // Link anonymous applications by email
        if (currentUser.email) {
            await Application.updateMany(
                { candidateEmail: currentUser.email, candidateId: null },
                { candidateId: currentUser.id }
            );
        }

        const applications = await Application.find({ candidateId: currentUser.id })
            .populate('jobId', 'title department location type')
            .sort({ appliedAt: -1 });

        return NextResponse.json({ success: true, count: applications.length, data: applications });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
