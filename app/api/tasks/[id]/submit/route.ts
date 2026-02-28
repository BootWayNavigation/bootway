import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Task } from '@/models/Task';
import { Employee } from '@/models/Employee';
import { requireAuth, handleAuthError } from '@/lib/auth-helpers';

// PUT /api/tasks/[id]/submit
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = requireAuth(req);
        await connectDB();

        const employee = await Employee.findOne({ user: user.id });
        if (!employee) {
            return NextResponse.json({ success: false, message: 'Employee record not found' }, { status: 403 });
        }

        const { id } = await params;
        const task = await Task.findOne({ _id: id, assignedTo: employee._id });
        if (!task) {
            return NextResponse.json({ success: false, message: 'Task not found or not assigned to you' }, { status: 404 });
        }

        const contentType = req.headers.get('content-type') || '';
        let status, submissionNote, submissionUrl;
        const submissionAttachments: string[] = [];

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            status = formData.get('status') as string;
            submissionNote = formData.get('submissionNote') as string;
            submissionUrl = formData.get('submissionUrl') as string;

            const files = formData.getAll('submissionFiles') as File[];
            if (files && files.length > 0) {
                const { v2: cloudinary } = await import('cloudinary');
                cloudinary.config({
                    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                    api_key: process.env.CLOUDINARY_API_KEY,
                    api_secret: process.env.CLOUDINARY_API_SECRET,
                });

                for (const file of files) {
                    if (file.size > 0) {
                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = Buffer.from(arrayBuffer);

                        const uploadResult = await new Promise<any>((resolve, reject) => {
                            const stream = cloudinary.uploader.upload_stream(
                                { folder: 'bootway/tasks', resource_type: 'auto', public_id: `task-${id}-${Date.now()}` },
                                (error, result) => error ? reject(error) : resolve(result)
                            );
                            stream.end(buffer);
                        });
                        submissionAttachments.push(uploadResult.secure_url);
                    }
                }
            }
        } else {
            const body = await req.json();
            status = body.status;
            submissionNote = body.submissionNote;
            submissionUrl = body.submissionUrl;
        }

        // Candidates can only update specific fields
        if (status) task.status = status;
        if (submissionNote !== undefined && submissionNote !== null) task.submissionNote = submissionNote;
        if (submissionUrl !== undefined && submissionUrl !== null) task.submissionUrl = submissionUrl;

        if (submissionAttachments.length > 0) {
            task.submissionAttachments = [...(task.submissionAttachments || []), ...submissionAttachments];
        }

        await task.save();

        return NextResponse.json({ success: true, data: task });
    } catch (err: any) {
        return handleAuthError(err);
    }
}
