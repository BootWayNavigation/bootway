import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';

// GET /api/applications/job/[jobId]
export async function GET(req: NextRequest, context: { params: Promise<{ jobId: string }> }) {
    const params = await context.params;
    try {
        await connectDB();
        const applications = await Application.find({ jobId: params.jobId })
            .populate('candidateId', 'fullName email phone')
            .sort({ appliedAt: -1 });
        return NextResponse.json({ success: true, count: applications.length, data: applications });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
