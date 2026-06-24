const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');

router.get('/', siteController.listarSites);
router.post('/', siteController.criarSite);

module.exports = router;
