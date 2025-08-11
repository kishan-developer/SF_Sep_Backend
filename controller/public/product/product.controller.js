const Product = require("../../../model/Product.model");
const { client } = require('../../../utils/redisClient');
const NodeCache = require("node-cache");
const productCache = new NodeCache({ stdTTL: 86400, checkperiod: 900 }); 
 // TTL (Time to Live) =  1 day = 24 hours = 24 × 60 × 60 = 86400 seconds

const asyncHandler = require("express-async-handler");


// const getAllProducts = asyncHandler(async (req, res) => {
//     const products = await Product.find({})
//         .populate("category")
//         .populate("fabric")
//         .populate({
//             path: "reviews",
//             populate: {
//                 path: "user",
//                 model: "User",
//             },
//         })
//         .exec();
//     return res.success("Products Fetched Successfully.", products);
// });



// const getAllProducts = asyncHandler(async (req, res) => {
//     const cacheKey = "allProducts";

//     // 1️ Check if data exists in cache
//     const cachedProducts = productCache.get(cacheKey);
//     if (cachedProducts) {
//         return res.success("Products fetched from cache.", cachedProducts);
//     }

//     // 2️ If not cached, fetch from DB
//     const products = await Product.find({})
//         .populate("category")
//         .populate("fabric")
//         .populate({
//             path: "reviews",
//             populate: {
//                 path: "user",
//                 model: "User",
//             },
//         })
//         .exec();

//     // 3 Store in cache
//     productCache.set(cacheKey, products);

//     return res.success("Products fetched successfully.", products);
// });



const getAllProducts = asyncHandler(async (req, res) => {
    const cacheKey = "allProducts";

    // 1️ Check if data exists in cache
    const cachedProducts = productCache.get(cacheKey);
    if (cachedProducts) {
        return res.success("Products fetched from cache.", cachedProducts);
    }

    // 2️ Fetch from DB and convert to plain objects
    const products = await Product.find({})
        .populate("category")
        .populate("fabric")
        .populate({
            path: "reviews",
            populate: {
                path: "user",
                model: "User",
            },
        })
        .lean() //  Converts to plain JS objects
        .exec();

    // 3 Store in cache
    productCache.set(cacheKey, products);

    return res.success("Products fetched successfully.", products);
});





const getProductById = asyncHandler(async (req, res) => {
    const _id = req.body?.id || req.params.id;
    
    if (!_id) {
        return res.error("Products Id Are Required", 400);
    }

    const product = await Product.findById(_id)
        .populate("category")
        .populate("fabric")
        .populate({
            path: "reviews",
            populate: {
                path: "user",
                model: "User",
            },
        })
        .lean() //  Converts to plain JS objects
        .exec();

    if (!product) {
        return res.error("Product Not Found", 404);
    }
    return res.success("Product Fetched Successfully", product);
});

const getProductByfabric = async (req, res) => {
    try {
        console.log(req.params);
        const { fabric, id } = req.params;
        const title = fabric.replace(/-/g, " ");
        if (!title) {
            return res
                .status(400)
                .json({ success: false, message: "Fabric title is required" });
        }

        const products = await Product.find().populate("fabric").lean();

        const filteredProducts = products.filter(
            (product) =>
                product.fabric?.title?.toLowerCase() === title.toLowerCase()
        );

        res.json({
            success: true,
            data: filteredProducts,
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
module.exports = { getAllProducts, getProductById, getProductByfabric };
