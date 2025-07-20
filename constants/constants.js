// Define allowed fields for product updates (strict & safe)
const PRODUCT_ALLOWED_FIELDS = [
    "name",
    "description",
    "price",
    "category",
    "stock",
    "images",
    "fabric",
    "technique",
    "color",
    "weight",
    "assurance",
    "hsnCode",
    "isOfferAplied",
];

const CATEGORY_ALLOWED_FIELDS = ["name", "description", "image"];

module.exports = {
    PRODUCT_ALLOWED_FIELDS,
    CATEGORY_ALLOWED_FIELDS,
};
