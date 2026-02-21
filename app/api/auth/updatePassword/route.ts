import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAuth, handleAuthError } from '@/lib/auth-helpers';

export async function PUT(req: NextRequest) {
    try {
        const currentUser = requireAuth(req);
        await connectDB();
        const { currentPassword, newPassword, confirmPassword } = await req.json();

        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
        }
        if (newPassword !== confirmPassword) {
            return NextResponse.json({ success: false, message: 'New passwords do not match' }, { status: 400 });
        }

        const user = await User.findById(currentUser.id);
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 401 });

        user.password = newPassword;
        await user.save();
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
