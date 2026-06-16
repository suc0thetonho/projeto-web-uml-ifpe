// src/routes/ppcRoutes.js
const express = require('express');
const router = express.Router();
const ppcController = require('../controllers/ppcController');

// Mapeamento das URLs da API para gerenciamento de PPCs
router.post('/', ppcController.criarPpc);         // POST http://localhost:3000/api/ppcs
router.get('/', ppcController.listarPpcs);        // GET  http://localhost:3000/api/ppcs (aceita ?nome=...)
router.get('/:id', ppcController.buscarPpcPorId); // GET  http://localhost:3000/api/ppcs/1
router.put('/:id', ppcController.atualizarPpc);   // PUT  http://localhost:3000/api/ppcs/1
router.delete('/:id', ppcController.deletarPpc);  // DEL  http://localhost:3000/api/ppcs/1

module.exports = router;