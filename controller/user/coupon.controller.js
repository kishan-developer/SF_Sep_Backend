const Coupon = require("../../model/Coupon.model");

const applyCoupon = async (req, res) => {
    const { couponCode } = req.body;

    // Validation
    if (!couponCode) return res.error("Coupon code is required.", 400);

    try {
        const coupon = await Coupon.findOne({ code: couponCode });

        if (!coupon) return res.error("Coupon code not found.", 404);

        // Check expiration

        if (coupon.isExpired) return res.error("Coupon code is expired.", 400);

        // Check usage limit
        if (coupon.usageCount >= coupon.maxUsageLimit)
            return res.error("Coupon usage limit exceeded.", 400);

        // Update usage count
        coupon.usageCount++;
        await coupon.save();

        // Return discount
        return res.status(200).json(coupon.discount);
    } catch (error) {
        console.error("Error applying coupon code:", error);
        return res.error(
            "Something went wrong while applying coupon code.",
            500
        );
    }
};

module.exports = {
    applyCoupon,
};
