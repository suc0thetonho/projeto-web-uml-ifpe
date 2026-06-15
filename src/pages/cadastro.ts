interface IDadosCadastroTemporario {
    nome: string;
    cpf: string;
    dataNascimento: string;
    email: string;
    telefone: string;
    matricula: string;
    curso: string;
    departamento: string;
    campus: string;
    cidade: string;
    estado: string;
}

document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('form-cadastro') as HTMLFormElement;

    formCadastro.addEventListener('submit', (evento: Event) => {
        // Impede o recarregamento da página
        evento.preventDefault();

        // Coleta todos os valores dos inputs pelos IDs
        const dadosParciais: IDadosCadastroTemporario = {
            nome: (document.getElementById('nome') as HTMLInputElement).value,
            cpf: (document.getElementById('cpf') as HTMLInputElement).value,
            dataNascimento: (document.getElementById('dataNascimento') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            telefone: (document.getElementById('telefone') as HTMLInputElement).value,
            matricula: (document.getElementById('matricula') as HTMLInputElement).value,
            curso: (document.getElementById('curso') as HTMLInputElement).value,
            departamento: (document.getElementById('departamento') as HTMLInputElement).value,
            campus: (document.getElementById('campus') as HTMLInputElement).value,
            cidade: (document.getElementById('cidade') as HTMLInputElement).value,
            estado: (document.getElementById('estado') as HTMLInputElement).value,
        };

        // Imprime no console para ter certeza de que capturou tudo certo
        console.log("Dados parciais salvos:", dadosParciais);

        // Salva os dados no sessionStorage (armazenamento temporário da aba)
        sessionStorage.setItem('xppc_dados_cadastro', JSON.stringify(dadosParciais));

        // Redireciona o usuário para a tela de definição de senha
        window.location.href = '../../frontend/pages/defsenha.htm';
    });
});