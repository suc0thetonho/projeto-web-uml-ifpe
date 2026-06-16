const bcrypt = require('bcrypt');
const prisma = require('../config/database');

exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Email ou senha incorretos.' });
        }

        const { senha: _, ...dadosPublicos } = usuario;

        res.status(200).json({ success: true, data: dadosPublicos });
    } catch (error) {
        res.status(500).json({ error: 'Erro interno ao realizar login.', detalhes: error.message });
    }
};
