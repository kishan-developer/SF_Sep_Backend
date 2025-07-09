const Offer = require("../../../model/Offer.model");

const getOffer = async (req, res) => {
    try {
        const offer = await Offer.findOne();
        console.log("Offer while fetching Offer ", offer);
        if (
            !offer ||
            !offer.status ||
            offer.isExpired ||
            offer.usageCount >= offer.maxUsageLimit
        ) {
            return res.error("No active offer found.", 404);
        }

        return res.status(200).json(offer);
    } catch (error) {
        console.error("Error fetching offer:", error);
        return res.error("Something went wrong while fetching the offer.", 500);
    }
};

module.exports = {
    getOffer,
};
