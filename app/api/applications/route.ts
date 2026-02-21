import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Application } from '@/models/Application';
import { Job } from '@/models/Job';
import { User } from '@/models/User';
import { requireAdminHR, handleAuthError, verifyToken } from '@/lib/auth-helpers';

// GET /api/applications — admin/hr only
export async function GET(req: NextRequest) {
    try {
        requireAdminHR(req);
        await connectDB();
        const { searchParams } = new URL(req.url);
        const jobId = searchParams.get('jobId');
        const candidateId = searchParams.get('candidateId');
        const status = searchParams.get('status');

        const query: any = {};
        if (jobId) query.jobId = jobId;
        if (candidateId) query.candidateId = candidateId;
        if (status) query.status = status;

        const applications = await Application.find(query)
            .populate('jobId', 'title department')
            .populate('candidateId', 'fullName email')
            .populate('reviewedBy', 'fullName')
            .sort({ appliedAt: -1 });

        return NextResponse.json({ success: true, count: applications.length, data: applications });
    } catch (err: any) {
        return handleAuthError(err);
    }
}

// POST /api/applications — public (apply for a job)
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const currentUser = verifyToken(req); // optional auth

        // Handle multipart/form-data (resume upload) or JSON
        const contentType = req.headers.get('content-type') || '';
        let jobId: string, candidateName: string, candidateEmail: string, candidatePhone: string, coverLetter: string;
        let resumeUrl: string | null = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            jobId = formData.get('jobId') as string;
            candidateName = formData.get('candidateName') as string;
            candidateEmail = formData.get('candidateEmail') as string;
            candidatePhone = formData.get('candidatePhone') as string;
            coverLetter = formData.get('coverLetter') as string;

            const resumeFile = formData.get('resume') as File | null;
            if (resumeFile && resumeFile.size > 0) {
                try {
                    const { v2: cloudinary } = await import('cloudinary');
                    cloudinary.config({
                        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                        api_key: process.env.CLOUDINARY_API_KEY,
                        api_secret: process.env.CLOUDINARY_API_SECRET,
                    });

                    const arrayBuffer = await resumeFile.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    const uploadResult = await new Promise<any>((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: 'bootway/resumes', resource_type: 'auto', public_id: `resume-${Date.now()}` },
                            (error, result) => error ? reject(error) : resolve(result)
                        );
                        stream.end(buffer);
                    });
                    resumeUrl = uploadResult.secure_url;
                } catch (uploadErr: any) {
                    return NextResponse.json({ success: false, message: `Resume upload failed: ${uploadErr.message}` }, { status: 500 });
                }
            }
        } else {
            const body = await req.json();
            jobId = body.jobId;
            candidateName = body.candidateName;
            candidateEmail = body.candidateEmail;
            candidatePhone = body.candidatePhone;
            coverLetter = body.coverLetter;
            resumeUrl = body.resume || null;
        }

        if (!jobId || !candidateName || !candidateEmail) {
            return NextResponse.json({ success: false, message: 'Please provide jobId, candidateName, and candidateEmail' }, { status: 400 });
        }

        const existingApplication = await Application.findOne({ jobId, candidateEmail: candidateEmail.toLowerCase() });
        if (existingApplication) {
            return NextResponse.json({ success: false, message: 'You have already applied for this job' }, { status: 409 });
        }

        const application = await Application.create({
            jobId,
            candidateId: currentUser?.id || null,
            candidateName,
            candidateEmail: candidateEmail.toLowerCase(),
            candidatePhone,
            resume: resumeUrl,
            coverLetter,
            status: 'applied'
        });

        return NextResponse.json({ success: true, message: 'Application submitted successfully', data: application }, { status: 201 });
    } catch (err: any) {
        console.error('Apply error:', err);
        return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }
}
