const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const User = require('../models/userModel');

// number of salt rounds for bcrypt
const saltRounds = 10;
// get all users
router.route('/').get(async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let start = (page - 1) * perPage;
    let name = req.query.name || '';
    let sort = req.query.sort || 'asc';

    try {
        const users = await User.find({
            name: {
                $regex: name,
                $options: 'i'
            }
        })
            .sort({name: sort})
            .skip(start)
            .limit(perPage);
        const totalUsers = await User.countDocuments();

        res.status(200).json({
            message: "Users retrieved successfully",
            status: "success",
            timestamps: Date.now(),
            page,
            perPage,
            sort,
            totalUsers: totalUsers,
            data: users

        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }

})

// get a user by id
router.route('/:id').get(async (req,res)=>{
    try {
        const user = await User.findOne({_id: req.params.id});
        if (!user) return res.status(404).json({message: 'User not found'});
        res.status(200).json({
            message: "User retrieved successfully",
            status: "success",
            timestamps: Date.now(),
            data: user

        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// create new user
router.route('/').post(async (req,res)=>{
    const {name, email, password, role, avatar} = req.body;
    // hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            avatar
        })
        const user = await User.create(newUser);
        res.status(201).json({
            message: "User created successfully",
            status: "success",
            timestamps: Date.now(),
            data: user
        });
    }catch (err) {
        res.status(400).json({message: err.message});
    }
})

// update a user
router.route('/:id').put(async (req,res)=>{
    const {name, email, password, role, avatar} = req.body;
    let hashedPassword;
    if (password){
         hashedPassword = await bcrypt.hash(password, saltRounds);
    }
    try {
        const user = await User.findOneAndUpdate({
            _id: req.params.id}
            ,{
            name: undefined ? user.get('name') : name,
            email: undefined ? user.get('email') : email,
            password: undefined ? user.get('password') : hashedPassword,
            role: undefined ? user.get('role') : role,
            avatar: undefined ? user.get('avatar') : avatar,
            updatedAt: Date.now()
            },
            {
                new: true
            }
        );
        res.status(200).json({
            message: "User updated successfully",
            status: "success",
            timestamps: Date.now(),
            data: user
        });

    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// delete a user
router.route('/:id').delete(async (req,res)=>{
    try {
        const user = await User.findOneAndDelete({_id: req.params.id});
        res.status(200).json({
            message: "User deleted successfully",
            status: "success",
            timestamps: Date.now(),
            data: user
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})
module.exports = router;