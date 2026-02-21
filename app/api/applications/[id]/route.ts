import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';
import { Employee } from '@/models/Employee';
import { User } from '@/models/User';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/applications/[id]
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        await connectDB();
        const application = await Application.findById(params.id)
            .populate('jobId')
            .populate('candidateId', 'fullName email phone')
            .populate('reviewedBy', 'fullName');
        if (!application) return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: application });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// PUT /api/applications/[id]
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        const currentUser = requireAdminHR(req);
        await connectDB();
        const { status, notes, rating, reviewedBy } = await req.json();
        const updateData: any = { updatedAt: new Date() };
        if (status) { updateData.status = status; updateData.reviewedAt = new Date(); }
        if (notes) updateData.notes = notes;
        if (rating) updateData.rating = rating;
        if (reviewedBy) updateData.reviewedBy = reviewedBy;

        const application = await Application.findByIdAndUpdate(params.id, updateData, { new: true, runValidators: true })
            .populate('jobId')
            .populate('candidateId');

        if (!application) return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });

        // Auto-create Employee if selected
        if (status === 'selected' && application.candidateId) {
            const existingEmployee = await Employee.findOne({ user: application.candidateId._id });
            if (!existingEmployee) {
                await Employee.create({
                    user: application.candidateId._id,
                    department: application.jobId?.department || 'General',
                    position: application.jobId?.title || 'Employee',
                    createdBy: currentUser.id
                });
                await User.findByIdAndUpdate(application.candidateId._id, { role: 'employee' });
            }
        }

        return NextResponse.json({ success: true, message: 'Application updated successfully', data: application });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// DELETE /api/applications/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const application = await Application.findByIdAndDelete(params.id);
        if (!application) return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Application deleted successfully' });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
