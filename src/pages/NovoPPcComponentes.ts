// Adiciona export para tratar como módulo e evitar erro de redeclaração
export {};

interface IComponente {
    codigo: string;
    nome: string;
    tipo: string;
    periodo: string;
    totalHoras: string;
}

// Lista que mantém os componentes adicionados na tabela
const listaComponentes: IComponente[] = [];

document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.getElementById('btn-adicionar') as HTMLButtonElement;
    const tbody = document.querySelector('#tabela-componentes tbody') as HTMLTableSectionElement;
    const form = document.getElementById('form-componentes') as HTMLFormElement;

    // 1. Lógica para adicionar componente na tabela
    btnAdd.addEventListener('click', () => {
        const comp: IComponente = {
            codigo: (document.getElementById('comp-codigo') as HTMLInputElement).value,
            nome: (document.getElementById('comp-nome') as HTMLInputElement).value,
            tipo: (document.getElementById('comp-tipo') as HTMLInputElement).value,
            periodo: (document.getElementById('comp-periodo') as HTMLInputElement).value,
            totalHoras: (document.getElementById('comp-horasTeor') as HTMLInputElement).value
        };

        // Validação básica
        if (!comp.codigo || !comp.nome) {
            alert("Por favor, preencha os campos obrigatórios do componente.");
            return;
        }

        listaComponentes.push(comp);
        
        // Adiciona a linha na tabela visual
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${comp.codigo}</td>
            <td>${comp.nome}</td>
            <td>${comp.tipo}</td>
            <td>${comp.periodo}</td>
            <td>-</td>
            <td>${comp.totalHoras}</td>
        `;
        
        form.reset(); // Limpa os campos após adicionar
    });

    // 2. Lógica para Gerar Documento (Unificar JSONs)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // VALIDAÇÃO: Verifica se o usuário adicionou pelo menos um componente
        if (listaComponentes.length === 0) {
            alert("Adicione pelo menos um componente à tabela antes de gerar o documento!");
            return;
        }

        // Recupera os dados das etapas anteriores salvos no sessionStorage
        const etapa1 = JSON.parse(sessionStorage.getItem('xppc_passo1_institucional') || '{}');
        const etapa2 = JSON.parse(sessionStorage.getItem('xppc_passo2_curso') || '{}');
        const etapa3 = JSON.parse(sessionStorage.getItem('xppc_passo3_info') || '{}');

        // Monta o objeto final consolidado usando a lista que já está preenchida!
        const ppcFinal = {
            institucional: etapa1,
            curso: etapa2,
            infoDetalhada: etapa3,
            matrizCurricular: listaComponentes // Usamos a lista, não o formulário vazio
        };

        // Salva e redireciona
        sessionStorage.setItem('xppc_ppc_final', JSON.stringify(ppcFinal));
        
        console.log("JSON Final consolidado:", ppcFinal);
        alert("Documento montado com sucesso!");
        window.location.href = '/frontend/pages/visualizarPpc.html';
    });
});