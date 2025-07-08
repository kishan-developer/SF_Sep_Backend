const express = require("express");
const adminRouter = express.Router();
const productRoutes = require("../../routes/admin/product.routes");
const categoryRoutes = require("../../routes/admin/category.routes");
const {
    isAuthenticated,
    isAdmin,
} = require("../../middleware/auth.middleware");

const userRouter = require("./user.routes");
const { getOverview } = require("../../controller/admin/overview.controller");
const orderRouter = require("./order.routes");
const fabricRouter = require("./fabric.routes");

// Not Want  ot inlcude Fabric ->
adminRouter.use("/fabrics", fabricRouter);
// Private Routes For Admin
adminRouter.use(isAuthenticated, isAdmin);
adminRouter.use("/product", productRoutes);
adminRouter.use("/category", categoryRoutes);
adminRouter.use("/user", userRouter);
adminRouter.use("/orders", orderRouter);
adminRouter.get("/overview", getOverview);

module.exports = adminRouter;
