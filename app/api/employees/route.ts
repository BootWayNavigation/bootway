import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Employee } from '@/models/Employee';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/employees
export async function GET(req: NextRequest) {
    try {
        requireAdminHR(req);
        await connectDB();
        const employees = await Employee.find()
            .populate('user', 'fullName email avatar role phone')
            .populate('createdBy', 'fullName')
            .sort({ dateJoined: -1 });
        return NextResponse.json({ success: true, count: employees.length, data: employees });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
