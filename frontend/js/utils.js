// Funções utilitárias gerais (máscaras de input, validações e notificações)

/**
 * Máscara para CPF: formata "12345678901" → "123.456.789-01"
 * replace(/\D/g, '') remove tudo que não é dígito.
 * As regex seguintes inserem pontos e traço nas posições corretas.
 */
function mascaraCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
}

// Máscara para telefone
function mascaraTelefone(telefone) {
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length <= 10) {
        telefone = telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        telefone = telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}

// Máscara para CEP
function mascaraCEP(cep) {
    cep = cep.replace(/\D/g, '');
    cep = cep.replace(/(\d{5})(\d)/, '$1-$2');
    return cep;
}

// Máscara para CNPJ
function mascaraCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, '');
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2');
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2');
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2');
    return cnpj;
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validação de CPF usando o algoritmo oficial dos dígitos verificadores.
 * 1. Remove caracteres não numéricos
 * 2. Rejeita CPFs com todos os dígitos iguais (ex: 111.111.111-11)
 * 3. Calcula o 1º dígito verificador (posição 10) usando pesos de 10 a 2
 * 4. Calcula o 2º dígito verificador (posição 11) usando pesos de 11 a 2
 * 5. Compara os dígitos calculados com os informados
 */
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    // Rejeita CPFs com todos os dígitos iguais (ex: 000.000.000-00)
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    // Cálculo do 1º dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digito1 = resto >= 10 ? 0 : resto;
    if (parseInt(cpf.charAt(9)) !== digito1) return false;

    // Cálculo do 2º dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digito2 = resto >= 10 ? 0 : resto;
    return parseInt(cpf.charAt(10)) === digito2;
}

/**
 * Exibe uma notificação "toast" no canto inferior direito da tela.
 * O toast é criado dinamicamente via DOM e removido após 3 segundos.
 * Tipos: 'error' (vermelho), 'success' (verde), 'info' (azul).
 */
function mostrarNotificacao(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.textContent = mensagem;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${tipo === 'error' ? '#e74c3c' : tipo === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 9999;
        animation: fadeInOut 3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Adicionar animação CSS para toast
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        15% { opacity: 1; transform: translateY(0); }
        85% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
    }
`;
document.head.appendChild(style);

/**
 * Aplica máscaras automaticamente nos inputs com base no placeholder.
 * Usa querySelectorAll com seletor de atributo para encontrar inputs relevantes.
 * O evento 'input' dispara a cada tecla digitada, reformatando em tempo real.
 */
function aplicarMascaras() {
    // CPF
    document.querySelectorAll('input[placeholder*="CPF"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraCPF(e.target.value);
        });
    });

    // Telefone
    document.querySelectorAll('input[placeholder*="Telefone"], input[placeholder*="celular"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraTelefone(e.target.value);
        });
    });

    // CEP
    document.querySelectorAll('input[placeholder*="CEP"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraCEP(e.target.value);
        });
    });

    // CNPJ
    document.querySelectorAll('input[placeholder*="CNPJ"]').forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraCNPJ(e.target.value);
        });
    });
}

// Inicializar utilitários
document.addEventListener('DOMContentLoaded', () => {
    aplicarMascaras();
});

// Expõe as funções utilitárias como window.utils para uso global
window.utils = {
    mascaraCPF,
    mascaraTelefone,
    mascaraCEP,
    mascaraCNPJ,
    validarEmail,
    validarCPF,
    mostrarNotificacao,
};