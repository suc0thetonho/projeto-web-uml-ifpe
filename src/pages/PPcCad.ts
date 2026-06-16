export {};

// Interface atualizada para armazenar o objeto PPC completo
interface IPPC {
    nome: string;
    data: string;
    status: string;
    dadosCompletos: any; // Armazena todo o objeto do PPC gerado
}

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tabelaPpcs') as HTMLTableSectionElement;

    // 1. Recupera a lista oficial
    let listaCadastrados: IPPC[] = JSON.parse(sessionStorage.getItem('xppc_lista_cadastrados') || '[]');

    // 2. Verifica se existe um documento recém-gerado no sessionStorage
    const ppcGerado = JSON.parse(sessionStorage.getItem('xppc_ppc_final') || 'null');

    if (ppcGerado && ppcGerado.curso) {
        const jaExiste = listaCadastrados.find(p => p.nome === ppcGerado.curso.nomeCurso);
        
        if (!jaExiste) {
            listaCadastrados.push({
                nome: ppcGerado.curso.nomeCurso,
                data: new Date().toLocaleDateString('pt-BR'),
                status: "Cadastrado",
                dadosCompletos: ppcGerado // Salvando o objeto inteiro aqui!
            });
            sessionStorage.setItem('xppc_lista_cadastrados', JSON.stringify(listaCadastrados));
            sessionStorage.removeItem('xppc_ppc_final');
        }
    }

    // 3. Renderiza a tabela
    // Expondo a função abrirPpc globalmente para o onclick do HTML
    (window as any).abrirPpc = (index: number) => {
        // Salva o PPC selecionado no sessionStorage antes de navegar
        sessionStorage.setItem('xppc_ppc_final', JSON.stringify(listaCadastrados[index].dadosCompletos));
        window.location.href = '../pages/visualizarPpc.html';
    };

    tbody.innerHTML = listaCadastrados.map((ppc, index) => `
        <tr style="cursor: pointer;" onclick="abrirPpc(${index})">
            <td style="padding: 12px; color: #007bff; text-decoration: underline;">
                ${ppc.nome}
            </td>
            <td style="padding: 12px;">${ppc.data}</td>
            <td style="padding: 12px;">
                <span class="status-badge">${ppc.status}</span>
            </td>
        </tr>
    `).join('');
});