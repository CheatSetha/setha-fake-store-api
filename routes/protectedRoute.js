const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMidlleware');

// protected route
router.route('/').get(verifyToken, (req, res)=>{
    res.status(200).json({
        message: "Protected route accessed successfully",
        status: "success",
        timestamps: Date.now(),
    });
})

module.exports = router;