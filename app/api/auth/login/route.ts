import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth-helpers';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ success: false, message: 'Please provide email and password' }, { status: 400 });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken(user._id.toString(), user.email, user.role);

        return NextResponse.json({
            success: true, message: 'Logged in successfully', token,
            user: { _id: user._id, fullName: user.fullName, email: user.email, role: user.role, avatar: user.avatar }
        });
    } catch (err: any) {
        console.error('Login error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
