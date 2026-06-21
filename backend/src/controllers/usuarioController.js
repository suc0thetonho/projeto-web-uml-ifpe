/**
 * Controller de Usuários (Coordenadores).
 * Cada função exportada é vinculada a uma rota em usuarioRoutes.js.
 * Padrão: recebe req (requisição) e res (resposta), interage com o banco via Prisma.
 */
const bcrypt = require('bcrypt');
const prisma = require('../config/database');

/**
 * Cadastrar um novo coordenador.
 * bcrypt.hash(senha, 10) gera um hash seguro da senha antes de salvar.
 * O número 10 é o "salt rounds" — quantas vezes o algoritmo é aplicado
 * (mais rounds = mais seguro, mas mais lento).
 */
exports.criarUsuario = async (req, res) => {
    try {
        // Desestruturação: extrai cada campo do corpo da requisição
        const {
            nome, cpf, dataNascimento, email, telefoneCelular,
            matricula, cursoAreaCoordena, departamentoSetor,
            campus, cidade, senha
        } = req.body;

        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                cpf,
                dataNascimento: new Date(dataNascimento), // Converte string para Date do Prisma
                email,
                telefoneCelular,
                matricula,
                cursoAreaCoordena,
                departamentoSetor,
                campus,
                cidade,
                senha: await bcrypt.hash(senha, 10) // Hash da senha antes de salvar no banco
            }
        });

        // Remove a senha do objeto retornado por segurança (nunca expor hash ao cliente)
        delete novoUsuario.senha;

        res.status(201).json({ success: true, data: novoUsuario });
    } catch (error) {
        // P2002 é o código do Prisma para violação de constraint UNIQUE
        // Ocorre quando CPF, email ou matrícula já existem no banco
        if (error.code === 'P2002') {
            return res.status(400).json({ error: `O campo '${error.meta.target}' informado já está cadastrado.` });
        }
        res.status(500).json({ error: "Erro interno ao cadastrar usuário.", detalhes: error.message });
    }
};

// Lista todos os usuários, usando select para retornar apenas campos públicos (sem senha)
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id: true,
                nome: true,
                email: true,
                matricula: true,
                cursoAreaCoordena: true,
                campus: true
            }
        });
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar usuários." });
    }
};