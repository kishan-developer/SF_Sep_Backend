const Order = require("../../model/Order.model");
const Address = require("../../model/Adress.model");
const mailSender = require("../../utils/mailSender.utils");
const orderStatusUpdateTemplate = require("../../email/template/orderStatusUpdateTemplate");
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("user")
            .exec();
        res.success("Order Fetched Successfully", orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders." });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            id,
            { deliveryStatus: status },
            { new: true }
        )
            .populate("user")
            .exec();
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        console.log(order.user);
        await mailSender(
            order.user?.email,
            "Your Order Delivery Status Changed",

            orderStatusUpdateTemplate({
                userName: order.user?.firstName,
                orderId: order?.razorpay_order_id,
                newStatus: order.deliveryStatus,
            })
        );
        return res.success("Order Updated Successfully", order);
    } catch (error) {
        res.status(500).json({ message: "Error updating order status." });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user") // Populate the 'user' field
            .populate("items.product") // Populate the 'product' field inside items
            .populate("shippingAddress"); // Populate the 'shippingAddress' field

        if (!order) {
            return res.error("Order not found", 404);
        }

        return res.success("Order Fetched successfully", order); // Return the populated order data
    } catch (error) {
        console.error("Error fetching order:", error);
        return res.error("Error fetching order");
    }
};







const updateDelhiveryReceipt = async (req, res) => {
    try {
        const {
            delhiveryReceipt, // URL
            orderId,
            trackingId,
            parcelWeight,
            deliveryPartner,
        } = req.body;


        if (!orderId || !delhiveryReceipt || !trackingId || !parcelWeight || !deliveryPartner) {
            return res.status(400).json({
                success: false,
                message: "Please provide all data",
            });
        }

        // Find order
        // const order = await Order.findById(orderId);

        const order = await Order.findByIdAndUpdate(
            orderId,
            {
                delhiveryReceipt,
                trackingId,
                parcelWeight,
                deliveryPartner,
            },
            { new: true, runValidators: true }
        );


        // console.log("Found order:", order);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order does not exist",
            });
        }

        // Update order fields
        // order.delhiveryReceipt = delhiveryReceipt;
        // order.trackingId = trackingId;
        // order.parcelWeight = parcelWeight;
        // order.deliveryPartner = deliveryPartner;

        // await order.save();

        return res.status(200).json({
            success: true,
            message: "Delhivery Receipt Uploaded Successfully",
            data: order, // optional: return updated order
        });
    } catch (error) {
        console.error("Error updating Delhivery Receipt:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};




module.exports = {
    getOrders,
    updateOrderStatus,
    getOrderById,
    updateDelhiveryReceipt,
};
