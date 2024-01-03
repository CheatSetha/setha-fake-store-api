const express = require('express');
const router = express.Router();
const Product = require('../models/productModel');

// Get all products
router.route('/').get(async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let perPage = parseInt(req.query.perPage) || 10;
    let start = (page - 1) * perPage;
    let productName = req.query.title || '';
    let sort = req.query.sort || 'asc';

    try {
        const products = await Product.find({
            title: {
                $regex: productName,
                $options: 'i'
            }
        })
            .populate('category')
            .sort({title: sort})
            .skip(start)
            .limit(perPage);
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            message: "Products retrieved successfully",
            status: "success",
            timestamps: Date.now(),
            page,
            perPage,
            sort,
            totalProducts: totalProducts,
            data: products

        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }

})

// Create a product
router.route('/').post(async (req, res) => {
    const {title, price, description, image, category} = req.body;


    try {
        const newProduct = new Product({
            title,
            price,
            description,
            image,
            category,
        })
        const product = await Product.create(newProduct);
        res.status(201).json({
            message: "Product created successfully",
            status: "success",
            timestamps: Date.now(),
            data: product
        });
    } catch (err) {
        res.status(400).json({message: err.message});
    }
})

// Get a product by id
router.route('/:id').get(async (req, res) => {
    try {
        const product = await Product.find({_id: req.params.id});
        if (product.length === 0) {
            return res.status(404).json({
                message: "Product not found",
                status: "fail",
                timestamps: Date.now(),
                data: null
            });
        }
        res.status(200).json({
            message: "Product retrieved successfully",
            status: "success",
            timestamps: Date.now(),
            data: product
        });
    } catch (err) {
        res.status(400).json({
            message: "Product not found",
            errmsg: err.message
        });
    }
})

// update product
router.route('/:id').put(async (req, res) => {
    const {title, price, description, image, category} = req.body;
    try {
        const product = await Product.findOneAndUpdate({
                _id: req.params.id
            },
            {
                title: undefined ? product.get('title') : title,
                price: undefined ? product.get('price') : price,
                description: undefined ? product.get('description') : description,
                image: undefined ? product.get('image') : image,
                category: undefined ? product.get('category') : category
            })
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                status: "fail",
                timestamps: Date.now(),
                data: null
            });

        }
        res.status(200).json({
            message: "Product updated successfully",
            status: "success",
            timestamps: Date.now(),
            data: product
        });
    } catch (err) {
        res.status(400).json({
            message: "Product not found",
            errmsg: err.message
        });
    }
})

// Delete a product
router.route('/:id').delete(async (req, res)=>{
    try{
        const product = await Product.findOneAndDelete({_id: req.params.id});
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                status: "fail",
                timestamps: Date.now(),
                data: null
            });
        }
        res.status(200).json({
            message: "Product deleted successfully",
            status: "success",
            timestamps: Date.now(),
            data: product
        });
    }catch(err){
        res.status(400).json({
            message: "Product not found",
            errmsg: err.message
        });
    }
})
module.exports = router;