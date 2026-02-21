import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email } = await req.json();
        const user = await User.findOne({ email: email?.toLowerCase() });
        if (!user) return NextResponse.json({ success: false, message: 'There is no user with that email' }, { status: 404 });

        const resetToken = (user as any).getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        console.log(`Reset Token: ${resetToken}`);
        return NextResponse.json({ success: true, data: 'Email sent', resetToken });
    } catch (err) {
        return NextResponse.json({ success: false, message: 'Email could not be sent' }, { status: 500 });
    }
}
