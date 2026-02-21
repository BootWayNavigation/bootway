import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Job } from '@/models/Job';
import { requireAdminHR, handleAuthError, verifyToken } from '@/lib/auth-helpers';

// GET /api/jobs — public
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const department = searchParams.get('department');
        const type = searchParams.get('type');
        const all = searchParams.get('all'); // for admin to see all jobs including inactive

        let query: any = {};
        if (!all) query.isActive = true;
        if (status) query.status = status;
        if (department) query.department = department;
        if (type) query.type = type;

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}

// POST /api/jobs — admin/hr only
export async function POST(req: NextRequest) {
    try {
        const user = requireAdminHR(req);
        await connectDB();
        const body = await req.json();
        const { title, department, location, type, salary, description, skills, requirements, responsibilities, benefits } = body;

        if (!title || !department || !location || !type || !description || !skills || !requirements || !responsibilities) {
            return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
        }
        if (!Array.isArray(skills) || !Array.isArray(requirements) || !Array.isArray(responsibilities)) {
            return NextResponse.json({ success: false, message: 'Skills, requirements, and responsibilities must be arrays' }, { status: 400 });
        }

        const job = await Job.create({
            title, department, location, type, salary: salary || null,
            description, skills, requirements, responsibilities, benefits: benefits || [],
            status: 'active', isActive: true, postedBy: user.id
        });

        return NextResponse.json({ success: true, message: 'Job posted successfully', data: job }, { status: 201 });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
