const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/:id/export/pdf', exportController.downloadPdf);
router.get('/:id/export/odt', exportController.downloadOdt);

module.exports = router;
