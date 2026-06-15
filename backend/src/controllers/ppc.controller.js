const { pool } = require('../db');

const NOME_AMIGAVEL = {
  nome_campus: 'Nome do Campus', cnpj: 'CNPJ', cidade_campus: 'Cidade', cep: 'CEP',
  bairro: 'Bairro', rua: 'Rua', numero: 'Número', telefone_fax: 'Telefone/Fax',
  email_contato: 'E-mail de Contato', ato_legal: 'Ato Legal de Criação', sitio: 'Sítio',
  tipo_curso: 'Tipo do Curso', nome_curso: 'Nome do Curso', eixo_tecnologico: 'Eixo Tecnológico',
  modalidade: 'Modalidade', formas_oferta: 'Formas de Oferta', titulacao: 'Titulação',
  ch_estagio_hr: 'CH Estágio Supervisionado', num_semanas_letivas: 'Nº de Semanas Letivas',
  atividades_complementares_hr: 'Atividades Complementares',
  periodo_integralizacao_min: 'Período de Integralização Mínima',
  periodo_integralizacao_max: 'Período de Integralização Máxima',
  formas_acesso: 'Formas de Acesso', prerequisitos_ingresso: 'Pré-requisitos para Ingresso',
  regime: 'Regime', turnos: 'Turnos', num_turmas_por_turno: 'Nº de Turmas por Turno',
  vagas_por_turma: 'Vagas por Turma', num_vagas_por_turno: 'Nº de Vagas por Turno',
  vagas_por_semestre: 'Vagas por Semestre', duracao_curso: 'Duração do Curso',
  conceito_curso: 'Conceito de Curso (CC)', conceito_preliminar_curso: 'Conceito Preliminar (CPC)',
  conceito_enade: 'Conceito Enade', igc: 'IGC',
  situacao_curso: 'Situação do Curso', status_curso: 'Status do Curso',
};

const TAMANHO_MAXIMO = {
  nome_campus: 255, cnpj: 30, cidade_campus: 100, cep: 20,
  bairro: 255, rua: 255, numero: 30, telefone_fax: 30,
  email_contato: 255, ato_legal: 255, sitio: 255,
  tipo_curso: 100, nome_curso: 255, eixo_tecnologico: 255,
  modalidade: 100, formas_oferta: 255, titulacao: 255,
  periodo_integralizacao_min: 50, periodo_integralizacao_max: 50, formas_acesso: 255,
  regime: 100, turnos: 100, duracao_curso: 100,
  conceito_curso: 20, conceito_preliminar_curso: 20, conceito_enade: 20, igc: 20,
  situacao_curso: 100, status_curso: 100,
};

const CAMPOS_NUMERICOS = new Set([
  'ch_estagio_hr', 'num_semanas_letivas', 'atividades_complementares_hr',
  'num_turmas_por_turno', 'vagas_por_turma', 'num_vagas_por_turno', 'vagas_por_semestre',
]);

function validarCampos(campos, valores) {
  for (let i = 0; i < campos.length; i++) {
    const campo = campos[i];
    const valor = valores[i];
    if (valor === null) continue;

    const limite = TAMANHO_MAXIMO[campo];
    if (limite && typeof valor === 'string' && valor.length > limite) {
      return {
        campo,
        erro: `O campo "${NOME_AMIGAVEL[campo] || campo}" é muito longo (máximo ${limite} caracteres, digitado: ${valor.length}).`,
      };
    }

    if (CAMPOS_NUMERICOS.has(campo) && isNaN(Number(valor))) {
      return {
        campo,
        erro: `O campo "${NOME_AMIGAVEL[campo] || campo}" deve conter apenas números.`,
      };
    }
  }
  return null;
}

function tratarErroPg(err, campos, valores) {
  // Valor muito longo para VARCHAR(N)
  if (err.code === '22001') {
    // Tenta pegar o nome da coluna direto do driver
    if (err.column && NOME_AMIGAVEL[err.column]) {
      return {
        campo: err.column,
        erro: `O campo "${NOME_AMIGAVEL[err.column]}" excede o tamanho máximo permitido.`,
      };
    }
    // Extrai o limite N da mensagem e procura qual valor passou desse tamanho
    const match = err.message.match(/character varying\((\d+)\)/);
    if (match) {
      const limiteReal = parseInt(match[1]);
      for (let i = 0; i < campos.length; i++) {
        const v = valores[i];
        if (v && typeof v === 'string' && v.length > limiteReal) {
          return {
            campo: campos[i],
            erro: `O campo "${NOME_AMIGAVEL[campos[i]] || campos[i]}" é muito longo (máximo ${limiteReal} caracteres, digitado: ${v.length}).`,
          };
        }
      }
    }
    return { campo: null, erro: 'Um ou mais campos excedem o tamanho máximo permitido.' };
  }

  // Valor inválido para tipo numérico (ex: texto em campo INTEGER)
  if (err.code === '22P02') {
    return { campo: null, erro: 'Um campo numérico contém um valor inválido. Verifique os campos de horas, vagas e semanas.' };
  }

  // Número fora do intervalo do tipo (ex: valor > 2.147.483.647 em campo INTEGER)
  if (err.code === '22003') {
    const match = err.message.match(/value "([^"]+)" is out of range for type (\w+)/);
    if (match) {
      const valorCulpado = match[1];
      for (let i = 0; i < campos.length; i++) {
        if (String(valores[i]) === valorCulpado) {
          return {
            campo: campos[i],
            erro: `O campo "${NOME_AMIGAVEL[campos[i]] || campos[i]}" contém um número muito grande para o tipo do banco de dados.`,
          };
        }
      }
    }
    return { campo: null, erro: 'Um campo numérico contém um valor fora do intervalo permitido.' };
  }

  return null;
}

const CAMPOS_PPC = [
  'nome_campus', 'cnpj', 'cidade_campus', 'cep', 'bairro', 'rua', 'numero',
  'telefone_fax', 'email_contato', 'ato_legal', 'sitio',
  'tipo_curso', 'nome_curso', 'eixo_tecnologico', 'modalidade', 'formas_oferta',
  'titulacao', 'ch_estagio_hr', 'num_semanas_letivas', 'atividades_complementares_hr',
  'periodo_integralizacao_min', 'periodo_integralizacao_max', 'formas_acesso', 'prerequisitos_ingresso',
  'regime', 'turnos', 'num_turmas_por_turno', 'vagas_por_turma', 'num_vagas_por_turno',
  'vagas_por_semestre', 'duracao_curso', 'conceito_curso', 'conceito_preliminar_curso',
  'conceito_enade', 'igc', 'situacao_curso', 'status_curso', 'status',
];

async function listar(req, res) {
  const { status } = req.query;
  try {
    let query = `SELECT id, nome_curso, nome_campus, status, created_at, updated_at
                 FROM ppcs WHERE usuario_id = $1`;
    const params = [req.usuario.id];

    if (status) { query += ' AND status = $2'; params.push(status); }
    query += ' ORDER BY updated_at DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function buscarPorId(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM ppcs WHERE id = $1 AND usuario_id = $2',
      [req.params.id, req.usuario.id]
    );
    if (!rows[0]) return res.status(404).json({ erro: 'PPC não encontrado' });
    res.json(rows[0]);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function criar(req, res) {
  const campos = CAMPOS_PPC.filter(c => req.body[c] !== undefined);
  const valores = campos.map(c => req.body[c]);

  const erroValidacao = validarCampos(campos, valores);
  if (erroValidacao) return res.status(422).json(erroValidacao);

  const placeholders = campos.map((_, i) => `$${i + 2}`).join(', ');
  const colunas = campos.join(', ');

  try {
    const { rows } = await pool.query(
      `INSERT INTO ppcs (usuario_id${campos.length ? ', ' + colunas : ''})
       VALUES ($1${campos.length ? ', ' + placeholders : ''})
       RETURNING *`,
      [req.usuario.id, ...valores]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[criar] erro:', err.message);
    const erroConhecido = tratarErroPg(err, campos, valores);
    if (erroConhecido) return res.status(422).json(erroConhecido);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function atualizar(req, res) {
  const updates = CAMPOS_PPC.filter(c => req.body[c] !== undefined);
  if (updates.length === 0)
    return res.status(400).json({ erro: 'Nenhum campo para atualizar' });

  const valores = updates.map(c => req.body[c]);

  const erroValidacao = validarCampos(updates, valores);
  if (erroValidacao) return res.status(422).json(erroValidacao);

  const setClause = updates.map((c, i) => `${c} = $${i + 1}`).join(', ');

  try {
    const { rows } = await pool.query(
      `UPDATE ppcs SET ${setClause}, updated_at = NOW()
       WHERE id = $${updates.length + 1} AND usuario_id = $${updates.length + 2}
       RETURNING *`,
      [...valores, req.params.id, req.usuario.id]
    );
    if (!rows[0]) return res.status(404).json({ erro: 'PPC não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[atualizar] erro:', err.message);
    const erroConhecido = tratarErroPg(err, updates, valores);
    if (erroConhecido) return res.status(422).json(erroConhecido);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function salvarRascunho(req, res) {
  req.body.status = 'rascunho';
  return atualizar(req, res);
}

async function listarComponentes(req, res) {
  try {
    const { rows: ppc } = await pool.query(
      'SELECT id FROM ppcs WHERE id = $1 AND usuario_id = $2',
      [req.params.id, req.usuario.id]
    );
    if (!ppc[0]) return res.status(404).json({ erro: 'PPC não encontrado' });

    const { rows } = await pool.query(
      'SELECT * FROM componentes_curriculares WHERE ppc_id = $1 ORDER BY periodo, codigo',
      [req.params.id]
    );
    res.json(rows);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function deletar(req, res) {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM ppcs WHERE id = $1 AND usuario_id = $2',
      [req.params.id, req.usuario.id]
    );
    if (!rowCount) return res.status(404).json({ erro: 'PPC não encontrado' });
    res.json({ mensagem: 'PPC excluído com sucesso' });
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

async function adicionarComponente(req, res) {
  const {
    codigo, nome, creditos_praticas, creditos_teoricas, creditos_extensao,
    total_horas_praticas, total_horas_teoricas, total_horas_extensao,
    tipo, periodo, prerequisitos, correquisitos,
  } = req.body;

  try {
    const { rows: ppc } = await pool.query(
      'SELECT id FROM ppcs WHERE id = $1 AND usuario_id = $2',
      [req.params.id, req.usuario.id]
    );
    if (!ppc[0]) return res.status(404).json({ erro: 'PPC não encontrado' });

    const { rows } = await pool.query(
      `INSERT INTO componentes_curriculares
         (ppc_id, codigo, nome, creditos_praticas, creditos_teoricas, creditos_extensao,
          total_horas_praticas, total_horas_teoricas, total_horas_extensao,
          tipo, periodo, prerequisitos, correquisitos)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [
        req.params.id, codigo, nome, creditos_praticas, creditos_teoricas, creditos_extensao,
        total_horas_praticas, total_horas_teoricas, total_horas_extensao,
        tipo, periodo, prerequisitos, correquisitos,
      ]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, salvarRascunho, deletar, listarComponentes, adicionarComponente };
