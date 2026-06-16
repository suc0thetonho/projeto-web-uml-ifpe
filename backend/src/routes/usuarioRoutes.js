// src/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Definindo os endpoints
router.post('/', usuarioController.criarUsuario);   // POST http://localhost:3000/api/usuarios
router.get('/', usuarioController.listarUsuarios);  // GET  http://localhost:3000/api/usuarios

module.exports = router;