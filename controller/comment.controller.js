const CommentModel = require("../model/Comment.model.js");

// ====================
// USER CONTROLLERS
// ====================

// -----------------------
// CREATE COMMENT (User)
// -----------------------
const createComment = async (req, res) => {
    try {
        // Step 1: Extract blogId and comment from request body
        const { blogId, comment } = req.body;
        const userId = req.user?._id;

        // Step 2: Validate required fields
        if (!blogId || !comment)
            return res.error("Blog ID and comment required", 400);

        // Step 3: Create new comment in DB with status "pending"
        const newComment = await CommentModel.create({
            blog: blogId,
            author: userId,
            comment: comment.trim(),
            status: "pending" // Admin must approve before visible
        });

        // Step 4: Return success response
        return res.success("Comment submitted for approval", newComment);

    } catch (error) {
        console.error(error);
        return res.error("Failed to create comment", 500);
    }
};

// -----------------------
// UPDATE COMMENT (User)
// -----------------------
const updateComment = async (req, res) => {
    try {
        // Step 1: Get comment ID from params and new text from body
        const { id } = req.params;
        const { comment } = req.body;
        const userId = req.user?._id;

        // Step 2: Find comment in DB
        const existing = await CommentModel.findById(id);
        if (!existing) return res.error("Comment not found", 404);

        // Step 3: Check if current user is the author
        if (existing.author.toString() !== userId.toString())
            return res.error("Not authorized", 403);

        // Step 4: Update comment text, mark as edited, reset status to pending
        existing.comment = comment.trim();
        existing.isEdited = true;
        existing.status = "pending"; // Requires re-approval
        await existing.save();

        // Step 5: Return updated comment
        return res.success("Comment updated and resubmitted for approval", existing);

    } catch (error) {
        console.error(error);
        return res.error("Failed to update comment", 500);
    }
};

// -----------------------
// DELETE COMMENT (User)
// -----------------------
const deleteComment = async (req, res) => {
    try {
        // Step 1: Get comment ID from params
        const { id } = req.params;
        const userId = req.user?._id;

        // Step 2: Find comment
        const comment = await CommentModel.findById(id);
        if (!comment) return res.error("Comment not found", 404);

        // Step 3: Ensure current user is author
        if (comment.author.toString() !== userId.toString())
            return res.error("Not authorized", 403);

        // Step 4: Delete comment
        await comment.deleteOne();

        // Step 5: Return success
        return res.success("Comment deleted successfully");

    } catch (error) {
        console.error(error);
        return res.error("Failed to delete comment", 500);
    }
};

// -----------------------
// GET APPROVED COMMENTS FOR BLOG (User)
// -----------------------
const getCommentsByBlog = async (req, res) => {
    try {
        // Step 1: Get blog ID from params
        const { blogId } = req.params;

        // Step 2: Fetch only approved comments for this blog
        const comments = await CommentModel.find({ blog: blogId, status: "approved" })
            .populate("author", "firstName lastName") // Get author's name
            .sort({ createdAt: -1 })   // Latest first
            .lean();                    // Plain JS object

        // Step 3: Return comments
        return res.success("Comments fetched", comments);

    } catch (error) {
        console.error(error);
        return res.error("Failed to fetch comments", 500);
    }
};

// ====================
// ADMIN CONTROLLERS
// ====================

// -----------------------
// APPROVE OR REJECT COMMENT
// -----------------------
const moderateComment = async (req, res) => {
    try {
        // Step 1: Get comment ID and action from request
        const { id } = req.params;
        const { action } = req.body; // 'approve' or 'reject'

        // Step 2: Find comment in DB
        const comment = await CommentModel.findById(id);
        if (!comment) return res.error("Comment not found", 404);

        // Step 3: Perform action
        if (action === "approve") {
            comment.status = "approved"; // Make visible
            await comment.save();
            return res.success("Comment approved successfully", comment);

        } else if (action === "reject") {
            await comment.deleteOne(); // Remove comment
            return res.success("Comment rejected and deleted successfully");

        } else {
            return res.error("Invalid action. Use 'approve' or 'reject'", 400);
        }

    } catch (error) {
        console.error(error);
        return res.error("Failed to moderate comment", 500);
    }
};

// -----------------------
// ADMIN REPLY TO COMMENT
// -----------------------
const adminReply = async (req, res) => {
    try {
        // Step 1: Get comment ID and reply text
        const { id } = req.params;
        const { reply } = req.body;

        // Step 2: Find comment
        const comment = await CommentModel.findById(id);
        if (!comment) return res.error("Comment not found", 404);

        // Step 3: Ensure comment is approved
        if (comment.status !== "approved")
            return res.error("Only approved comments can be replied to", 400);

        // Step 4: Add admin reply
        comment.adminReply = reply.trim();

        await comment.save();

        return res.success("Admin reply added successfully", comment);

    } catch (error) {
        console.error(error);
        return res.error("Failed to add admin reply", 500);
    }
};

// -----------------------
// DELETE COMMENT (Admin)
// -----------------------
const adminDeleteComment = async (req, res) => {
    try {
        // Step 1: Get comment ID
        const { id } = req.params;

        // Step 2: Find and delete comment
        const comment = await CommentModel.findById(id);
        if (!comment) return res.error("Comment not found", 404);

        await comment.deleteOne();

        return res.success("Comment deleted successfully by admin");

    } catch (error) {
        console.error(error);
        return res.error("Failed to delete comment", 500);
    }
};

// -----------------------
// GET ALL  COMMENTS (Admin)
// -----------------------
// GET /api/v1/comments/admin/all
const getAllCommentsForAdmin = async (req, res) => {
    try {
        const comments = await CommentModel.find()
            .populate("author", "firstName lastName")
            .sort({ createdAt: -1 })
            .lean();

        // Split comments by status
        const pending = comments.filter(c => c.status === "pending");
        const approved = comments.filter(c => c.status === "approved");

        return res.success("All comments fetched", { pending, approved });
    } catch (error) {
        console.error(error);
        return res.error("Failed to fetch comments", 500);
    }
};


module.exports = {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByBlog,
    moderateComment,
    adminReply,
    adminDeleteComment,
    getAllCommentsForAdmin
}

