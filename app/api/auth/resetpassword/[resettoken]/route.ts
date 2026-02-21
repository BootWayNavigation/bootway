import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateToken } from '@/lib/auth-helpers';

export async function PUT(req: NextRequest, context: { params: Promise<{ resettoken: string }> }) {
    const params = await context.params;
    try {
        await connectDB();
        const resetPasswordToken = crypto.createHash('sha256').update(params.resettoken).digest('hex');
        const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } });
        if (!user) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 400 });

        const { password } = await req.json();
        user.password = password;
        (user as any).resetPasswordToken = undefined;
        (user as any).resetPasswordExpire = undefined;
        await user.save();

        const token = generateToken(user._id.toString(), user.email, user.role);
        return NextResponse.json({ success: true, token, data: user });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
