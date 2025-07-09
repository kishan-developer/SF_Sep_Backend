const express = require("express");
const {
    createOffer,
    updateOffer,
} = require("../../controller/admin/offer.controller");

const adminOfferRouter = express.Router();
adminOfferRouter.post("/create", createOffer);
adminOfferRouter.put("/update", updateOffer);

module.exports = adminOfferRouter;
