## 📂 Estrutura do Repositório

```text
/
├── doc/                  # Diagramas UML (Casos de Uso, Classe, Sequência)
├── backend/              # Todo o código Node.js (Servidor e API)
│   └── src/
│       ├── controllers/  # Lógica das regras de negócio e comunicação com o ORM
│       └── routes/       # Rotas da API e direcionamento de requisições
├── frontend/             # Todo o código visual (Baseado no Figma)
│   ├── css/              # Arquivos de estilização (Stylesheets)
│   ├── js/               # Scripts e lógica JavaScript do navegador (Fetch)
│   ├── assets/           # Imagens, logos e ícones do projeto
│   └── pages/            # Telas secundárias do sistema (Login, Cadastro, etc.)
├── index.html            # Página principal / Dashboard (Entry point)
├── .gitignore            # Arquivos ignorados pelo Git (node_modules, .env)
└── README.md             # Documentação do projeto
