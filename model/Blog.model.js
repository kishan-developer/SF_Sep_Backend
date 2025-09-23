const mongoose = require("mongoose");
const { model, Schema } = mongoose;
const slugify = require('slugify');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    content: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },


    status: { type: Boolean, default: false },
}, {
    timestamps: true
})

blogSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true
        })
    }
    next()
})



const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog

