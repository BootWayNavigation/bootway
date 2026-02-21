import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/users
export async function GET(req: NextRequest) {
    try {
        requireAdminHR(req);
        await connectDB();
        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');
        const search = searchParams.get('search');
        const query: any = {};
        if (role) query.role = role;
        if (search) query.$or = [
            { fullName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        return NextResponse.json({ success: true, count: users.length, data: users });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// POST /api/users
export async function POST(req: NextRequest) {
    try {
        requireAdminHR(req);
        await connectDB();
        const { fullName, email, password, role, phone } = await req.json();
        if (!fullName || !email || !password || !role) {
            return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
        }
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) return NextResponse.json({ success: false, message: 'User with this email already exists' }, { status: 409 });
        const user = await User.create({ fullName, email: email.toLowerCase(), password, role, phone });
        return NextResponse.json({ success: true, message: 'User created successfully', data: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role } }, { status: 201 });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
