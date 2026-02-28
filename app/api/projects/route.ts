import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
    try {
        const user = requireAdminHR(req);
        await connectDB();
        const body = await req.json();
        const project = await Project.create({
            ...body,
            createdBy: user.id,
        });

        return NextResponse.json({ success: true, data: project }, { status: 201 });
    } catch (error: any) {
        return handleAuthError(error);
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const projects = await Project.find().sort({ createdAt: -1 }).populate('createdBy', 'fullName email');
        return NextResponse.json({ success: true, data: projects });
    } catch (error: any) {
        return handleAuthError(error);
    }
}
