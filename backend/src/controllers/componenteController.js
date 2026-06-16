const prisma = require('../config/database');

exports.listarComponentes = async (req, res) => {
    try {
        const { ppcId } = req.params;

        const componentes = await prisma.componenteCurricular.findMany({
            where: { ppcId: Number(ppcId) },
            orderBy: [{ periodo: 'asc' }, { nome: 'asc' }]
        });

        res.status(200).json(componentes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar componentes.' });
    }
};

exports.criarComponente = async (req, res) => {
    try {
        const { ppcId } = req.params;
        const {
            codigo, nome,
            creditosPraticos, creditosTeoricos, creditosExtensao,
            horasPraticas, horasTeoricas, horasExtensao,
            tipo, periodo, preRequisitos, correquisitos
        } = req.body;

        const ppcExiste = await prisma.ppc.findUnique({ where: { id: Number(ppcId) } });
        if (!ppcExiste) {
            return res.status(404).json({ error: 'PPC não encontrado.' });
        }

        const novoComponente = await prisma.componenteCurricular.create({
            data: {
                ppcId: Number(ppcId),
                codigo,
                nome,
                creditosPraticos: Number(creditosPraticos),
                creditosTeoricos: Number(creditosTeoricos),
                creditosExtensao: Number(creditosExtensao),
                horasPraticas: Number(horasPraticas),
                horasTeoricas: Number(horasTeoricas),
                horasExtensao: Number(horasExtensao),
                tipo,
                periodo: Number(periodo),
                preRequisitos: preRequisitos || '',
                correquisitos: correquisitos || ''
            }
        });

        res.status(201).json({ success: true, data: novoComponente });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: `O código '${req.body.codigo}' já existe neste PPC.` });
        }
        res.status(500).json({ error: 'Erro ao criar componente.', detalhes: error.message });
    }
};

exports.atualizarComponente = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        const campos = ['creditosPraticos', 'creditosTeoricos', 'creditosExtensao',
                        'horasPraticas', 'horasTeoricas', 'horasExtensao', 'periodo'];
        campos.forEach(c => { if (dados[c] !== undefined) dados[c] = Number(dados[c]); });

        const atualizado = await prisma.componenteCurricular.update({
            where: { id: Number(id) },
            data: dados
        });

        res.status(200).json({ success: true, data: atualizado });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar componente.' });
    }
};

exports.deletarTodosComponentes = async (req, res) => {
    try {
        const { ppcId } = req.params;

        await prisma.componenteCurricular.deleteMany({ where: { ppcId: Number(ppcId) } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar componentes do PPC.' });
    }
};

exports.deletarComponente = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.componenteCurricular.delete({ where: { id: Number(id) } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar componente.' });
    }
};
