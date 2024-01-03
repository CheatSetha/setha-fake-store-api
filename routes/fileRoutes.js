const express = require("express");
const multer = require("multer");
const path = require("path");
const FileModel = require("../models/fileModel");
const router = express.Router();
const dotenv = require("dotenv").config();

const imgUrlPath = process.env.IMG_PATH_URL;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Specify the destination directory for storing files
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + Date.now() + ext); // Use the original file extension
    },
    //   change file path to url
});

const upload = multer({ storage: storage });

router.route("/single").post(upload.single("file"), async (req, res) => {
    const imgUrl = imgUrlPath + req.file.filename;
    req.file.path = imgUrl;
    try {

        await FileModel.create({
            filename : req.file.filename,
            originalname : req.file.originalname,
            url_image : imgUrl

        });
        res.status(200).json({ message: "Upload successful", data: req.file });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.route("/multiple").post(upload.array("files", 10), async (req, res) => {
    if (req.files.length > 1) {
        req.files.map((file) => {
            const imgUrl = imgUrlPath + file.filename;
            file.path = imgUrl;
        });
    }
    try {
        res.status(200).json({ message: "Upload successful", data: req.files });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
    if (req.files.length > 10) {
        res.status(500).json({ message: "You can upload only 10 files" });
    }
});

// get file by name
router.route("/images/:name").get(async (req, res) => {
    try {
        const image = await FileModel.findOne({file_name: req.params.name}).orFail("File not found");
        res.status(200).json({message: "File found", data: image});

    } catch (error) {
        res.status(res.status.name).json({message: error.message});
    }
});

// get all files
router.route("/images").get(async (req, res) => {
    try {
        const images = await FileModel.find();
        res.status(200).json({message: "Files found", data: images});

    } catch (error) {
        res.status(res.status.name).json({message: error.message});
    }
});

module.exports = router;
