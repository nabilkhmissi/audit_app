const express = require('express');
const router = express.Router();
const { UserController } = require('../controllers');
const { Image_upload } = require('../utils');

router.get('/findAll', UserController.findAll);
router.get('/findAllAuditors', UserController.findAllAuditors);
router.get('/findAllClients', UserController.findAllClients);
router.get('/findById/:id', UserController.findById);
router.patch('/enable/:id', UserController.enableUser);
router.get('/findByEmail', UserController.findByEmail);
router.patch('/updateDetails/:id', UserController.UpdateUserDetails);
router.patch('/changePassword/:id', UserController.changePassword);
router.patch('/updateImage/:id', Image_upload.single("image"), UserController.UpdateUserImage);


module.exports = router;