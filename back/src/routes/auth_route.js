const express = require('express');
const router = express.Router();
const { AuthController } = require('../controllers');
const { uploader } = require("../utils");

router.post("/login", AuthController.login);
router.post("/signup",uploader.uploadUserImage.single("image"), AuthController.signup);

module.exports = router;