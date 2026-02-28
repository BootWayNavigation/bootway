import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Task } from '@/models/Task';
import { Project } from '@/models/Project';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/tasks - get all tasks
export async function GET(req: NextRequest) {
    try {
        requireAdminHR(req);
        await connectDB();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const search = searchParams.get('search');
        const project = searchParams.get('projectId') || searchParams.get('project');

        const filter: any = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (project) filter.project = project;
        if (search) filter.title = { $regex: search, $options: 'i' };

        const tasks = await Task.find(filter)
            .populate({
                path: 'assignedTo',
                populate: { path: 'user', select: 'fullName email avatar' }
            })
            .populate('project', 'name')
            .populate('createdBy', 'fullName email')
            .sort({ deadline: 1, createdAt: -1 });

        return NextResponse.json({ success: true, count: tasks.length, data: tasks });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// POST /api/tasks - create a task
export async function POST(req: NextRequest) {
    try {
        const tokenUser = requireAdminHR(req);
        await connectDB();

        const body = await req.json();

        // Sanitize suspicious fields to avoid CastErrors
        const sanitizedBody = { ...body };
        if (!sanitizedBody.project || sanitizedBody.project === '' || sanitizedBody.project === 'none') {
            delete sanitizedBody.project;
        }
        if (sanitizedBody.projectId) {
            sanitizedBody.project = sanitizedBody.projectId;
            delete sanitizedBody.projectId;
        }
        if (sanitizedBody.assignedTo === '') delete sanitizedBody.assignedTo;
        if (sanitizedBody.estimatedHours === '' || isNaN(parseFloat(sanitizedBody.estimatedHours))) {
            delete sanitizedBody.estimatedHours;
        }

        const task = await Task.create({ ...sanitizedBody, createdBy: tokenUser.id });

        const populated = await Task.findById(task._id)
            .populate({
                path: 'assignedTo',
                populate: { path: 'user', select: 'fullName email avatar' }
            })
            .populate('project', 'name')
            .populate('createdBy', 'fullName email');

        return NextResponse.json({ success: true, data: populated }, { status: 201 });
    } catch (err: any) {
        console.error('Task API Error (POST):', err);

        // Handle Mongoose Validation/Cast errors specifically
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
