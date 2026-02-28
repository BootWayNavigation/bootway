import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Task } from '@/models/Task';
import { Employee } from '@/models/Employee';
import { Project } from '@/models/Project';
import { requireAdminHR, requireAuth, handleAuthError } from '@/lib/auth-helpers';

// GET /api/tasks/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = requireAuth(req);
        await connectDB();

        const { id } = await params;
        const task = await Task.findById(id)
            .populate({
                path: 'assignedTo',
                populate: { path: 'user', select: 'fullName email avatar' }
            })
            .populate('project')
            .populate('createdBy', 'fullName email');

        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        // Auth check: Must be Admin/HR OR the assigned Employee
        const isPrivileged = ['admin', 'hr', 'superadmin'].includes(user.role);

        if (!isPrivileged) {
            // Check if it's the assigned employee
            const employee = await Employee.findOne({ user: user.id });
            if (!employee || task.assignedTo._id.toString() !== employee._id.toString()) {
                return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
            }
        }

        return NextResponse.json({ success: true, data: task });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// PUT /api/tasks/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        requireAdminHR(req);
        await connectDB();

        const body = await req.json();

        // Sanitize the body to prevent Mongoose CastErrors for empty/invalid ObjectIds
        const sanitizedBody: any = { ...body };
        if (sanitizedBody.project === '' || sanitizedBody.project === 'none') {
            sanitizedBody.project = null;
        }
        if (sanitizedBody.projectId === '' || sanitizedBody.projectId === 'none') {
            sanitizedBody.project = null; // Explicitly null it out to erase the project linking
            delete sanitizedBody.projectId;
        }
        if (sanitizedBody.assignedTo === '') delete sanitizedBody.assignedTo;
        if (sanitizedBody.estimatedHours === '' || isNaN(parseFloat(sanitizedBody.estimatedHours))) {
            delete sanitizedBody.estimatedHours;
        }

        // Remove empty strings for enum fields to allow DB defaults or avoid validation errors
        if (sanitizedBody.status === '') delete sanitizedBody.status;
        if (sanitizedBody.priority === '') delete sanitizedBody.priority;

        const { id } = await params;
        const task = await Task.findByIdAndUpdate(id, sanitizedBody, { new: true, runValidators: true })
            .populate({
                path: 'assignedTo',
                populate: { path: 'user', select: 'fullName email avatar' }
            })
            .populate('project')
            .populate('createdBy', 'fullName email');

        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: task });
    } catch (err: any) {
        console.error("PUT Task Error:", err);

        if (err.name === 'ValidationError' || err.name === 'CastError') {
            return NextResponse.json({
                success: false,
                message: err.message,
                details: err.errors
            }, { status: 400 });
        }

        return handleAuthError(err);
    }
}

// DELETE /api/tasks/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        requireAdminHR(req);
        await connectDB();

        const { id } = await params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
