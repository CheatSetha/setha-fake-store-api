const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename:{
        type: String,
        required: [true, 'Filename is required']
    },
    filename:{
        type: String,
        required: [true, 'Original name is required']
    },
    url_image:{
        type: String,
        required: [true, 'Url path is required']
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

const File = mongoose.model('File',fileSchema);
module.exports = File;