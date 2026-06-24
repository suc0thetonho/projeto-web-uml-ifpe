const express = require('express');
const router = express.Router();
const campusController = require('../controllers/campusController');

router.get('/', campusController.listarCampi);
router.post('/', campusController.criarCampus);

module.exports = router;
