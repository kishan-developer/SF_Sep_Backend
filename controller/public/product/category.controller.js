const Category = require("../../../model/Category.model");

const asyncHandler = require("express-async-handler");
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    return res.success("Category Fetched Successfully.", categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
    const _id = req.body?.id || req.params.id;
    if (!_id) {
        return res.error("Category Id Are Required", 400);
    }
    const category = await Category.findById(_id).populate({
        path: "products",
        populate: {
            path: "fabric",
        },
    });

    if (!category) {
        return res.error("category Not Found", 404);
    }
    return res.success("category Fetched Successfully", category);
});
module.exports = { getAllCategories, getCategoryById };
