/**
 * Controller de Componentes Curriculares (disciplinas de um PPC).
 * Todas as rotas são aninhadas sob /api/ppcs/:ppcId/componentes,
 * ou seja, o ppcId vem de req.params definido no roteador pai.
 */
const prisma = require('../config/database');

// Lista todos os componentes de um PPC, ordenados por período e nome
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

/**
 * Criar um componente curricular vinculado a um PPC.
 * Verifica se o PPC existe antes de inserir.
 * O schema tem @@unique([codigo, ppcId]), então o mesmo código
 * pode existir em PPCs diferentes, mas não no mesmo PPC.
 */
exports.criarComponente = async (req, res) => {
    try {
        const { ppcId } = req.params; // Vem da URL: /api/ppcs/:ppcId/componentes
        const {
            codigo, nome,
            creditosPraticos, creditosTeoricos, creditosExtensao,
            horasPraticas, horasTeoricas, horasExtensao,
            tipo, periodo, preRequisitos, correquisitos
        } = req.body;

        // Verifica se o PPC pai existe antes de criar o componente
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
                periodo,
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

// Atualizar um componente. Converte campos numéricos de string para Number.
exports.atualizarComponente = async (req, res) => {
    try {
        const { id } = req.params;
        const dados = req.body;

        // Converte campos Int do schema que chegam como string
        const campos = ['creditosPraticos', 'creditosTeoricos', 'creditosExtensao',
                        'horasPraticas', 'horasTeoricas', 'horasExtensao'];
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

// deleteMany remove todos os componentes de um PPC de uma vez (usado ao editar/re-salvar)
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
