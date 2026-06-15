const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { pool } = require('../db');

async function login(req, res) {
  const { email, senha } = req.body;
  if (!email || !senha)
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });

  try {
    const { rows } = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = rows[0];

    if (!usuario || !usuario.senha_hash)
      return res.status(401).json({ erro: 'Credenciais inválidas' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida)
      return res.status(401).json({ erro: 'Credenciais inválidas' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '8h' }
    );

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email } });
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function esqueceuSenha(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ erro: 'Email é obrigatório' });

  try {
    const { rows } = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (!rows[0]) return res.status(404).json({ erro: 'Usuário não encontrado' });

    const token = crypto.randomBytes(6).toString('hex').toUpperCase();
    const expiracao = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      'UPDATE usuarios SET token_recuperacao = $1, token_expiracao = $2 WHERE email = $3',
      [token, expiracao, email]
    );

    // Em produção: enviar email com o token
    console.log(`[DEV] Token de recuperação para ${email}: ${token}`);
    res.json({ mensagem: 'Código enviado para o email informado' });
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function verificarToken(req, res) {
  const { email, token } = req.body;
  if (!email || !token) return res.status(400).json({ erro: 'Email e token são obrigatórios' });

  try {
    const { rows } = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1 AND token_recuperacao = $2 AND token_expiracao > NOW()',
      [email, token]
    );

    if (!rows[0]) return res.status(400).json({ erro: 'Código inválido ou expirado' });

    res.json({ valido: true, usuarioId: rows[0].id });
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function definirSenha(req, res) {
  const { email, token, senha } = req.body;
  if (!email || !token || !senha)
    return res.status(400).json({ erro: 'Email, token e senha são obrigatórios' });

  try {
    const { rows } = await pool.query(
      'SELECT id FROM usuarios WHERE email = $1 AND token_recuperacao = $2 AND token_expiracao > NOW()',
      [email, token]
    );

    if (!rows[0]) return res.status(400).json({ erro: 'Código inválido ou expirado' });

    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query(
      'UPDATE usuarios SET senha_hash = $1, token_recuperacao = NULL, token_expiracao = NULL WHERE id = $2',
      [senhaHash, rows[0].id]
    );

    res.json({ mensagem: 'Senha definida com sucesso' });
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { login, esqueceuSenha, verificarToken, definirSenha };
