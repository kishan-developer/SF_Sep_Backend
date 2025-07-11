const express = require("express");
const {
    createOffer,
    updateOffer,
    adminGetOffer,
} = require("../../controller/admin/offer.controller");

const adminOfferRouter = express.Router();
adminOfferRouter.post("/create", createOffer);
adminOfferRouter.put("/update", updateOffer);
adminOfferRouter.get("/", adminGetOffer);

module.exports = adminOfferRouter;
