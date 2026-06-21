const express = require('express');
const router = express.Router();
const periodoController = require('../controllers/periodoController');

router.get('/', periodoController.listarPeriodos);
router.post('/', periodoController.criarPeriodo);

module.exports = router;
