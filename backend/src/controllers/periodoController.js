/**
 * Controller de Períodos.
 * Mesmo padrão do siteController: alimenta o datalist do campo "Período"
 * no formulário de componentes curriculares.
 */
const prisma = require('../config/database');

exports.listarPeriodos = async (req, res) => {
    try {
        const periodos = await prisma.periodo.findMany({
            orderBy: { valor: 'asc' },
        });
        res.json({ success: true, data: periodos });
    } catch (error) {
        console.error('Erro ao listar periodos:', error);
        res.status(500).json({ error: 'Erro ao listar periodos.' });
    }
};

exports.criarPeriodo = async (req, res) => {
    try {
        const { valor } = req.body;

        if (!valor || !valor.toString().trim()) {
            return res.status(400).json({ error: 'Valor do período é obrigatório.' });
        }

        const periodo = await prisma.periodo.create({
            data: { valor: valor.toString().trim() },
        });

        res.status(201).json({ success: true, data: periodo });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Esse período já está cadastrado.' });
        }
        console.error('Erro ao criar periodo:', error);
        res.status(500).json({ error: 'Erro ao criar periodo.' });
    }
};
