import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    interviewType: { type: String, enum: ['phone', 'video', 'in-person', 'group'], default: 'video' },
    scheduledDate: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    interviewers: [{ type: String }],
    meetingLink: { type: String, default: null },
    location: { type: String, default: null },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'], default: 'scheduled' },
    feedback: { type: String, default: null },
    rating: { type: Number, min: 0, max: 5, default: null },
    notes: { type: String, default: null },
    completedAt: { type: Date, default: null },
}, { timestamps: true });

export const Interview = mongoose.models.Interview || mongoose.model('Interview', interviewSchema);
