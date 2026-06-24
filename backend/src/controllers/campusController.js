/**
 * Controller de Campi.
 * Alimenta o combobox (datalist) do campo "Nome do Campus" no frontend.
 * Quando o usuário digita um campus novo, o frontend chama criarCampus
 * para que ele apareça como sugestão para futuros usuários.
 */
const prisma = require('../config/database');

// Retorna todos os campi ordenados por nome para popular o datalist
exports.listarCampi = async (req, res) => {
    try {
        const campi = await prisma.campus.findMany({
            orderBy: { nome: 'asc' },
        });
        res.json({ success: true, data: campi });
    } catch (error) {
        console.error('Erro ao listar campi:', error);
        res.status(500).json({ error: 'Erro ao listar campi.' });
    }
};

// Cria um campus novo. P2002 = nome já existe (constraint @unique no schema)
exports.criarCampus = async (req, res) => {
    try {
        const { nome, cidade, cnpj, cep, bairro, rua, numero, telefoneFax, email, atoLegal, site } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({ error: 'Nome do campus é obrigatório.' });
        }

        const campus = await prisma.campus.create({
            data: { nome: nome.trim(), cidade, cnpj, cep, bairro, rua, numero, telefoneFax, email, atoLegal, site },
        });

        res.status(201).json({ success: true, data: campus });
    } catch (error) {
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Já existe um campus com esse nome.' });
        }
        console.error('Erro ao criar campus:', error);
        res.status(500).json({ error: 'Erro ao criar campus.' });
    }
};
