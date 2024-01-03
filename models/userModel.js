const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password:{
        type: String,
        nullable: true
    },
    role:{
        type: String,
        default: 'Customer'
    },
    avatar:{
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
const User = mongoose.model('User',userSchema);
module.exports = User;