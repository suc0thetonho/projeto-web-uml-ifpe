document.addEventListener('DOMContentLoaded', async () => {
    const tbody = document.getElementById('tabelaPpcsAndamento');
    try {
        // Busca rascunhos no servidor (Backend)
        const response = await fetch('http://localhost:3000/api/ppcs/listar?status=rascunho');
        const rascunhos = await response.json();
        // Renderiza as linhas
        tbody.innerHTML = rascunhos.map(r => `
            <tr style="cursor: pointer;" onclick="window.location.href='../pages/${r.passo}?id=${r.id}'">
                <td style="padding: 12px; color: #28a745;">${r.nome}</td>
                <td style="padding: 12px;">${new Date(r.data).toLocaleDateString('pt-BR')}</td>
                <td style="padding: 12px;">${r.status}</td>
            </tr>
        `).join('');
    }
    catch (error) {
        console.error("Erro ao buscar rascunhos:", error);
        tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar documentos.</td></tr>';
    }
});
export {};
