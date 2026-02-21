import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Interview } from '@/models/Interview';
import { requireAuth, requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/interviews/[id]
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAuth(req);
        await connectDB();
        const interview = await Interview.findById(params.id)
            .populate('applicationId').populate('jobId').populate('candidateId').populate('scheduledBy', 'fullName');
        if (!interview) return NextResponse.json({ success: false, message: 'Interview not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: interview });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// PUT /api/interviews/[id]
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const { status, feedback, rating, notes, scheduledDate, interviewers } = await req.json();
        const updateData: any = {};
        if (status) updateData.status = status;
        if (feedback) updateData.feedback = feedback;
        if (rating) updateData.rating = rating;
        if (notes) updateData.notes = notes;
        if (scheduledDate) updateData.scheduledDate = scheduledDate;
        if (interviewers) updateData.interviewers = interviewers;
        if (status === 'completed') updateData.completedAt = new Date();

        const interview = await Interview.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })
            .populate('candidateId').populate('jobId');
        if (!interview) return NextResponse.json({ success: false, message: 'Interview not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Interview updated successfully', data: interview });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// DELETE /api/interviews/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const interview = await Interview.findByIdAndDelete(params.id);
        if (!interview) return NextResponse.json({ success: false, message: 'Interview not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Interview deleted successfully' });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
