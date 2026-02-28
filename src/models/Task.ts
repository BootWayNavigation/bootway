import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    deadline: { type: Date, required: true },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'review', 'completed'],
        default: 'todo'
    },
    estimatedHours: { type: Number, default: 0 },
    tags: [{ type: String }],
    attachments: [{ type: String }], // file paths / URLs
    submissionNote: { type: String, trim: true },
    submissionUrl: { type: String, trim: true },
    submissionAttachments: [{ type: String }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

// Avoid model recompilation errors in Next.js/HMR
if (mongoose.models.Task) {
    delete mongoose.models.Task;
}
export const Task = mongoose.model('Task', taskSchema);
