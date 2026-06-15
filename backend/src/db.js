const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDb() {
  await pool.query(`
    ALTER TABLE IF EXISTS ppcs
      ALTER COLUMN cnpj           TYPE VARCHAR(30),
      ALTER COLUMN cep            TYPE VARCHAR(20),
      ALTER COLUMN numero         TYPE VARCHAR(30),
      ALTER COLUMN telefone_fax   TYPE VARCHAR(30),
      ALTER COLUMN conceito_curso TYPE VARCHAR(20),
      ALTER COLUMN conceito_preliminar_curso TYPE VARCHAR(20),
      ALTER COLUMN conceito_enade TYPE VARCHAR(20),
      ALTER COLUMN igc            TYPE VARCHAR(20);
  `).catch(() => {});

  await pool.query(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id                  SERIAL PRIMARY KEY,
      nome                VARCHAR(255) NOT NULL,
      cpf                 VARCHAR(14)  UNIQUE NOT NULL,
      data_nascimento     DATE,
      email               VARCHAR(255) UNIQUE NOT NULL,
      telefone            VARCHAR(20),
      matricula           VARCHAR(50),
      curso_area          VARCHAR(255),
      departamento        VARCHAR(255),
      campus              VARCHAR(255),
      cidade              VARCHAR(100),
      estado              VARCHAR(2),
      senha_hash          VARCHAR(255),
      token_recuperacao   VARCHAR(255),
      token_expiracao     TIMESTAMP,
      created_at          TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS ppcs (
      id                          SERIAL PRIMARY KEY,
      usuario_id                  INTEGER REFERENCES usuarios(id),
      -- Etapa 1: dados do campus
      nome_campus                 VARCHAR(255),
      cnpj                        VARCHAR(30),
      cidade_campus               VARCHAR(100),
      cep                         VARCHAR(20),
      bairro                      VARCHAR(255),
      rua                         VARCHAR(255),
      numero                      VARCHAR(30),
      telefone_fax                VARCHAR(30),
      email_contato               VARCHAR(255),
      ato_legal                   VARCHAR(255),
      sitio                       VARCHAR(255),
      -- Etapa 2: dados do curso (parte 1)
      tipo_curso                  VARCHAR(100),
      nome_curso                  VARCHAR(255),
      eixo_tecnologico            VARCHAR(255),
      modalidade                  VARCHAR(100),
      formas_oferta               VARCHAR(255),
      titulacao                   VARCHAR(255),
      ch_estagio_hr               DECIMAL,
      num_semanas_letivas         INTEGER,
      atividades_complementares_hr DECIMAL,
      periodo_integralizacao_min  VARCHAR(50),
      periodo_integralizacao_max  VARCHAR(50),
      formas_acesso               VARCHAR(255),
      prerequisitos_ingresso      TEXT,
      -- Etapa 3: dados do curso (parte 2)
      regime                      VARCHAR(100),
      turnos                      VARCHAR(100),
      num_turmas_por_turno        INTEGER,
      vagas_por_turma             INTEGER,
      num_vagas_por_turno         INTEGER,
      vagas_por_semestre          INTEGER,
      duracao_curso               VARCHAR(100),
      conceito_curso              VARCHAR(20),
      conceito_preliminar_curso   VARCHAR(20),
      conceito_enade              VARCHAR(20),
      igc                         VARCHAR(20),
      situacao_curso              VARCHAR(100),
      status_curso                VARCHAR(100),
      -- Metadados
      status                      VARCHAR(20) DEFAULT 'rascunho',
      created_at                  TIMESTAMP DEFAULT NOW(),
      updated_at                  TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS componentes_curriculares (
      id                    SERIAL PRIMARY KEY,
      ppc_id                INTEGER REFERENCES ppcs(id) ON DELETE CASCADE,
      codigo                VARCHAR(20),
      nome                  VARCHAR(255),
      creditos_praticas     DECIMAL,
      creditos_teoricas     DECIMAL,
      creditos_extensao     DECIMAL,
      total_horas_praticas  DECIMAL,
      total_horas_teoricas  DECIMAL,
      total_horas_extensao  DECIMAL,
      tipo                  VARCHAR(50),
      periodo               VARCHAR(20),
      prerequisitos         TEXT,
      correquisitos         TEXT
    );
  `);
}

module.exports = { pool, initDb };
