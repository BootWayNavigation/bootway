import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { fullName, email, password, passwordConfirm, phone, role } = await req.json();

        if (!fullName || !email || !password || !passwordConfirm) {
            return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
        }
        if (password !== passwordConfirm) {
            return NextResponse.json({ success: false, message: 'Passwords do not match' }, { status: 400 });
        }
        if (password.length < 6) {
            return NextResponse.json({ success: false, message: 'Password should be at least 6 characters' }, { status: 400 });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Email already in use' }, { status: 409 });
        }

        const user = await User.create({ fullName, email: email.toLowerCase(), password, phone, role: role || 'candidate' });
        const token = generateToken(user._id.toString(), user.email, user.role);

        return NextResponse.json({
            success: true, message: 'User registered successfully', token,
            user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role }
        }, { status: 201 });
    } catch (err: any) {
        console.error('Registration error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
