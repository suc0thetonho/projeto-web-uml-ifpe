const express = require('express');
const router = express.Router();
const { login, esqueceuSenha, verificarToken, definirSenha } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/esqueceu-senha', esqueceuSenha);
router.post('/verificar-token', verificarToken);
router.post('/definir-senha', definirSenha);

module.exports = router;
