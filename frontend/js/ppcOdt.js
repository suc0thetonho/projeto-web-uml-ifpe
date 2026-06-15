async function gerarOdtPpc(id) {
  if (typeof JSZip === 'undefined') {
    alert('Biblioteca JSZip não carregada. Tente novamente.');
    return;
  }

  const [resPpc, resComp] = await Promise.all([
    apiFetch(`/ppcs/${id}`),
    apiFetch(`/ppcs/${id}/componentes`),
  ]);

  if (!resPpc?.ok) { alert('Erro ao carregar dados do PPC'); return; }

  const ppc = await resPpc.json();
  const componentes = resComp?.ok ? await resComp.json() : [];

  function esc(v) {
    if (v == null || String(v).trim() === '') return '—';
    return String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function p(texto, estilo) {
    return `<text:p text:style-name="${estilo}">${esc(texto)}</text:p>`;
  }

  function secao(titulo, campos) {
    const linhas = campos.map(([label, valor]) => `
      <table:table-row>
        <table:table-cell table:style-name="CelulaLabel">
          <text:p text:style-name="TextoLabel">${esc(label)}</text:p>
        </table:table-cell>
        <table:table-cell table:style-name="CelulaValor">
          <text:p text:style-name="TextoCelula">${esc(valor)}</text:p>
        </table:table-cell>
      </table:table-row>`).join('');

    return `
      ${p(titulo, 'TituloSecao')}
      <table:table>
        <table:table-column table:style-name="ColunaLabel"/>
        <table:table-column table:style-name="ColunaValor"/>
        ${linhas}
      </table:table>
      <text:p text:style-name="Padrao"/>`;
  }

  const HEADERS_COMP = ['Código', 'Nome', 'Tipo', 'Período',
    'Cr.Pr.', 'Cr.Te.', 'Cr.Ex.',
    'H.Pr.', 'H.Te.', 'H.Ex.',
    'Pré-req.', 'Correq.'];
  const N = HEADERS_COMP.length;

  const linhasComp = componentes.length === 0
    ? `<table:table-row>
        <table:table-cell table:style-name="CelulaValor" table:number-columns-spanned="${N}">
          <text:p text:style-name="TextoCelula">Nenhum componente cadastrado</text:p>
        </table:table-cell>
        ${Array(N - 1).fill('<table:covered-table-cell/>').join('')}
      </table:table-row>`
    : componentes.map(c => {
        const vals = [
          c.codigo, c.nome, c.tipo, c.periodo,
          c.creditos_praticas, c.creditos_teoricas, c.creditos_extensao,
          c.total_horas_praticas, c.total_horas_teoricas, c.total_horas_extensao,
          c.prerequisitos || null, c.correquisitos || null,
        ];
        return `<table:table-row>${vals.map(v =>
          `<table:table-cell table:style-name="CelulaValor">
            <text:p text:style-name="TextoCelula">${esc(v)}</text:p>
          </table:table-cell>`).join('')}</table:table-row>`;
      }).join('');

  const tabelaComponentes = `
    ${p('COMPONENTES CURRICULARES', 'TituloSecao')}
    <table:table>
      ${Array(N).fill('<table:table-column/>').join('')}
      <table:table-row>
        ${HEADERS_COMP.map(h =>
          `<table:table-cell table:style-name="CelulaLabel">
            <text:p text:style-name="TextoLabel">${esc(h)}</text:p>
          </table:table-cell>`).join('')}
      </table:table-row>
      ${linhasComp}
    </table:table>`;

  const contentXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-content
  xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
  xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
  xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"
  xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
  xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
  office:version="1.3">
  <office:automatic-styles>
    <style:style style:name="Padrao" style:family="paragraph">
      <style:text-properties fo:font-size="10pt"/>
    </style:style>
    <style:style style:name="TituloDoc" style:family="paragraph">
      <style:paragraph-properties fo:text-align="center" fo:margin-top="6pt" fo:margin-bottom="2pt"/>
      <style:text-properties fo:font-size="16pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="SubtituloDoc" style:family="paragraph">
      <style:paragraph-properties fo:text-align="center" fo:margin-bottom="2pt"/>
      <style:text-properties fo:font-size="13pt" fo:font-weight="bold"/>
    </style:style>
    <style:style style:name="MetaDoc" style:family="paragraph">
      <style:paragraph-properties fo:text-align="center" fo:margin-bottom="10pt"/>
      <style:text-properties fo:font-size="9pt" fo:color="#555555"/>
    </style:style>
    <style:style style:name="TituloSecao" style:family="paragraph">
      <style:paragraph-properties fo:margin-top="10pt" fo:margin-bottom="3pt"/>
      <style:text-properties fo:font-size="10pt" fo:font-weight="bold" fo:color="#0056C7"/>
    </style:style>
    <style:style style:name="TextoCelula" style:family="paragraph">
      <style:text-properties fo:font-size="9pt"/>
    </style:style>
    <style:style style:name="TextoLabel" style:family="paragraph">
      <style:text-properties fo:font-size="9pt" fo:font-weight="bold" fo:color="#333333"/>
    </style:style>
    <style:style style:name="ColunaLabel" style:family="table-column">
      <style:table-column-properties style:column-width="6.5cm"/>
    </style:style>
    <style:style style:name="ColunaValor" style:family="table-column">
      <style:table-column-properties style:column-width="12.5cm"/>
    </style:style>
    <style:style style:name="CelulaLabel" style:family="table-cell">
      <style:table-cell-properties
        fo:background-color="#EEF2FC"
        fo:padding="2pt"
        fo:border="0.5pt solid #C8C8C8"/>
    </style:style>
    <style:style style:name="CelulaValor" style:family="table-cell">
      <style:table-cell-properties
        fo:background-color="#FFFFFF"
        fo:padding="2pt"
        fo:border="0.5pt solid #C8C8C8"/>
    </style:style>
  </office:automatic-styles>
  <office:body>
    <office:text>
      ${p('INSTITUTO FEDERAL DE PERNAMBUCO — IFPE', 'MetaDoc')}
      ${p('PROJETO PEDAGÓGICO DE CURSO', 'TituloDoc')}
      ${p(ppc.nome_curso || '—', 'SubtituloDoc')}
      ${p(`${ppc.nome_campus || ''}   ·   Status: ${ppc.status || ''}`, 'MetaDoc')}
      ${secao('DADOS DO CAMPUS', [
        ['Nome do Campus',       ppc.nome_campus],
        ['CNPJ',                 ppc.cnpj],
        ['Cidade',               ppc.cidade_campus],
        ['CEP',                  ppc.cep],
        ['Bairro',               ppc.bairro],
        ['Rua / Número',         [ppc.rua, ppc.numero].filter(Boolean).join(', ') || null],
        ['Telefone / Fax',       ppc.telefone_fax],
        ['E-mail de Contato',    ppc.email_contato],
        ['Ato Legal de Criação', ppc.ato_legal],
        ['Sítio',                ppc.sitio],
      ])}
      ${secao('DADOS DO CURSO', [
        ['Tipo do Curso',                    ppc.tipo_curso],
        ['Nome do Curso',                    ppc.nome_curso],
        ['Eixo Tecnológico',                 ppc.eixo_tecnologico],
        ['Modalidade',                       ppc.modalidade],
        ['Formas de Oferta',                 ppc.formas_oferta],
        ['Titulação',                        ppc.titulacao],
        ['CH Estágio Supervisionado (H/R)',   ppc.ch_estagio_hr],
        ['Nº de Semanas Letivas',            ppc.num_semanas_letivas],
        ['Atividades Complementares (H/R)',  ppc.atividades_complementares_hr],
        ['Período de Integralização Mínima', ppc.periodo_integralizacao_min],
        ['Período de Integralização Máxima', ppc.periodo_integralizacao_max],
        ['Formas de Acesso',                 ppc.formas_acesso],
        ['Pré-requisitos para Ingresso',     ppc.prerequisitos_ingresso],
      ])}
      ${secao('INFORMAÇÕES COMPLEMENTARES DO CURSO', [
        ['Regime',                    ppc.regime],
        ['Turnos',                    ppc.turnos],
        ['Duração do Curso',          ppc.duracao_curso],
        ['Nº Turmas por Turno',       ppc.num_turmas_por_turno],
        ['Vagas por Turma',           ppc.vagas_por_turma],
        ['Nº Vagas por Turno',        ppc.num_vagas_por_turno],
        ['Vagas por Semestre',        ppc.vagas_por_semestre],
        ['Conceito de Curso (CC)',    ppc.conceito_curso],
        ['Conceito Preliminar (CPC)', ppc.conceito_preliminar_curso],
        ['Conceito Enade',            ppc.conceito_enade],
        ['IGC',                       ppc.igc],
        ['Situação do Curso',         ppc.situacao_curso],
        ['Status do Curso',           ppc.status_curso],
      ])}
      ${tabelaComponentes}
    </office:text>
  </office:body>
</office:document-content>`;

  const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest
  xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0"
  manifest:version="1.3">
  <manifest:file-entry manifest:media-type="application/vnd.oasis.opendocument.text" manifest:full-path="/"/>
  <manifest:file-entry manifest:media-type="text/xml" manifest:full-path="content.xml"/>
</manifest:manifest>`;

  const zip = new JSZip();
  zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
  zip.file('META-INF/manifest.xml', manifestXml);
  zip.file('content.xml', contentXml);

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.oasis.opendocument.text',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const nomeArquivo = (ppc.nome_curso || 'PPC').replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '_');
  a.href = url;
  a.download = `PPC_${nomeArquivo}.odt`;
  a.click();
  URL.revokeObjectURL(url);
}
