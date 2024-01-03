const express = require('express');
const router = express.Router();
const Category = require('../models/categoryModel');

router.route('/').get(async (req, res)=>{
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let start = (page - 1) * perPage;
    let categoryName = req.query.name || '';
    let sort = req.query.sort || 'asc';

    try {
        const categories = await Category.find({
            name: {
                $regex: categoryName,
                $options: 'i'
            }
        })
            .sort({name: sort})
            .skip(start)
            .limit(perPage);
        const totalCategories = await Category.countDocuments();

        res.status(200).json({
            message: "Categories retrieved successfully",
            status: "success",
            timestamps: Date.now(),
            page,
            perPage,
            sort,
            totalCategories: totalCategories,
            data: categories

        });
    }catch (err){
        res.status(500).json({message: err.message});
    }
})

router.route('/').post(async (req, res)=>{
    const {name, image} = req.body;

    try{
        const newCategory = new Category({
            name,
            image : undefined ? "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=" : image
        })
        const category = await Category.create(newCategory);
        res.status(201).json({
            message: "Category created successfully",
            status: "success",
            timestamps: Date.now(),
            data: category
        });
    }catch (err){
        res.status(400).json({message: err.message});
    }

})

router.route('/:id').get(async (req, res)=>{
    try{
        const category = await Category.find({_id: req.params.id});
        if (category.length === 0) {
            return res.status(404).json({
                message: "Category not found",
                status: "fail",
                timestamps: Date.now(),
                data: null
            });
        }
        res.status(200).json({
            message: "Category retrieved successfully",
            status: "success",
            timestamps: Date.now(),
            data: category
        });

    }catch (err){
        res.status(400).json({
            message: "Category not found",
            errmsg: err.message});
    }
})

// Update a category
router.route('/:id').put(async (req,res)=>{
    const {name, image} = req.body;

    try{
        const category = await Category.findOneAndUpdate(
            {_id: req.params.id},
            {
                name: undefined ? category.get('name') : name,
                image: undefined ? category.get('image') : image
            },
            {new: true}
        );
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                status: "fail",
                timestamps: Date.now(),
                data: null
            });
        }
        res.status(200).json({
            message: "Category updated successfully",
            status: "success",
            timestamps: Date.now(),
            data: category
        });
    }catch(err){
        res.status(400).json({message: err.message});
    }
})

// Delete a category
router.route('/:id').delete(async (req,res)=>{
    try{
        const category = await Category.findOneAndDelete({_id: req.params.id});
        if (!category) {
            return res.status(404).json({
                message: "Category not found",
                status: "fail",
                timestamps: Date.now(),
                data: null
            });
        }
        res.status(200).json({
            message: "Category deleted successfully",
            status: "success",
            timestamps: Date.now(),
            data: category
        });
    }catch(err){
        res.status(400).json({message: err.message});
    }
})
module.exports = router;