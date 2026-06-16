## 🚀 Como rodar o projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) instalado
- [Docker](https://www.docker.com/) instalado e rodando

### 2. Subir o banco de dados

Na raiz do projeto, execute:

```bash
docker compose up -d
```

Isso cria um container PostgreSQL com o banco `xppc2` já configurado.

### 3. Configurar o backend

```bash
cd backend
```

Crie o arquivo `.env` com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5433/xppc2"
PORT=3000
```

### 4. Instalar dependências e rodar as migrations

```bash
npm install
npx prisma migrate dev
```

### 5. Iniciar o servidor

```bash
node index.js
```

O servidor estará disponível em `http://localhost:3000`.

---

### Comandos úteis

| Comando | Descrição |
|---|---|
| `docker compose up -d` | Sobe o banco em background |
| `docker compose down` | Para o container (dados preservados) |
| `docker compose down -v` | Para o container e apaga os dados |
| `npx prisma studio` | Abre interface visual do banco em `localhost:5555` |
| `npx prisma migrate dev` | Aplica as migrations e atualiza o banco |

---

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
