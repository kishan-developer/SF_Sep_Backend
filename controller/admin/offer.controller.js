const Offer = require("../../model/Offer.model");

const createOffer = async (req, res) => {
    // Get Offer Body Data ->
    const { discount, maxAge, maxUsageLimit, status = false } = req.body;
    if (!discount || !maxAge || !maxUsageLimit)
        return res.error("please provide all required field");
    try {
        const existingOffer = await Offer.findOne();

        if (existingOffer)
            return res.error(
                "An offer already exists. Please update the existing one.",
                400
            );
        if (maxUsageLimit === 0) {
            maxUsageLimit = 1;
        }
        const offer = await Offer.create({
            discount,
            maxAge,
            maxUsageLimit,
            status,
        });
        return res.status(201).json(offer.discount);
    } catch (error) {
        console.log("error while creating offer ->", error);
        return res.error("Something went wrong");
    }
};

const updateOffer = async (req, res) => {
    const updateData = req.body;

    try {
        const existingOffer = await Offer.findOne();

        if (!existingOffer) return res.error("No offer found to update.", 404);

        const updatedOffer = await Offer.findByIdAndUpdate(
            existingOffer._id,
            updateData,
            { new: true }
        );

        return res.success("Offer updated successfully.", updatedOffer);
    } catch (error) {
        console.error("Error updating offer:", error);
        return res.error("Something went wrong while updating the offer.", 500);
    }
};

module.exports = {
    createOffer,
    updateOffer,
};
