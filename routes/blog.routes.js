const express = require('express');
const {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  getBlogsAdmin,
  updateBlog
} = require('../controller/blog.controller.js');
const {
  isAdmin,
  isAuthenticated
} = require('../middleware/auth.middleware.js');

const blogRouter = express.Router();

blogRouter.post('/', isAuthenticated, isAdmin, createBlog);
blogRouter.put('/:id', isAuthenticated, isAdmin, updateBlog);
blogRouter.delete('/:id', isAuthenticated, isAdmin, deleteBlog);
blogRouter.get('/', isAuthenticated, isAdmin, getBlogsAdmin);

// User Get Blogs
blogRouter.get('/all', getBlogs);
blogRouter.get('/:id', getBlogById);

module.exports = { blogRouter };
