const fs = require("fs");
const path = require("path");

const deleteImage = async (imageUrl) => {
    try {
        // Example: imageUrl = `${process.env.BACKEND_URL}/images/products/filename.jpg`
        const fileName = path.basename(imageUrl); // Extract only the filename
        const filePath = path.join(`/root/uploads/image/products`, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Image deleted: ${fileName}`);
            return { success: true, message: "Image deleted successfully" };
        } else {
            return { success: false, message: "Image not found" };
        }
    } catch (err) {
        console.error("Error deleting image:", err);
        return { success: false, message: "Error deleting image" };
    }
};

module.exports = deleteImage;
