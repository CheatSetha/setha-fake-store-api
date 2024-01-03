const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    image:{
        type: String,
        nullable: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }

})
const Category = mongoose.model('Category',categorySchema);
module.exports = Category;