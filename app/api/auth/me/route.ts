import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { requireAuth, handleAuthError } from '@/lib/auth-helpers';

export async function GET(req: NextRequest) {
    try {
        const currentUser = requireAuth(req);
        await connectDB();
        const user = await User.findById(currentUser.id).select('-password');
        if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: user });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
