import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Task } from '@/models/Task';
import { Employee } from '@/models/Employee';
import { Project } from '@/models/Project';
import { requireAuth, handleAuthError } from '@/lib/auth-helpers';

// GET /api/tasks/my-tasks
export async function GET(req: NextRequest) {
    try {
        const user = requireAuth(req);
        await connectDB();

        // Find the employee record for this user
        const employee = await Employee.findOne({ user: user.id });

        if (!employee) {
            return NextResponse.json({ success: true, count: 0, data: [] });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        const filter: any = { assignedTo: employee._id };
        if (status) filter.status = status;

        const tasks = await Task.find(filter)
            .populate('project')
            .populate('createdBy', 'fullName email')
            .sort({ deadline: 1, createdAt: -1 });

        return NextResponse.json({ success: true, count: tasks.length, data: tasks });
    } catch (err: any) {
        console.error('my-tasks error:', err);
        // Include the actual error message in the response for debugging
        return NextResponse.json({ 
            success: false, 
            message: err.message || 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
        }, { status: 500 });
    }
}
