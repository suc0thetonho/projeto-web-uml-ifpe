/**
 * Controller de Sites.
 * Mesmo padrão do campusController: alimenta o datalist do campo "Site"
 * no formulário de PPC e permite cadastrar novos sites automaticamente.
 */
const prisma = require('../config/database');

exports.listarSites = async (req, res) => {
    try {
        const sites = await prisma.site.findMany({
            orderBy: { url: 'asc' },
        });
        res.json({ success: true, data: sites });
    } catch (error) {
        console.error('Erro ao listar sites:', error);
        res.status(500).json({ error: 'Erro ao listar sites.' });
    }
};

exports.criarSite = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url || !url.trim()) {
            return res.status(400).json({ error: 'URL do site é obrigatória.' });
        }

        const site = await prisma.site.create({
            data: { url: url.trim() },
        });

        res.status(201).json({ success: true, data: site });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Esse site já está cadastrado.' });
        }
        console.error('Erro ao criar site:', error);
        res.status(500).json({ error: 'Erro ao criar site.' });
    }
};
