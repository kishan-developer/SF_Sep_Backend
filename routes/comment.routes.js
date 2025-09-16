import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByBlog,
    moderateComment,
    adminReply,
    adminDeleteComment,

    getAllCommentsForAdmin,
} from "../controller/comment.controller.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.middleware.js";

export const commentRouter = express.Router();

// ====================
// USER ROUTES
// ====================

// POST http://localhost:5000/api/v1/comments/
// Add a new comment (User) -> status: pending
commentRouter.post("/", isAuthenticated, createComment);

// PUT http://localhost:5000/api/v1/comments/:id
// Update own comment (User) -> resets status to pending
commentRouter.put("/:id", isAuthenticated, updateComment);

// DELETE http://localhost:5000/api/v1/comments/:id
// Delete own comment (User)
commentRouter.delete("/:id", isAuthenticated, deleteComment);

// GET http://localhost:5000/api/v1/comments/blog/:blogId
// Get all approved comments for a blog (User)
commentRouter.get("/blog/:blogId", getCommentsByBlog);



// ====================
// ADMIN ROUTES
// ====================

// GET http://localhost:5000/api/v1/comments/pending/all
// Get all pending and approved  comments (Admin)
commentRouter.get("/all", isAuthenticated, isAdmin, getAllCommentsForAdmin);

// PUT http://localhost:5000/api/v1/comments/moderate/:id
// Approve or reject a comment (Admin)
// Body: { action: "approve" } or { action: "reject" }
commentRouter.put("/moderate/:id", isAuthenticated, isAdmin, moderateComment);

// PUT http://localhost:5000/api/v1/comments/reply/:id
// Add a reply to an approved comment (Admin)
// Body: { reply: "Your reply text" }
commentRouter.put("/reply/:id", isAuthenticated, isAdmin, adminReply);

// DELETE http://localhost:5000/api/v1/comments/admin/:id
// Delete any comment (Admin)
commentRouter.delete("/admin/:id", isAuthenticated, isAdmin, adminDeleteComment);


