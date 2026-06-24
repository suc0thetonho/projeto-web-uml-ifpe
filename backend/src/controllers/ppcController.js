/**
 * Controller de PPCs (Projetos Pedagógicos de Curso).
 * Implementa o CRUD completo: Criar, Listar, Buscar por ID, Atualizar e Deletar.
 * Cada PPC contém dados de 3 etapas: Campus, Curso e Oferta/Indicadores.
 */
const prisma = require('../config/database');

/**
 * Criar um novo PPC.
 * Recebe todos os campos das 3 etapas em uma única requisição.
 * Campos numéricos são convertidos com Number() pois o frontend
 * envia tudo como string via JSON.
 */
exports.criarPpc = async (req, res) => {
    try {
        // Desestruturação de todos os campos organizados por etapa
        const {
            usuarioId,
            status,
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
                cursoSituacao, cursoStatus,
                status
            }
        });

        res.status(201).json({ success: true, data: novoPpc });
    } catch (error) {
        res.status(500).json({ error: "Erro interno ao criar o PPC.", detalhes: error.message });
    }
};

/**
 * Listar todos os PPCs, com busca opcional por nome do curso.
 * req.query.nome vem da URL: GET /api/ppcs?nome=informatica
 * "contains" + "insensitive" faz busca parcial case-insensitive no PostgreSQL.
 * "include" traz dados de tabelas relacionadas (JOIN automático do Prisma).
 */
exports.listarPpcs = async (req, res) => {
    try {
        const { nome } = req.query;

        const ppcs = await prisma.ppc.findMany({
            where: nome ? {
                cursoNome: {
                    contains: nome,        // Busca parcial: "info" encontra "Informática"
                    mode: 'insensitive'    // Ignora maiúsculas/minúsculas
                }
            } : {},  // Se não há filtro, retorna todos
            include: {
                usuario: {
                    select: { nome: true, email: true } // Traz só nome e email do coordenador
                }
            }
        });

        res.status(200).json(ppcs);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar a lista de PPCs." });
    }
};

/**
 * Buscar um PPC específico pelo ID (vem da URL: GET /api/ppcs/:id).
 * req.params.id captura o valor dinâmico da URL.
 * "include: { componentes: true }" faz o Prisma trazer todas as disciplinas
 * vinculadas ao PPC automaticamente (equivalente a um JOIN no SQL).
 */
exports.buscarPpcPorId = async (req, res) => {
    try {
        const { id } = req.params; // :id da URL

        const ppc = await prisma.ppc.findUnique({
            where: { id: Number(id) },
            include: {
                usuario: { select: { nome: true, email: true } },
                componentes: true // Traz todas as disciplinas vinculadas (relação 1:N)
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

/**
 * Atualizar dados de um PPC existente.
 * Aceita atualização parcial: o frontend pode enviar apenas os campos alterados.
 * Campos numéricos são convertidos de string para Number antes de salvar,
 * pois o Prisma exige o tipo correto (Int no schema).
 */
exports.atualizarPpc = async (req, res) => {
    try {
        const { id } = req.params;
        const dadosAtualizados = req.body;

        // Converte campos que são Int no schema mas chegam como string do frontend
        const camposNumericos = [
            'cursoSemanasLetivas', 'cursoAtivComplem', 'cursoIntegMinima', 'cursoIntegMaxima',
            'ofertaNumTurmas', 'ofertaVagasTurma', 'ofertaVagasTurno', 'ofertaVagasSemestre', 'ofertaDuracao'
        ];
        camposNumericos.forEach(campo => {
            if (dadosAtualizados[campo] !== undefined) dadosAtualizados[campo] = Number(dadosAtualizados[campo]);
        });

        const ppcAtualizado = await prisma.ppc.update({
            where: { id: Number(id) },
            data: dadosAtualizados
        });

        res.status(200).json({ success: true, data: ppcAtualizado });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar os dados do PPC." });
    }
};

// Deletar um PPC. Os componentes curriculares vinculados são deletados
// automaticamente em cascata (onDelete: Cascade configurado no schema.prisma).
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