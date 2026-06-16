// src/controllers/ppcController.js
const prisma = require('../config/database');

// 1. Criar um novo PPC (RF13 / RF14 / RF15)
exports.criarPpc = async (req, res) => {
    try {
        const {
            usuarioId,
            // ETAPA 1: Dados do Campus
            campusNome, campusCidade, campusCnpj, campusCep, campusBairro,
            campusRua, campusNumero, campusTelefoneFax, campusEmail, campusAtoLegal, campusSite,
            // ETAPA 2: Informações Acadêmicas
            cursoTipo, cursoNome, cursoEixoTecnologico, cursoModalidade, cursoOferta,
            cursoTitulacao, cursoEstagio, cursoSemanasLetivas, cursoAtivComplem,
            cursoIntegMinima, cursoIntegMaxima, cursoFormasAcesso, cursoPreRequisitos,
            // ETAPA 3: Oferta e Indicadores
            ofertaRegime, ofertaTurnos, ofertaNumTurmas, ofertaVagasTurma,
            ofertaVagasTurno, ofertaVagasSemestre, ofertaDuracao,
            indicadorCC, indicadorCPC, indicadorEnade, indicadorIGC,
            cursoSituacao, cursoStatus
        } = req.body;

        // Validação básica do vínculo com o Coordenador/Usuário
        if (!usuarioId) {
            return res.status(400).json({ error: "O ID do usuário coordenador é obrigatório." });
        }

        const novoPpc = await prisma.ppc.create({
            data: {
                usuarioId: Number(usuarioId),
                campusNome, campusCidade, campusCnpj, campusCep, campusBairro,
                campusRua, campusNumero, campusTelefoneFax, campusEmail, campusAtoLegal, campusSite,
                cursoTipo, cursoNome, cursoEixoTecnologico, cursoModalidade, cursoOferta,
                cursoTitulacao, cursoEstagio,
                cursoSemanasLetivas: Number(cursoSemanasLetivas),
                cursoAtivComplem: Number(cursoAtivComplem),
                cursoIntegMinima: Number(cursoIntegMinima),
                cursoIntegMaxima: Number(cursoIntegMaxima),
                cursoFormasAcesso, cursoPreRequisitos,
                ofertaRegime, ofertaTurnos,
                ofertaNumTurmas: Number(ofertaNumTurmas),
                ofertaVagasTurma: Number(ofertaVagasTurma),
                ofertaVagasTurno: Number(ofertaVagasTurno),
                ofertaVagasSemestre: Number(ofertaVagasSemestre),
                ofertaDuracao: Number(ofertaDuracao),
                indicadorCC, indicadorCPC, indicadorEnade, indicadorIGC,
                cursoSituacao, cursoStatus
            }
        });

        res.status(201).json({ success: true, data: novoPpc });
    } catch (error) {
        res.status(500).json({ error: "Erro interno ao criar o PPC.", detalhes: error.message });
    }
};

// 2. Listar todos os PPCs (Com paginação simples ou busca por nome - RF26)
exports.listarPpcs = async (req, res) => {
    try {
        const { nome } = req.query; // Para o filtro de busca RF26

        const ppcs = await prisma.ppc.findMany({
            where: nome ? {
                cursoNome: {
                    contains: nome,
                    mode: 'insensitive' // Busca sem diferenciar maiúsculas/minúsculas
                }
            } : {},
            include: {
                usuario: { // Traz os dados resumidos do coordenador criador
                    select: { nome: true, email: true }
                }
            }
        });

        res.status(200).json(ppcs);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar a lista de PPCs." });
    }
};

// 3. Buscar um PPC específico com toda a sua matriz curricular (Componentes)
exports.buscarPpcPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const ppc = await prisma.ppc.findUnique({
            where: { id: Number(id) },
            include: {
                usuario: { select: { nome: true, email: true } },
                componentes: true // Já traz todas as disciplinas vinculadas automaticamente!
            }
        });

        if (!ppc) {
            return res.status(404).json({ error: "Projeto Pedagógico de Curso (PPC) não encontrado." });
        }

        res.status(200).json(ppc);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar o PPC especificado." });
    }
};

// 4. Atualizar os dados de um PPC (RF32 - Mudar status ou corrigir dados)
exports.atualizarPpc = async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        // Converte campos numéricos caso venham no body de atualização
        if (dadosAtualizados.cursoSemanasLetivas) dadosAtualizados.cursoSemanasLetivas = Number(dadosAtualizados.cursoSemanasLetivas);
        if (dadosAtualizados.cursoAtivComplem) dadosAtualizados.cursoAtivComplem = Number(dadosAtualizados.cursoAtivComplem);
        if (dadosAtualizados.ofertaNumTurmas) dadosAtualizados.ofertaNumTurmas = Number(dadosAtualizados.ofertaNumTurmas);

        const ppcAtualizado = await prisma.ppc.update({
            where: { id: Number(id) },
            data: dadosAtualizados
        });

        res.status(200).json({ success: true, data: ppcAtualizado });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar os dados do PPC." });
    }
};

// 5. Deletar um PPC (Irá deletar os componentes filhos em cascata conforme configurado no Schema)
exports.deletarPpc = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.ppc.delete({
            where: { id: Number(id) }
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro ao remover o PPC." });
    }
};