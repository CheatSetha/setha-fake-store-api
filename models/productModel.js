const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    image: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }


})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;