// Espelha as regras de validação do backend (ppc.controller.js).
// Se alterar limites ou tipos no backend, atualizar aqui também.

const CamposRegras = (() => {
  const TAMANHO_MAXIMO = {
    nome_campus: 255, cnpj: 30, cidade_campus: 100, cep: 20,
    bairro: 255, rua: 255, numero: 30, telefone_fax: 30,
    email_contato: 255, ato_legal: 255, sitio: 255,
    tipo_curso: 100, nome_curso: 255, eixo_tecnologico: 255,
    modalidade: 100, formas_oferta: 255, titulacao: 255,
    periodo_integralizacao_min: 50, periodo_integralizacao_max: 50,
    formas_acesso: 255,
    regime: 100, turnos: 100, duracao_curso: 100,
    conceito_curso: 20, conceito_preliminar_curso: 20,
    conceito_enade: 20, igc: 20,
    situacao_curso: 100, status_curso: 100,
  };

  const CAMPOS_NUMERICOS = new Set([
    'ch_estagio_hr', 'num_semanas_letivas', 'atividades_complementares_hr',
    'num_turmas_por_turno', 'vagas_por_turma', 'num_vagas_por_turno', 'vagas_por_semestre',
  ]);

  // Subconjunto de CAMPOS_NUMERICOS que são INTEGER no banco (máx. 2.147.483.647)
  const CAMPOS_INTEIROS = new Set([
    'num_semanas_letivas', 'num_turmas_por_turno', 'vagas_por_turma',
    'num_vagas_por_turno', 'vagas_por_semestre',
  ]);
  const INTEGER_MAX = 2147483647;

  const NOME_AMIGAVEL = {
    nome_campus: 'Nome do Campus', cnpj: 'CNPJ', cidade_campus: 'Cidade', cep: 'CEP',
    bairro: 'Bairro', rua: 'Rua', numero: 'Número', telefone_fax: 'Telefone/Fax',
    email_contato: 'E-mail de Contato', ato_legal: 'Ato Legal de Criação', sitio: 'Sítio',
    tipo_curso: 'Tipo do Curso', nome_curso: 'Nome do Curso',
    eixo_tecnologico: 'Eixo Tecnológico', modalidade: 'Modalidade',
    formas_oferta: 'Formas de Oferta', titulacao: 'Titulação',
    ch_estagio_hr: 'CH Estágio Supervisionado',
    num_semanas_letivas: 'Nº de Semanas Letivas',
    atividades_complementares_hr: 'Atividades Complementares',
    periodo_integralizacao_min: 'Período de Integralização Mínima',
    periodo_integralizacao_max: 'Período de Integralização Máxima',
    formas_acesso: 'Formas de Acesso',
    prerequisitos_ingresso: 'Pré-requisitos para Ingresso',
    regime: 'Regime', turnos: 'Turnos',
    num_turmas_por_turno: 'Nº de Turmas por Turno',
    vagas_por_turma: 'Vagas por Turma',
    num_vagas_por_turno: 'Nº de Vagas por Turno',
    vagas_por_semestre: 'Vagas por Semestre',
    duracao_curso: 'Duração do Curso',
    conceito_curso: 'Conceito de Curso (CC)',
    conceito_preliminar_curso: 'Conceito Preliminar (CPC)',
    conceito_enade: 'Conceito Enade', igc: 'IGC',
    situacao_curso: 'Situação do Curso', status_curso: 'Status do Curso',
  };

  // Aplica maxlength e inputmode nos inputs do formulário com base nas regras do backend.
  function aplicarAtributos(form) {
    form.querySelectorAll('input[name]').forEach(input => {
      const limite = TAMANHO_MAXIMO[input.name];
      if (limite) input.maxLength = limite;
      if (CAMPOS_NUMERICOS.has(input.name)) input.inputMode = 'decimal';
    });
  }

  // Valida os dados antes da chamada à API. Retorna { campo, erro } ou null.
  function validar(dados) {
    for (const [campo, valor] of Object.entries(dados)) {
      if (valor === null || valor === undefined || valor === '') continue;

      const limite = TAMANHO_MAXIMO[campo];
      if (limite && typeof valor === 'string' && valor.length > limite) {
        const nome = NOME_AMIGAVEL[campo] || campo;
        return {
          campo,
          erro: `"${nome}" excede o máximo de ${limite} caracteres (digitado: ${valor.length}).`,
        };
      }

      if (CAMPOS_NUMERICOS.has(campo)) {
        const num = Number(valor);
        if (isNaN(num)) {
          const nome = NOME_AMIGAVEL[campo] || campo;
          return { campo, erro: `"${nome}" deve conter apenas números.` };
        }
        if (CAMPOS_INTEIROS.has(campo) && (num > INTEGER_MAX || num < 0 || !Number.isInteger(num))) {
          const nome = NOME_AMIGAVEL[campo] || campo;
          return { campo, erro: `"${nome}" deve ser um número inteiro positivo (máximo: ${INTEGER_MAX.toLocaleString('pt-BR')}).` };
        }
      }
    }
    return null;
  }

  return { aplicarAtributos, validar };
})();
