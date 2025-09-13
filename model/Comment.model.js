import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    comment: { type: String, required: true, trim: true },
    adminReply: { type: String, default: null },  // reply by admin
    isEdited: { type: Boolean, default: false },  // track edits
    status: { type: String, enum: ["pending", "approved"], default: "pending" }
}, { timestamps: true });

// Optional index for faster queries
commentSchema.index({ blog: 1, status: 1 });

export default mongoose.model("Comment", commentSchema);
