/**
 * Controller de exportação de PPCs para PDF e ODT.
 * PDF: usa a biblioteca PDFKit para gerar o documento programaticamente
 *      (posicionando texto, retângulos e tabelas via código).
 * ODT: monta a estrutura XML do formato OpenDocument manualmente
 *      e empacota em um ZIP (o formato .odt é essencialmente um ZIP com XMLs).
 */
const prisma = require('../config/database');
const PDFDocument = require('pdfkit');  // Biblioteca para geração de PDFs no Node.js
const JSZip = require('jszip');          // Biblioteca para criar arquivos ZIP (usado no ODT)

// Busca o PPC com todos os dados relacionados (coordenador + componentes)
async function buscarPpcCompleto(id) {
    return prisma.ppc.findUnique({
        where: { id: Number(id) },
        include: {
            usuario: { select: { nome: true, email: true } },
            componentes: { orderBy: [{ periodo: 'asc' }, { nome: 'asc' }] }
        }
    });
}

// Gera um nome de arquivo seguro removendo caracteres especiais
function nomeArquivo(ppc, ext) {
    const nome = (ppc.cursoNome || 'PPC').replace(/[^a-zA-Z0-9À-ú ]/g, '').trim().replace(/ +/g, '_');
    return `PPC_${nome}.${ext}`;
}

function val(v) {
    return (v !== null && v !== undefined && v !== '' && v !== 0) ? String(v) : '—';
}

// ==========================================
// EXPORTAÇÃO PDF
// ==========================================
/**
 * Gera e envia um PDF do PPC para download.
 * doc.pipe(res) conecta o stream do PDF direto na resposta HTTP,
 * enviando o arquivo conforme é gerado (sem precisar salvar em disco).
 * Content-Disposition: attachment força o navegador a baixar em vez de exibir.
 */
exports.downloadPdf = async (req, res) => {
    try {
        const ppc = await buscarPpcCompleto(req.params.id);
        if (!ppc) return res.status(404).json({ error: 'PPC não encontrado.' });

        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo(ppc, 'pdf')}"`);
        doc.pipe(res); // Stream do PDF direto para a resposta HTTP

        const AZUL = '#1a5276';
        const CINZA = '#555555';
        const LINHA = '#cccccc';
        const L = 50;
        const R = doc.page.width - 50;
        const W = R - L;

        // Cabeçalho
        doc.rect(L, 40, W, 60).fill(AZUL);
        doc.fill('#ffffff').fontSize(16).font('Helvetica-Bold')
            .text('IFPE — Projeto Pedagógico de Curso', L + 10, 52, { width: W - 20 });
        doc.fontSize(10).font('Helvetica')
            .text(ppc.cursoNome || 'PPC sem nome', L + 10, 74, { width: W - 20 });
        doc.fill(CINZA).fontSize(8)
            .text(
                `Criado em ${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}` +
                (ppc.usuario ? `  ·  Coordenador: ${ppc.usuario.nome}` : ''),
                L, 108
            );

        function secao(titulo) {
            doc.moveDown(0.8);
            const y = doc.y;
            doc.rect(L, y, W, 18).fill(AZUL);
            doc.fill('#ffffff').font('Helvetica-Bold').fontSize(9)
                .text(titulo.toUpperCase(), L + 6, y + 5, { width: W });
            doc.fill(CINZA).font('Helvetica').fontSize(9);
            doc.moveDown(0.4);
        }

        function grade(campos) {
            const colW = W / 2;
            let col = 0;
            let startY = doc.y;
            let maxY = startY;

            campos.forEach(([label, valor]) => {
                const x = L + col * colW;
                const y = col === 0 ? doc.y : startY;

                doc.font('Helvetica-Bold').fontSize(7).fill('#888888')
                    .text(label.toUpperCase(), x, y, { width: colW - 10 });
                doc.font('Helvetica').fontSize(9).fill(CINZA)
                    .text(val(valor), x, doc.y, { width: colW - 10 });

                if (col === 0) {
                    maxY = doc.y;
                    startY = y;
                    col = 1;
                } else {
                    if (doc.y > maxY) maxY = doc.y;
                    doc.y = maxY + 6;
                    startY = doc.y;
                    col = 0;
                }
            });

            if (col === 1) {
                doc.y = maxY + 6;
            }
        }

        // CAMPUS
        secao('Dados do Campus');
        grade([
            ['Nome do Campus', ppc.campusNome],
            ['Cidade', ppc.campusCidade],
            ['CNPJ', ppc.campusCnpj],
            ['CEP', ppc.campusCep],
            ['Bairro', ppc.campusBairro],
            ['Rua', ppc.campusRua],
            ['Número', ppc.campusNumero],
            ['Telefone/Fax', ppc.campusTelefoneFax],
            ['E-mail', ppc.campusEmail],
            ['Ato Legal', ppc.campusAtoLegal],
            ['Site', ppc.campusSite],
        ]);

        // CURSO
        secao('Dados do Curso');
        grade([
            ['Nome do Curso', ppc.cursoNome],
            ['Tipo', ppc.cursoTipo],
            ['Eixo Tecnológico', ppc.cursoEixoTecnologico],
            ['Modalidade', ppc.cursoModalidade],
            ['Oferta', ppc.cursoOferta],
            ['Titulação', ppc.cursoTitulacao],
            ['Estágio', ppc.cursoEstagio],
            ['Semanas Letivas', ppc.cursoSemanasLetivas],
            ['Ativ. Complementares (h)', ppc.cursoAtivComplem],
            ['Integralização Mínima (sem)', ppc.cursoIntegMinima],
            ['Integralização Máxima (sem)', ppc.cursoIntegMaxima],
            ['Formas de Acesso', ppc.cursoFormasAcesso],
            ['Pré-requisitos', ppc.cursoPreRequisitos],
            ['Situação', ppc.cursoSituacao],
            ['Status', ppc.cursoStatus],
        ]);

        // OFERTA
        secao('Oferta e Indicadores');
        grade([
            ['Regime', ppc.ofertaRegime],
            ['Turnos', ppc.ofertaTurnos],
            ['Número de Turmas', ppc.ofertaNumTurmas],
            ['Vagas por Turma', ppc.ofertaVagasTurma],
            ['Vagas por Turno', ppc.ofertaVagasTurno],
            ['Vagas por Semestre', ppc.ofertaVagasSemestre],
            ['Duração (semestres)', ppc.ofertaDuracao],
            ['Conceito do Curso (CC)', ppc.indicadorCC],
            ['CPC', ppc.indicadorCPC],
            ['ENADE', ppc.indicadorEnade],
            ['IGC', ppc.indicadorIGC],
        ]);

        // COMPONENTES
        const componentes = ppc.componentes || [];
        secao(`Componentes Curriculares (${componentes.length})`);

        if (componentes.length === 0) {
            doc.fontSize(9).fill(CINZA).text('Nenhum componente curricular cadastrado.');
        } else {
            doc.addPage();

            const cols = [
                { label: 'Código', w: 55 },
                { label: 'Nome', w: 160 },
                { label: 'Tipo', w: 60 },
                { label: 'Per.', w: 25 },
                { label: 'Cr.T', w: 25 },
                { label: 'Cr.P', w: 25 },
                { label: 'Cr.E', w: 25 },
                { label: 'H.T', w: 25 },
                { label: 'H.P', w: 25 },
                { label: 'H.E', w: 25 },
            ];
            const totalW = cols.reduce((s, c) => s + c.w, 0);
            const startX = L + (W - totalW) / 2;

            function cabecalhoTabela() {
                const hy = doc.y;
                doc.rect(startX, hy, totalW, 14).fill(AZUL);
                let cx = startX;
                doc.fill('#fff').font('Helvetica-Bold').fontSize(7);
                cols.forEach(col => {
                    doc.text(col.label, cx + 2, hy + 4, { width: col.w - 4, ellipsis: true });
                    cx += col.w;
                });
                doc.y = hy + 14;
            }

            cabecalhoTabela();

            componentes.forEach((c, i) => {
                if (doc.y > doc.page.height - 80) {
                    doc.addPage();
                    cabecalhoTabela();
                }

                const ry = doc.y;
                const rh = 14;

                if (i % 2 === 0) doc.rect(startX, ry, totalW, rh).fill('#eaf1fb');
                doc.rect(startX, ry, totalW, rh).stroke(LINHA);

                doc.fill(CINZA).font('Helvetica').fontSize(7.5);
                let cx = startX;
                const valores = [
                    c.codigo, c.nome, c.tipo, c.periodo,
                    c.creditosTeoricos, c.creditosPraticos, c.creditosExtensao,
                    c.horasTeoricas, c.horasPraticas, c.horasExtensao
                ];
                cols.forEach((col, j) => {
                    doc.text(String(valores[j] ?? '—'), cx + 2, ry + 4, { width: col.w - 4, ellipsis: true });
                    cx += col.w;
                });
                doc.y = ry + rh;
            });
        }

        doc.end();
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        if (!res.headersSent) res.status(500).json({ error: 'Erro ao gerar PDF.' });
    }
};

// ==========================================
// EXPORTAÇÃO ODT (OpenDocument Text — formato aberto de documentos)
// ==========================================
/**
 * Gera um arquivo ODT do PPC.
 * O formato ODT é um ZIP contendo XMLs com o conteúdo, estilos e metadados.
 * O JSZip monta o ZIP em memória e envia como buffer na resposta.
 */
exports.downloadOdt = async (req, res) => {
    try {
        const ppc = await buscarPpcCompleto(req.params.id);
        if (!ppc) return res.status(404).json({ error: 'PPC não encontrado.' });

        // Escapa caracteres especiais do XML para evitar quebra do documento
        function esc(s) {
            return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        }

        function par(text, style = 'Text_20_Body') {
            return `<text:p text:style-name="${style}">${esc(text)}</text:p>`;
        }

        function campo(label, valor) {
            return `<text:p text:style-name="Field_20_Label">${esc(label)}</text:p>` +
                   `<text:p text:style-name="Text_20_Body">${esc(val(valor))}</text:p>`;
        }

        function secao(titulo) {
            return `<text:p text:style-name="Heading_20_1">${esc(titulo)}</text:p>`;
        }

        const componentes = ppc.componentes || [];

        const linhasComponentes = componentes.map(c => `
            <table:table-row>
                <table:table-cell><text:p>${esc(c.codigo)}</text:p></table:table-cell>
                <table:table-cell><text:p>${esc(c.nome)}</text:p></table:table-cell>
                <table:table-cell><text:p>${esc(c.tipo)}</text:p></table:table-cell>
                <table:table-cell><text:p>${c.periodo ?? ''}</text:p></table:table-cell>
                <table:table-cell><text:p>${c.creditosTeoricos ?? 0}</text:p></table:table-cell>
                <table:table-cell><text:p>${c.creditosPraticos ?? 0}</text:p></table:table-cell>
                <table:table-cell><text:p>${c.creditosExtensao ?? 0}</text:p></table:table-cell>
                <table:table-cell><text:p>${c.horasTeoricas ?? 0}</text:p></table:table-cell>
                <table:table-cell><text:p>${c.horasPraticas ?? 0}</text:p></table:table-cell>
                <table:table-cell><text:p>${c.horasExtensao ?? 0}</text:p></table:table-cell>
            </table:table-row>`).join('');

        const tabelaComponentes = componentes.length === 0
            ? par('Nenhum componente curricular cadastrado.')
            : `<table:table table:name="Componentes">
                <table:table-header-rows>
                    <table:table-row>
                        ${['Código','Nome','Tipo','Per.','Cr.T','Cr.P','Cr.E','H.T','H.P','H.E']
                            .map(h => `<table:table-cell table:style-name="TableHeader"><text:p text:style-name="Table_20_Heading">${h}</text:p></table:table-cell>`)
                            .join('')}
                    </table:table-row>
                </table:table-header-rows>
                ${linhasComponentes}
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
    <style:style style:name="TableHeader" style:family="table-cell">
        <style:table-cell-properties fo:background-color="#1a5276"/>
    </style:style>
</office:automatic-styles>
<office:body>
<office:text>
    ${par(`IFPE — Projeto Pedagógico de Curso`, 'Title')}
    ${par(ppc.cursoNome || 'PPC sem nome', 'Subtitle')}
    ${par(`Criado em ${new Date(ppc.createdAt).toLocaleDateString('pt-BR')}${ppc.usuario ? '  ·  Coordenador: ' + ppc.usuario.nome : ''}`, 'Text_20_Body')}

    ${secao('Dados do Campus')}
    ${campo('Nome do Campus', ppc.campusNome)}
    ${campo('Cidade', ppc.campusCidade)}
    ${campo('CNPJ', ppc.campusCnpj)}
    ${campo('CEP', ppc.campusCep)}
    ${campo('Bairro', ppc.campusBairro)}
    ${campo('Rua / Número', `${val(ppc.campusRua)}, ${val(ppc.campusNumero)}`)}
    ${campo('Telefone/Fax', ppc.campusTelefoneFax)}
    ${campo('E-mail', ppc.campusEmail)}
    ${campo('Ato Legal', ppc.campusAtoLegal)}
    ${campo('Site', ppc.campusSite)}

    ${secao('Dados do Curso')}
    ${campo('Nome do Curso', ppc.cursoNome)}
    ${campo('Tipo', ppc.cursoTipo)}
    ${campo('Eixo Tecnológico', ppc.cursoEixoTecnologico)}
    ${campo('Modalidade', ppc.cursoModalidade)}
    ${campo('Oferta', ppc.cursoOferta)}
    ${campo('Titulação', ppc.cursoTitulacao)}
    ${campo('Estágio', ppc.cursoEstagio)}
    ${campo('Semanas Letivas', ppc.cursoSemanasLetivas)}
    ${campo('Ativ. Complementares (h)', ppc.cursoAtivComplem)}
    ${campo('Integralização Mínima (sem)', ppc.cursoIntegMinima)}
    ${campo('Integralização Máxima (sem)', ppc.cursoIntegMaxima)}
    ${campo('Formas de Acesso', ppc.cursoFormasAcesso)}
    ${campo('Pré-requisitos', ppc.cursoPreRequisitos)}
    ${campo('Situação', ppc.cursoSituacao)}
    ${campo('Status do Curso', ppc.cursoStatus)}

    ${secao('Oferta e Indicadores')}
    ${campo('Regime', ppc.ofertaRegime)}
    ${campo('Turnos', ppc.ofertaTurnos)}
    ${campo('Número de Turmas', ppc.ofertaNumTurmas)}
    ${campo('Vagas por Turma', ppc.ofertaVagasTurma)}
    ${campo('Vagas por Turno', ppc.ofertaVagasTurno)}
    ${campo('Vagas por Semestre', ppc.ofertaVagasSemestre)}
    ${campo('Duração (semestres)', ppc.ofertaDuracao)}
    ${campo('Conceito do Curso (CC)', ppc.indicadorCC)}
    ${campo('CPC', ppc.indicadorCPC)}
    ${campo('ENADE', ppc.indicadorEnade)}
    ${campo('IGC', ppc.indicadorIGC)}

    ${secao(`Componentes Curriculares (${componentes.length})`)}
    ${tabelaComponentes}
</office:text>
</office:body>
</office:document-content>`;

        const stylesXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-styles
    xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
    xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"
    xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"
    xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"
    office:version="1.3">
<office:styles>
    <style:style style:name="Title" style:family="paragraph" style:class="text">
        <style:text-properties fo:font-size="18pt" fo:font-weight="bold" fo:color="#1a5276"/>
    </style:style>
    <style:style style:name="Subtitle" style:family="paragraph" style:class="text">
        <style:text-properties fo:font-size="13pt" fo:color="#444444"/>
    </style:style>
    <style:style style:name="Heading_20_1" style:family="paragraph" style:display-name="Heading 1" style:class="text">
        <style:paragraph-properties fo:margin-top="0.4cm" fo:margin-bottom="0.1cm" fo:background-color="#1a5276" fo:padding="0.1cm"/>
        <style:text-properties fo:font-size="11pt" fo:font-weight="bold" fo:color="#ffffff"/>
    </style:style>
    <style:style style:name="Field_20_Label" style:family="paragraph" style:display-name="Field Label" style:class="text">
        <style:paragraph-properties fo:margin-top="0.2cm" fo:margin-bottom="0"/>
        <style:text-properties fo:font-size="7pt" fo:font-weight="bold" fo:color="#888888"/>
    </style:style>
    <style:style style:name="Text_20_Body" style:family="paragraph" style:display-name="Text Body" style:class="text">
        <style:paragraph-properties fo:margin-bottom="0"/>
        <style:text-properties fo:font-size="9pt" fo:color="#333333"/>
    </style:style>
    <style:style style:name="Table_20_Heading" style:family="paragraph" style:display-name="Table Heading">
        <style:text-properties fo:font-size="8pt" fo:font-weight="bold" fo:color="#ffffff"/>
    </style:style>
</office:styles>
</office:document-styles>`;

        const manifestXml = `<?xml version="1.0" encoding="UTF-8"?>
<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3">
    <manifest:file-entry manifest:full-path="/" manifest:media-type="application/vnd.oasis.opendocument.text"/>
    <manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/>
    <manifest:file-entry manifest:full-path="styles.xml" manifest:media-type="text/xml"/>
    <manifest:file-entry manifest:full-path="meta.xml" manifest:media-type="text/xml"/>
</manifest:manifest>`;

        const metaXml = `<?xml version="1.0" encoding="UTF-8"?>
<office:document-meta
    xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"
    office:version="1.3">
<office:meta>
    <dc:title>${esc(ppc.cursoNome || 'PPC')}</dc:title>
    <dc:creator>${esc(ppc.usuario?.nome || 'Sistema xPPC')}</dc:creator>
    <meta:creation-date>${new Date().toISOString()}</meta:creation-date>
</office:meta>
</office:document-meta>`;

        const zip = new JSZip();
        zip.file('mimetype', 'application/vnd.oasis.opendocument.text', { compression: 'STORE' });
        zip.file('content.xml', contentXml);
        zip.file('styles.xml', stylesXml);
        zip.file('meta.xml', metaXml);
        zip.folder('META-INF').file('manifest.xml', manifestXml);

        const buffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

        res.setHeader('Content-Type', 'application/vnd.oasis.opendocument.text');
        res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo(ppc, 'odt')}"`);
        res.send(buffer);
    } catch (error) {
        console.error('Erro ao gerar ODT:', error);
        if (!res.headersSent) res.status(500).json({ error: 'Erro ao gerar ODT.' });
    }
};
