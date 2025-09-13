import BlogModel from "../model/Blog.model.js";
import imageUploader from "../utils/imageUpload.utils.js";
import sanitizeHtml from "sanitize-html";
import NodeCache from "node-cache";
const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 }); // 5 min TTL

export const createBlog = async (req, res) => {
    try {
        // Step 1 -> Get Required Data From Req.body; 
        const { title, content, coverImage, status, slug } = req.body;

        if (!title || !content || !slug || !coverImage) {
            return res.error('All Field are required', 400);
        }
        // All Option In One Place
        const options = {
            title, content, coverImage, status, slug
        }

        // Santise User content
        options.content = sanitizeHtml(content)
        // create new Blog 
        const blog = await BlogModel.create(options)
        // clear  all blog cache
        cache.flushAll()

        // return success response
        return res.success('Blog Created successfull', blog)
    } catch (error) {
        return res.error('Something Went Wrong While Creating the Post')
    }
}

export const updateBlog = async (req, res) => {
    try {
        // Step 1 -> Get blog ID from params
        const { id } = req.params;

        // Step 2 -> Find the blog by ID
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.error("Blog not found", 404);
        }

        // Step 3 -> Destructure fields from body
        const { title, content, tags, coverImage, status, slug } = req.body;

        // Step 4 -> Update fields only if provided
        if (title) blog.title = title;
        if (slug) blog.slug = slug;
        if (coverImage) blog.coverImage = coverImage;

        if (typeof status === "boolean") blog.status = status;

        // Sanitize and update content if provided
        if (content) {
            blog.content = sanitizeHtml(content);
        }

        // Step 5 -> Save updated blog
        const updatedBlog = await blog.save();
        // Step -6 Invalidate cache
        // cache.del("allBlogs");
        // cache.del('allBlogsAdmin')
        // cache.del(`blog_${updatedBlog._id}`);
        cache.flushAll()
        // Step 7 -> Return success response
        return res.success("Blog updated successfully", updatedBlog);
    } catch (error) {
        console.error(error);
        return res.error("Something went wrong while updating the post", 500);
    }
};


export const deleteBlog = async (req, res) => {
    try {
        // Step 1 -> Get blog ID from params
        const { id } = req.params;

        // Step 2 -> Find the blog by ID
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.error("Blog not found", 404);
        }

        // Step 3 -> Delete the blog
        await blog.deleteOne();
        // Invalidate cache
        cache.flushAll()
        // Step 4 -> Return success response
        return res.success("Blog deleted successfully");
    } catch (error) {
        console.error(error);
        return res.error("Something went wrong while deleting the blog", 500);
    }
};

// Get Blogs 

export const getBlogsAdmin = async (req, res) => {
    try {
        const cacheKey = "allBlogsAdmin";
        const cached = cache.get(cacheKey);
        if (cached) return res.success("Blogs fetched (cache)", cached);

        const blogs = await BlogModel.find()
            .select("title slug coverImage tags createdAt")
            .sort({ createdAt: -1 })
            .lean();

        cache.set(cacheKey, blogs);
        return res.success("Blogs fetched successfully", blogs);
    } catch (error) {
        console.error(error);
        return res.error("Something went wrong while fetching blogs", 500);
    }
};

export const getBlogs = async (req, res) => {
    try {
        const cacheKey = "allBlogs";
        const cached = cache.get(cacheKey);
        if (cached) return res.success("Blogs fetched (cache)", cached);

        const blogs = await BlogModel.find({ status: true })
            .select("title slug coverImage tags createdAt")
            .sort({ createdAt: -1 })
            .lean();

        cache.set(cacheKey, blogs);
        return res.success("Blogs fetched successfully", blogs);
    } catch (error) {
        console.error(error);
        return res.error("Something went wrong while fetching blogs", 500);
    }
};


//  GET Blog by ID
export const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check cache
        const cachedBlog = cache.get(`blog_${id}`);
        if (cachedBlog) {
            return res.success("Blog fetched successfully (cache)", cachedBlog);
        }

        const blog = await BlogModel.findById(id)
            .select("title slug content coverImage tags status createdAt updatedAt")
            .lean();

        if (!blog) {
            return res.error("Blog not found", 404);
        }

        cache.set(`blog_${id}`, blog);

        return res.success("Blog fetched successfully", blog);
    } catch (error) {
        console.error(error);
        return res.error("Something went wrong while fetching the blog", 500);
    }
};


