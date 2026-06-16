const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams para acessar :ppcId
const componenteController = require('../controllers/componenteController');

router.get('/', componenteController.listarComponentes);              // GET  /api/ppcs/:ppcId/componentes
router.post('/', componenteController.criarComponente);               // POST /api/ppcs/:ppcId/componentes
router.delete('/', componenteController.deletarTodosComponentes);     // DEL  /api/ppcs/:ppcId/componentes (todos)
router.put('/:id', componenteController.atualizarComponente);         // PUT  /api/ppcs/:ppcId/componentes/:id
router.delete('/:id', componenteController.deletarComponente);        // DEL  /api/ppcs/:ppcId/componentes/:id

module.exports = router;
