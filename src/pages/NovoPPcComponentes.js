const listaComponentes = [];
document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.getElementById('btn-adicionar');
    const btnGerar = document.querySelector('.botao-gerar');
    const tbody = document.querySelector('#tabela-componentes tbody');
    btnAdd.addEventListener('click', () => {
        // Captura de todos os campos
        const comp = {
            codigo: document.getElementById('comp-codigo').value,
            nome: document.getElementById('comp-nome').value,
            credPrat: document.getElementById('comp-credPrat').value,
            credTeor: document.getElementById('comp-credTeor').value,
            credExt: document.getElementById('comp-credExt').value,
            horasPrat: document.getElementById('comp-horasPrat').value,
            horasTeor: document.getElementById('comp-horasTeor').value,
            horasExt: document.getElementById('comp-horasExt').value,
            tipo: document.getElementById('comp-tipo').value,
            periodo: document.getElementById('comp-periodo').value,
            pre: document.getElementById('comp-pre').value,
            correq: document.getElementById('comp-correq').value
        };
        if (!comp.codigo || !comp.nome)
            return alert("Preencha o código e o nome!");
        listaComponentes.push(comp);
        const row = tbody.insertRow();
        row.innerHTML = `
        <td>${comp.codigo}</td>
        <td>${comp.nome}</td>
        <td>${comp.tipo}</td>
        <td>${comp.periodo}</td>
        <td>${comp.credPrat}/${comp.credTeor}/${comp.credExt}</td>
        <td>${comp.horasPrat}/${comp.horasTeor}/${comp.horasExt}</td>
        <td>${comp.pre || '-'} / ${comp.correq || '-'}</td>
        <td><button type="button" class="btn-remover">Remover</button></td>
    `;
        // Lógica de remoção
        row.querySelector('.btn-remover')?.addEventListener('click', () => {
            const index = listaComponentes.indexOf(comp);
            if (index > -1) {
                listaComponentes.splice(index, 1);
                row.remove();
            }
        });
        document.getElementById('form-componentes').reset();
    });
    btnGerar.addEventListener('click', (e) => {
        e.preventDefault();
        if (listaComponentes.length === 0) {
            return alert("Adicione componentes à tabela antes de gerar o documento!");
        }
        const ppcFinal = {
            institucional: JSON.parse(sessionStorage.getItem('xppc_passo1_institucional') || '{}'),
            curso: JSON.parse(sessionStorage.getItem('xppc_passo2_curso') || '{}'),
            infoDetalhada: JSON.parse(sessionStorage.getItem('xppc_passo3_info') || '{}'),
            matrizCurricular: listaComponentes
        };
        sessionStorage.setItem('xppc_ppc_final', JSON.stringify(ppcFinal));
        window.location.href = '../../frontend/pages/visualizarPpc.html';
    });
});
export {};
