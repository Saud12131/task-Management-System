import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    status: { type: Boolean, default: false },
},
    { timestamps: true });

export default mongoose.models.Task || mongoose.model("Task", TaskSchema);
