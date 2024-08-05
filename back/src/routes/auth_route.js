const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers');
const { Image_upload } = require("../utils");

router.post("/login", AuthController.login);
router.post("/signup",Image_upload.single("image"), AuthController.signup);

module.exports = router;