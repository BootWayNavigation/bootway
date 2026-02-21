import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/users/[id]
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const user = await User.findById(params.id).select('-password');
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: user });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// PUT /api/users/[id]
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const { fullName, phone, bio, skills, experience, role, department, position } = await req.json();
        const user = await User.findByIdAndUpdate(
            params.id,
            { fullName, phone, bio, skills, experience, role, department, position },
            { new: true, runValidators: true }
        ).select('-password');
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'User updated successfully', data: user });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// DELETE /api/users/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const user = await User.findByIdAndDelete(params.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
