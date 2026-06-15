# xPPC — Sistema de Gerenciamento de PPC

Sistema web para criação e automatização de Projetos Pedagógicos de Curso (PPC) do IFPE.

---

## Requisitos

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) v14+

---

## Como rodar

### 1. Banco de dados

**Opção A — Docker (recomendado):**

```bash
docker compose up -d
```

**Opção B — PostgreSQL local:**

```sql
CREATE DATABASE xppc;
```

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edite o `.env` com as suas credenciais:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/xppc
JWT_SECRET=uma_chave_secreta_longa_e_aleatoria
JWT_EXPIRATION=8h
```

Instale as dependências e inicie o servidor:

```bash
npm install
npm run dev      # desenvolvimento (nodemon)
npm start        # produção
```

As tabelas são criadas automaticamente na primeira execução.

### 3. Frontend

Abra o `index.html` na raiz do projeto com um servidor HTTP local. Exemplo com a extensão **Live Server** do VS Code, ou:

```bash
npx serve .
```

Acesse `http://localhost:3000` (ou a porta que o servidor indicar) no navegador.

---

## Estrutura do repositório

```text
/
├── backend/                   # Servidor Node.js (API REST)
│   ├── .env.example           # Variáveis de ambiente (copiar para .env)
│   ├── package.json
│   └── src/
│       ├── server.js          # Entry point — Express, CORS, inicializa o banco
│       ├── db.js              # Conexão com PostgreSQL e criação das tabelas
│       ├── middleware/
│       │   └── auth.middleware.js   # Validação de JWT
│       ├── routes/
│       │   ├── auth.routes.js       # POST /api/auth/login, /esqueceu-senha, etc.
│       │   ├── usuario.routes.js    # POST /api/usuarios (cadastro)
│       │   └── ppc.routes.js        # CRUD /api/ppcs e /api/ppcs/:id/componentes
│       └── controllers/
│           ├── auth.controller.js   # Login, recuperação e definição de senha
│           ├── usuario.controller.js # Cadastro de coordenador
│           └── ppc.controller.js    # Criação e gestão de PPCs
│
├── frontend/                  # Interface web
│   ├── assets/                # Imagens, logos e ícones
│   ├── css/                   # Folhas de estilo por página
│   ├── js/                    # Lógica JavaScript
│   │   ├── api.js             # Helper compartilhado (fetch com JWT, requireAuth)
│   │   ├── tema.js            # Toggle dark/light mode
│   │   ├── auth.js            # Login
│   │   ├── cadastro.js        # Cadastro de coordenador
│   │   ├── defsenha.js        # Definir senha (primeiro acesso e recuperação)
│   │   ├── esqueceuSenha.js   # Solicitar recuperação de senha
│   │   ├── confirmarCod.js    # Verificar código de recuperação
│   │   ├── dashboard.js       # Página inicial (contadores de PPC)
│   │   ├── ppcs.js            # Listagem de PPCs cadastrados e em andamento
│   │   └── novoPpc.js         # Formulário multi-etapa de criação de PPC
│   └── pages/                 # Páginas HTML
│       ├── login.html
│       ├── cadastro.html
│       ├── defsenha.html
│       ├── esqueceuSenha.html
│       ├── ConfirmarCod.html
│       ├── paginaInicial.html   # Dashboard principal
│       ├── NovoPPc.html         # Etapa 1 — Dados do campus
│       ├── NovoPPcCurso.html    # Etapa 2 — Dados do curso (parte 1)
│       ├── NovoPPcCurso2.html   # Etapa 3 — Dados do curso (parte 2)
│       ├── NovoPPcComponentes.html  # Etapa 4 — Componentes curriculares
│       ├── PPcCad.html          # PPCs concluídos
│       ├── PPcAndamento.html    # PPCs em andamento
│       ├── ajuda.html
│       └── contatos.html
│
├── index.html                 # Tela de entrada (escolha entre login e cadastro)
├── .gitignore
└── README.md
```

---

## Rotas da API

| Método | Rota | Autenticação | Descrição |
|--------|------|:---:|-----------|
| POST | `/api/auth/login` | — | Autentica e retorna JWT |
| POST | `/api/auth/esqueceu-senha` | — | Envia código de recuperação |
| POST | `/api/auth/verificar-token` | — | Valida código de recuperação |
| POST | `/api/auth/definir-senha` | — | Redefine senha via código |
| POST | `/api/usuarios` | — | Cadastra novo coordenador |
| POST | `/api/usuarios/:id/senha` | — | Define senha no primeiro acesso |
| GET  | `/api/usuarios/perfil` | JWT | Retorna dados do coordenador logado |
| GET  | `/api/ppcs` | JWT | Lista PPCs do usuário (`?status=rascunho\|andamento\|concluido`) |
| GET  | `/api/ppcs/:id` | JWT | Detalha um PPC |
| POST | `/api/ppcs` | JWT | Cria um PPC |
| PUT  | `/api/ppcs/:id` | JWT | Atualiza um PPC |
| PATCH | `/api/ppcs/:id/rascunho` | JWT | Salva como rascunho |
| GET  | `/api/ppcs/:id/componentes` | JWT | Lista componentes curriculares |
| POST | `/api/ppcs/:id/componentes` | JWT | Adiciona componente curricular |

---

## Banco de dados

Três tabelas criadas automaticamente:

- **`usuarios`** — coordenadores cadastrados
- **`ppcs`** — dados completos do PPC (campus, curso, conceitos de avaliação)
- **`componentes_curriculares`** — disciplinas vinculadas a um PPC
