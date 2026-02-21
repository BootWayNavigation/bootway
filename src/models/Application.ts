import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false, default: null },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    candidatePhone: { type: String, default: null },
    resume: { type: String, default: null },
    coverLetter: { type: String, default: null },
    status: {
        type: String,
        enum: ['applied', 'under-review', 'shortlisted', 'rejected', 'interview', 'selected'],
        default: 'applied'
    },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date, default: null },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    notes: { type: String, default: null },
    rating: { type: Number, min: 0, max: 5, default: null },
}, { timestamps: true });

applicationSchema.index({ jobId: 1, candidateEmail: 1 }, { unique: true });

export const Application = mongoose.models.Application || mongoose.model('Application', applicationSchema);
