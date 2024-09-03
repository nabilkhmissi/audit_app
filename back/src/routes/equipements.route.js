const EquipementController = require('../controllers/equipement.controller')
const express = require('express');
const router = express.Router();



router.post('/search', EquipementController.searchEquipements)

module.exports = router