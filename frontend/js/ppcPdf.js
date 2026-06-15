async function gerarPdfPpc(id) {
  const [resPpc, resComp] = await Promise.all([
    apiFetch(`/ppcs/${id}`),
    apiFetch(`/ppcs/${id}/componentes`),
  ]);

  if (!resPpc?.ok) { alert('Erro ao carregar dados do PPC'); return; }

  const ppc = await resPpc.json();
  const componentes = resComp?.ok ? await resComp.json() : [];

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const margem = 15;
  let y = 20;

  // ── Cabeçalho ──────────────────────────────────────────────────────
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.setFont('helvetica', 'normal');
  doc.text('INSTITUTO FEDERAL DE PERNAMBUCO — IFPE', W / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0);
  doc.text('PROJETO PEDAGÓGICO DE CURSO', W / 2, y, { align: 'center' });
  y += 7;

  doc.setFontSize(12);
  doc.text(ppc.nome_curso || '—', W / 2, y, { align: 'center' });
  y += 5;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`${ppc.nome_campus || ''}   ·   Status: ${ppc.status || ''}`, W / 2, y, { align: 'center' });
  y += 7;

  doc.setDrawColor(0, 86, 199);
  doc.setLineWidth(0.6);
  doc.line(margem, y, W - margem, y);
  y += 8;
  doc.setTextColor(0);

  // ── Helper: seção de campos ─────────────────────────────────────────
  function secao(titulo, campos) {
    if (y > 240) { doc.addPage(); y = 20; }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(0, 86, 199);
    doc.text(titulo.toUpperCase(), margem, y);
    y += 2;
    doc.setTextColor(0);

    doc.autoTable({
      startY: y,
      margin: { left: margem, right: margem },
      theme: 'grid',
      showHead: false,
      styles: { fontSize: 8, cellPadding: 2.5, textColor: [30, 30, 30], lineColor: [220, 220, 220] },
      columnStyles: {
        0: { cellWidth: 70, fontStyle: 'bold', textColor: [80, 80, 80], fillColor: [245, 247, 252] },
        1: { cellWidth: 'auto' },
      },
      body: campos.map(([label, valor]) => [label, valor != null && String(valor).trim() !== '' ? valor : '—']),
    });

    y = doc.lastAutoTable.finalY + 8;
  }

  // ── Dados do Campus ────────────────────────────────────────────────
  secao('Dados do Campus', [
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
  ]);

  // ── Dados do Curso ─────────────────────────────────────────────────
  secao('Dados do Curso', [
    ['Tipo do Curso',                      ppc.tipo_curso],
    ['Nome do Curso',                      ppc.nome_curso],
    ['Eixo Tecnológico',                   ppc.eixo_tecnologico],
    ['Modalidade',                         ppc.modalidade],
    ['Formas de Oferta',                   ppc.formas_oferta],
    ['Titulação',                          ppc.titulacao],
    ['CH Estágio Supervisionado (H/R)',     ppc.ch_estagio_hr],
    ['Nº de Semanas Letivas',              ppc.num_semanas_letivas],
    ['Atividades Complementares (H/R)',    ppc.atividades_complementares_hr],
    ['Período de Integralização Mínima',   ppc.periodo_integralizacao_min],
    ['Período de Integralização Máxima',   ppc.periodo_integralizacao_max],
    ['Formas de Acesso',                   ppc.formas_acesso],
    ['Pré-requisitos para Ingresso',       ppc.prerequisitos_ingresso],
  ]);

  // ── Informações Complementares ────────────────────────────────────
  secao('Informações Complementares do Curso', [
    ['Regime',                   ppc.regime],
    ['Turnos',                   ppc.turnos],
    ['Duração do Curso',         ppc.duracao_curso],
    ['Nº Turmas por Turno',      ppc.num_turmas_por_turno],
    ['Vagas por Turma',          ppc.vagas_por_turma],
    ['Nº Vagas por Turno',       ppc.num_vagas_por_turno],
    ['Vagas por Semestre',       ppc.vagas_por_semestre],
    ['Conceito de Curso (CC)',   ppc.conceito_curso],
    ['Conceito Preliminar (CPC)',ppc.conceito_preliminar_curso],
    ['Conceito Enade',           ppc.conceito_enade],
    ['IGC',                      ppc.igc],
    ['Situação do Curso',        ppc.situacao_curso],
    ['Status do Curso',          ppc.status_curso],
  ]);

  // ── Componentes Curriculares ──────────────────────────────────────
  if (y > 200) { doc.addPage(); y = 20; }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 86, 199);
  doc.text('COMPONENTES CURRICULARES', margem, y);
  y += 2;
  doc.setTextColor(0);

  doc.autoTable({
    startY: y,
    margin: { left: margem, right: margem },
    theme: 'striped',
    styles: { fontSize: 7, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [0, 86, 199], textColor: 255, fontStyle: 'bold' },
    head: [['Código', 'Nome', 'Tipo', 'Per.', 'Cr.Pr.', 'Cr.Te.', 'Cr.Ex.', 'H.Pr.', 'H.Te.', 'H.Ex.', 'Pré-req.', 'Correq.']],
    body: componentes.length > 0
      ? componentes.map(c => [
          c.codigo       ?? '—', c.nome              ?? '—', c.tipo    ?? '—', c.periodo ?? '—',
          c.creditos_praticas ?? '—', c.creditos_teoricas ?? '—', c.creditos_extensao ?? '—',
          c.total_horas_praticas ?? '—', c.total_horas_teoricas ?? '—', c.total_horas_extensao ?? '—',
          c.prerequisitos || '—', c.correquisitos || '—',
        ])
      : [['Nenhum componente cadastrado', '', '', '', '', '', '', '', '', '', '', '']],
  });

  const nomeArquivo = (ppc.nome_curso || 'PPC').replace(/[^\w\s]/g, '').trim().replace(/\s+/g, '_');
  doc.save(`PPC_${nomeArquivo}.pdf`);
}
