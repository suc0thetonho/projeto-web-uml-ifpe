// src/controllers/usuarioController.js
const prisma = require('../config/database');

// 1. Cadastrar um Coordenador/Usuário (RF01 / VAL04)
exports.criarUsuario = async (req, res) => {
    try {
        const {
            nome, cpf, dataNascimento, email, telefoneCelular,
            matricula, cursoAreaCoordena, departamentoSetor,
            campus, cidade, senha
        } = req.body;

        // Cria o registro usando exatamente os campos do seu schema
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                cpf,
                dataNascimento: new Date(dataNascimento), // Garante o formato DateTime do Prisma
                email,
                telefoneCelular,
                matricula,
                cursoAreaCoordena,
                departamentoSetor,
                campus,
                cidade,
                senha // Lembrete: No futuro, aplicamos o hash aqui (RNF07)
            }
        });

        // Remove a senha do retorno por segurança
        delete novoUsuario.senha;

        res.status(201).json({ success: true, data: novoUsuario });
    } catch (error) {
        // Erro de restrição única do Prisma (P2002: CPF, Email ou Matrícula duplicados)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: `O campo '${error.meta.target}' informado já está cadastrado.` });
        }
        res.status(500).json({ error: "Erro interno ao cadastrar usuário.", detalhes: error.message });
    }
};

// 2. Listar todos os Usuários
exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: { // Retorna apenas o essencial, ocultando dados sensíveis
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