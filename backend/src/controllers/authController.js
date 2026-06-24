const bcrypt = require('bcrypt');  // Biblioteca para hash e comparação segura de senhas
const prisma = require('../config/database');

/**
 * Controller de login.
 * 1. Busca o usuário pelo email (findUnique)
 * 2. Compara a senha enviada com o hash armazenado no banco (bcrypt.compare)
 * 3. Se correto, retorna os dados do usuário SEM a senha
 *
 * bcrypt.compare é seguro contra timing attacks — não revela
 * em qual posição a senha diverge, diferente de uma comparação simples (===).
 */
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body; // Desestruturação: extrai email e senha do corpo da requisição

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        // findUnique busca exatamente 1 registro pelo campo @unique
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            // Mensagem genérica para não revelar se o email existe no sistema
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // Compara a senha em texto puro com o hash salvo no banco
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        // Desestruturação com renomeação: extrai "senha" como "_" (descartada)
        // e coleta o restante dos campos em "dadosPublicos"
        const { senha: _, ...dadosPublicos } = usuario;

        res.status(200).json({ success: true, data: dadosPublicos });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao realizar login.', detalhes: error.message });
    }
};
