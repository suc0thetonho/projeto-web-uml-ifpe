const express = require('express');
const router = express.Router();
const { cadastrar, definirSenhaInicial, buscarPerfil } = require('../controllers/usuario.controller');
const { autenticar } = require('../middleware/auth.middleware');

router.post('/', cadastrar);
router.post('/:id/senha', definirSenhaInicial);
router.get('/perfil', autenticar, buscarPerfil);

module.exports = router;
