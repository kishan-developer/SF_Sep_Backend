const asyncHandler = require("express-async-handler");
const imageUplaoder = require("../../utils/imageUpload.utils");
const Product = require("../../model/Product.model");
const Category = require("../../model/Category.model");
const sanitizePayload = require("../../utils/sanitizePayload");
const { PRODUCT_ALLOWED_FIELDS } = require("../../constants/constants");

const createProduct = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        stock,
        fabric,
        technique,
        color,
        weight,
        assurance,
        hsnCode,
        reviews,
        images,
    } = req.body;

    console.log(
        name,
        description,
        price,
        category,
        stock,
        fabric,
        technique,
        color,
        weight,
        assurance,
        hsnCode,
        reviews,
        images
    );
    // get product details from Body Check Is Everything  Was There Or Not ?
    if (
        !name ||
        !description ||
        !price ||
        !category ||
        !stock ||
        !fabric ||
        !technique ||
        !color ||
        !weight ||
        !assurance ||
        !hsnCode ||
        !images
    ) {
        return res.error(`All fields are required.`, 400);
    }

    const productPayload = {
        name,
        description,
        price,
        category,
        stock,
        fabric,
        technique,
        color,
        weight,
        assurance,
        hsnCode,
        reviews,
        images,
    };
    // create new product
    const product = await Product.create(productPayload);
    const allProducts = await Product.find({});
    const allCategory = await Category.findOneAndUpdate(
        { name: "all" },
        {
            $push: { products: product._id },
        }
    );
    const updatedCategory = await Category.findByIdAndUpdate(category, {
        $push: { products: product._id },
    });
    return res.success("Product Created Successfully.", allProducts);
});

const updateProduct = asyncHandler(async (req, res) => {
    // get product data
    const _id = req.params?.id || req.body?.id;
    let productPayload = req.body ?? null;
    if (!_id) {
        return res.error("Product Id is required", 400);
    }
    // Check Is Payload Is Not Empty
    if (!productPayload || Object.keys(productPayload).length == 0) {
        return res.error("Please provide fields to update", 400);
    }

    const sanitizedPayload = sanitizePayload(
        productPayload,
        PRODUCT_ALLOWED_FIELDS
    );
    if (Object.keys(sanitizedPayload).length == 0) {
        return res.error("All input values are either invalid or empty.", 404);
    }
    const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        sanitizedPayload,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!updatedProduct) {
        return res.error("Product not found or update failed.", 404);
    }
    const allProducts = await Product.find({})
        .populate("category")
        .populate("fabric")
        .populate({
            path: "reviews",
            populate: {
                path: "user",
                model: "User",
            },
        })
        .exec();
    return res.success("Product Updated Successfully", allProducts);
});

const deleteProduct = asyncHandler(async (req, res) => {
    const _id = req.body?.id || req.params.id;
    if (!_id) {
        return res.error("Products Id Are Required", 400);
    }
    const deletedProduct = await Product.findByIdAndDelete(_id);
    if (!deletedProduct) {
        return res.error("Product Not Found", 404);
    }
    return res.success("Product Deleted Successfully", deletedProduct);
});

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
};
