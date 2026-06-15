const bcrypt = require('bcryptjs');
const { pool } = require('../db');

async function cadastrar(req, res) {
  const {
    nome, cpf, data_nascimento, email, telefone,
    matricula, curso_area, departamento, campus, cidade, estado,
  } = req.body;

  if (!nome || !cpf || !email)
    return res.status(400).json({ erro: 'Nome, CPF e email são obrigatórios' });

  try {
    const { rows } = await pool.query(
      `INSERT INTO usuarios
         (nome, cpf, data_nascimento, email, telefone, matricula, curso_area, departamento, campus, cidade, estado)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING id, nome, email`,
      [nome, cpf, data_nascimento || null, email, telefone, matricula, curso_area, departamento, campus, cidade, estado]
    );

    res.status(201).json({ mensagem: 'Cadastro realizado com sucesso', usuario: rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ erro: 'CPF ou email já cadastrado' });
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function definirSenhaInicial(req, res) {
  const { senha } = req.body;
  const { id } = req.params;

  if (!senha) return res.status(400).json({ erro: 'Senha é obrigatória' });

  try {
    const { rowCount } = await pool.query('SELECT id FROM usuarios WHERE id = $1 AND senha_hash IS NULL', [id]);
    if (!rowCount) return res.status(404).json({ erro: 'Usuário não encontrado ou já possui senha' });

    const senhaHash = await bcrypt.hash(senha, 10);
    await pool.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [senhaHash, id]);

    res.json({ mensagem: 'Senha definida com sucesso' });
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function buscarPerfil(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT id, nome, cpf, email, telefone, matricula, curso_area, departamento, campus, cidade, estado FROM usuarios WHERE id = $1',
      [req.usuario.id]
    );
    if (!rows[0]) return res.status(404).json({ erro: 'Usuário não encontrado' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { cadastrar, definirSenhaInicial, buscarPerfil };
