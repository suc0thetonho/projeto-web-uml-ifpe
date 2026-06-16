// Modo Claro / Escuro

// Verificar preferência salva
function getThemePreference() {
    return localStorage.getItem('theme') || 'light';
}

// Aplicar tema na página
function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        // Mudar ícones se existirem
        const moonIcon = document.querySelector('.icone-tema[alt="Modo escuro"]');
        const sunIcon = document.querySelector('.icone-tema[alt="Modo claro"]');
        if (moonIcon && sunIcon) {
            moonIcon.style.opacity = '1';
            sunIcon.style.opacity = '0.5';
        }
    } else {
        document.body.classList.remove('dark-theme');
        const moonIcon = document.querySelector('.icone-tema[alt="Modo escuro"]');
        const sunIcon = document.querySelector('.icone-tema[alt="Modo claro"]');
        if (moonIcon && sunIcon) {
            moonIcon.style.opacity = '0.5';
            sunIcon.style.opacity = '1';
        }
    }
    localStorage.setItem('theme', theme);
}

// Alternar tema
function toggleTheme() {
    const currentTheme = getThemePreference();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Inicializar tema ao carregar página
function initTheme() {
    const savedTheme = getThemePreference();
    applyTheme(savedTheme);

    // Adicionar listener ao botão de tema (se existir)
    const themeButton = document.querySelector('.switch-tema');
    if (themeButton) {
        themeButton.addEventListener('click', toggleTheme);
    }
}

// CSS para tema escuro (adicionar dinamicamente)
function addDarkThemeStyles() {
    const style = document.createElement('style');
    style.textContent = `
        body.dark-theme {
            background-color: #1a1a2e;
            color: #eee;
        }
        body.dark-theme .topo,
        body.dark-theme .menu-lateral,
        body.dark-theme .conteudo,
        body.dark-theme .card-esquerdo,
        body.dark-theme .card-formulario,
        body.dark-theme .card-resumo,
        body.dark-theme .card-criar,
        body.dark-theme .card-automacao,
        body.dark-theme .ultimas-atividades,
        body.dark-theme .card-tabela,
        body.dark-theme .perguntas,
        body.dark-theme .card-tutorial {
            background-color: #16213e;
            color: #eee;
            border-color: #0f3460;
        }
        body.dark-theme .topo h1,
        body.dark-theme .cabecalho-conteudo h2,
        body.dark-theme .cabecalho-novo-ppc h1 {
            color: #eee;
        }
        body.dark-theme .grupo-campo input,
        body.dark-theme .grupo-campo select {
            background-color: #0f3460;
            border-color: #1a5276;
            color: #eee;
        }
        body.dark-theme .grupo-campo input::placeholder {
            color: #aaa;
        }
        body.dark-theme .breadcrumb span,
        body.dark-theme .breadcrumb {
            color: #ccc;
        }
        body.dark-theme .item-menu {
            color: #ccc;
            border-bottom-color: #0f3460;
        }
        body.dark-theme .item-menu.ativo {
            border-color: #369831;
            color: #369831;
        }
        body.dark-theme .linha-vertical {
            background-color: #ccc;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar
addDarkThemeStyles();
initTheme();

window.theme = {
    init: initTheme,
    toggle: toggleTheme,
    apply: applyTheme,
};