import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Interview } from '@/models/Interview';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/interviews — admin/hr only
export async function GET(req: NextRequest) {
    try {
        requireAdminHR(req);
        await connectDB();
        const { searchParams } = new URL(req.url);
        const query: any = {};
        if (searchParams.get('jobId')) query.jobId = searchParams.get('jobId');
        if (searchParams.get('candidateId')) query.candidateId = searchParams.get('candidateId');
        if (searchParams.get('status')) query.status = searchParams.get('status');

        const interviews = await Interview.find(query)
            .populate('applicationId')
            .populate('jobId', 'title department')
            .populate('candidateId', 'fullName email')
            .populate('scheduledBy', 'fullName')
            .sort({ scheduledDate: 1 });

        return NextResponse.json({ success: true, count: interviews.length, data: interviews });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// POST /api/interviews — admin/hr only
export async function POST(req: NextRequest) {
    try {
        const user = requireAdminHR(req);
        await connectDB();
        const { applicationId, jobId, candidateId, interviewType, scheduledDate, duration, interviewers, meetingLink, location } = await req.json();

        if (!applicationId || !jobId || !scheduledDate) {
            return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
        }

        const interview = await Interview.create({
            applicationId, jobId, candidateId,
            scheduledBy: user.id,
            interviewType: interviewType || 'video',
            scheduledDate,
            duration: duration || 60,
            interviewers: interviewers || [],
            meetingLink, location
        });

        return NextResponse.json({ success: true, message: 'Interview scheduled successfully', data: interview }, { status: 201 });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
