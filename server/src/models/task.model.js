import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema(
    {
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true, trim: true, maxlength: 140 },
        description: { type: String, trim: true, default: "" },
        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo",
            index: true
       },
       priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
            index: true
      },
      dueDate: { type: Date, index: true },  
    },
    { timestamps: true }
);

// helpful compound index for owner + status/priority filters
taskSchema.index({ owner: 1, status: 1, priority: 1, dueDate: 1, createdAt: -1 });
export const Task = mongoose.model('Task', taskSchema);