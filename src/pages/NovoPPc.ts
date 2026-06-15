// Interface para mapear os dados da etapa 1
interface IDadosInstitucionaisPPC {
    nomeCampus: string;
    cnpj: string;
    cidade: string;
    cep: string;
    bairro: string;
    rua: string;
    numero: string;
    telefone: string;
    email: string;
    atoLegal: string;
    sitio: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const formNovoPpc = document.getElementById('form-novo-ppc') as HTMLFormElement;
    const btnRascunho = document.getElementById('btn-rascunho') as HTMLButtonElement;
    const btnCancelar = document.getElementById('btn-cancelar') as HTMLButtonElement;

    // Função para extrair os dados da tela
    const coletarDadosTela = (): IDadosInstitucionaisPPC => {
        return {
            nomeCampus: (document.getElementById('nomeCampus') as HTMLInputElement).value,
            cnpj: (document.getElementById('cnpj') as HTMLInputElement).value,
            cidade: (document.getElementById('cidade') as HTMLInputElement).value,
            cep: (document.getElementById('cep') as HTMLInputElement).value,
            bairro: (document.getElementById('bairro') as HTMLInputElement).value,
            rua: (document.getElementById('rua') as HTMLInputElement).value,
            numero: (document.getElementById('numero') as HTMLInputElement).value,
            telefone: (document.getElementById('telefone') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            atoLegal: (document.getElementById('atoLegal') as HTMLInputElement).value,
            sitio: (document.getElementById('sitio') as HTMLInputElement).value,
        };
    };

    // Ação do botão "Próximo" (Submit do form)
    formNovoPpc.addEventListener('submit', (evento: Event) => {
        evento.preventDefault();
        
        const dadosPasso1 = coletarDadosTela();
        
        // Salva os dados do Passo 1 no sessionStorage
        sessionStorage.setItem('xppc_passo1_institucional', JSON.stringify(dadosPasso1));
        
        // Vai para a tela 2
        window.location.href = '/frontend/pages/NovoPPcCurso.html';
    });

    // Ação do botão "Salvar rascunho"
    btnRascunho.addEventListener('click', () => {
        const dadosPasso1 = coletarDadosTela();
        
        // Salva os dados no localStorage para persistência de rascunho
        localStorage.setItem('xppc_raschunho_institucional', JSON.stringify(dadosPasso1));
        alert('Rascunho salvo com sucesso no seu navegador!');
    });

    // Ação do botão "Cancelar" (Redirecionamento fixo e seguro)
    btnCancelar.addEventListener('click', () => {
        window.location.href = '../../frontend/pages/paginainicial.html';
    });
});