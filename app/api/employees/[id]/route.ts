import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Employee } from '@/models/Employee';
import { User } from '@/models/User';
import { requireAdminHR, handleAuthError } from '@/lib/auth-helpers';

// GET /api/employees/[id]
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const employee = await Employee.findById(params.id)
            .populate('user', 'fullName email avatar role phone')
            .populate('createdBy', 'fullName');
        if (!employee) return NextResponse.json({ success: false, message: 'Employee not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: employee });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// PUT /api/employees/[id]
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const body = await req.json();
        const employee = await Employee.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })
            .populate('user', 'fullName email avatar role phone');
        if (!employee) return NextResponse.json({ success: false, message: 'Employee not found' }, { status: 404 });
        return NextResponse.json({ success: true, data: employee });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// DELETE /api/employees/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    try {
        requireAdminHR(req);
        await connectDB();
        const employee = await Employee.findById(params.id);
        if (!employee) return NextResponse.json({ success: false, message: 'Employee not found' }, { status: 404 });

        // Revert user role to candidate
        if (employee.user) {
            await User.findByIdAndUpdate(employee.user, { role: 'candidate' });
        }
        await employee.deleteOne();
        return NextResponse.json({ success: true, message: 'Employee removed' });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
