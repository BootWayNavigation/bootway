import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/jobs/[id]
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await connectDB();
        const job = await Job.findById(params.id);
        if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: job });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// PUT /api/jobs/[id]
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const body = await req.json();
        const job = await Job.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
        if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Job updated successfully', data: job });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// DELETE /api/jobs/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const job = await Job.findByIdAndDelete(params.id);
        if (!job) return NextResponse.json({ success: false, message: 'Job not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Job deleted successfully', data: {} });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
