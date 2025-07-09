const express = require("express");
const { isAuthenticated } = require("../../middleware/auth.middleware");
const cartRouter = require("./cart.routes");
const wishlistRouter = require("./wishlist.routes");
const { orderRouter } = require("./order.routes");
const addressRouter = require("./adress.routes");
const reviewRouter = require("./review.routes");
const couponRouter = require("./coupon.routes");
const userRoutes = express.Router();

userRoutes.use("/cart", isAuthenticated, cartRouter);
userRoutes.use("/wishlist", isAuthenticated, wishlistRouter);
userRoutes.use("/orders", isAuthenticated, orderRouter);
userRoutes.use("/address", isAuthenticated, addressRouter);
userRoutes.use("/review", isAuthenticated, reviewRouter);
userRoutes.use("/coupon", couponRouter);
module.exports = userRoutes;
