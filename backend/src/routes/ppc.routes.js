const express = require('express');
const router = express.Router();
const {
  listar, buscarPorId, criar, atualizar, salvarRascunho,
  deletar, adicionarComponente, listarComponentes,
} = require('../controllers/ppc.controller');
const { autenticar } = require('../middleware/auth.middleware');

router.use(autenticar);

router.get('/', listar);
router.get('/:id', buscarPorId);
router.post('/', criar);
router.put('/:id', atualizar);
router.patch('/:id/rascunho', salvarRascunho);
router.delete('/:id', deletar);
router.get('/:id/componentes', listarComponentes);
router.post('/:id/componentes', adicionarComponente);

module.exports = router;
