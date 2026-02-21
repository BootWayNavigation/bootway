import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Interview } from '@/models/Interview';
import { requireAuth, handleAuthError } from '@/lib/auth-helpers';

// GET /api/interviews/candidate/my-interviews
export async function GET(req: NextRequest) {
    try {
        const currentUser = requireAuth(req);
        await connectDB();

        const interviews = await Interview.find({ candidateId: currentUser.id })
            .populate('jobId', 'title department')
            .sort({ scheduledDate: 1 });

        return NextResponse.json({ success: true, count: interviews.length, data: interviews });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
