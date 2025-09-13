import express from 'express'
import { createBlog, deleteBlog, getBlogById, getBlogs, getBlogsAdmin, updateBlog } from '../controller/blog.controller.js';
import { isAdmin, isAuthenticated } from '../middleware/auth.middleware.js';

export const blogRouter = express.Router();

blogRouter.post('/', isAuthenticated, isAdmin, createBlog);
blogRouter.put('/:id', isAuthenticated, isAdmin, updateBlog);
blogRouter.delete('/:id', isAuthenticated, isAdmin, deleteBlog);
blogRouter.get('/', isAuthenticated, isAdmin, getBlogsAdmin);

// User Get Blogs 
blogRouter.get('/all', getBlogs);
blogRouter.get('/:id', getBlogById);
