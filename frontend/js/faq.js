// Perguntas Frequentes - Página de Ajuda

const perguntasFrequentes = [
    {
        pergunta: "Como criar um novo PPC?",
        resposta: "Acesse o menu 'Novo PPC' e preencha as etapas: Dados do Campus, Dados do Curso, Oferta e Indicadores. Você pode salvar rascunho a qualquer momento."
    },
    {
        pergunta: "Como adicionar componentes curriculares?",
        resposta: "Após preencher os dados básicos do PPC, você será direcionado para a página de Componentes Curriculares, onde pode adicionar disciplinas com código, nome, créditos e pré-requisitos."
    },
    {
        pergunta: "O que fazer se esquecer a senha?",
        resposta: "Clique em 'Esqueceu sua senha?' na tela de login. Você receberá um código de recuperação no seu email institucional para redefinir a senha."
    },
    {
        pergunta: "Como visualizar PPCs em andamento?",
        resposta: "Acesse o menu 'PPCs em andamento' para ver todos os projetos que você ainda não concluiu. Você pode clicar em cada um para continuar a edição."
    },
    {
        pergunta: "Posso editar um PPC depois de concluído?",
        resposta: "Sim. Na lista de 'PPCs cadastrados', você pode visualizar e editar qualquer PPC, mesmo os já concluídos."
    },
    {
        pergunta: "Como funciona a automatização do PPC?",
        resposta: "O sistema calcula automaticamente cargas horárias, verifica pendências e ajuda a gerar textos acadêmicos padronizados baseados nas informações preenchidas."
    }
];

// Carregar perguntas na página
function carregarPerguntas() {
    const container = document.getElementById('listaPerguntas');
    if (!container) return;

    container.innerHTML = perguntasFrequentes.map((item, index) => `
        <div class="pergunta-item" style="margin-bottom: 15px; border-bottom: 1px solid var(--border); padding-bottom: 10px;">
            <a href="#" onclick="toggleResposta(${index}); return false;" style="display: block; font-weight: bold;">
                ❓ ${item.pergunta}
            </a>
            <div id="resposta-${index}" class="resposta-pergunta" style="display: none; margin-top: 8px; padding-left: 20px; color: var(--text-muted);">
                ${item.resposta}
            </div>
        </div>
    `).join('');
}

// Alternar visibilidade da resposta
function toggleResposta(index) {
    const respostaDiv = document.getElementById(`resposta-${index}`);
    if (respostaDiv) {
        const isVisible = respostaDiv.style.display === 'block';
        respostaDiv.style.display = isVisible ? 'none' : 'block';
    }
}

// Estilos adicionais para FAQ
function addFaqStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pergunta-item a {
            text-decoration: none;
            color: #0056c7;
            font-size: 14px;
        }
        .pergunta-item a:hover {
            text-decoration: underline;
        }
        .resposta-pergunta {
            font-size: 13px;
            line-height: 1.4;
        }
        html.dark-theme .pergunta-item a {
            color: var(--text);
        }
    `;
    document.head.appendChild(style);
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('ajuda')) {
        addFaqStyles();
        carregarPerguntas();
    }
});

window.faq = {
    toggleResposta,
    carregar: carregarPerguntas,
};