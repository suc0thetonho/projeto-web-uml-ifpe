/**
 * src/app.js — Configuração central do Express.
 * Aqui são registrados: middlewares globais, rotas de cada entidade,
 * e os handlers de erro (404 e 500).
 * O Express segue o padrão "middleware pipeline": cada requisição
 * passa por uma cadeia de funções na ordem em que são registradas.
 */
const express = require('express');  // Framework web para Node.js
const cors = require('cors');        // Permite requisições de origens diferentes (Cross-Origin)

// Importação dos roteadores — cada arquivo define as rotas de uma entidade
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ppcRoutes = require('./routes/ppcRoutes');
const componenteRoutes = require('./routes/componenteRoutes');
const exportRoutes = require('./routes/exportRoutes');
const campusRoutes = require('./routes/campusRoutes');
const siteRoutes = require('./routes/siteRoutes');
const periodoRoutes = require('./routes/periodoRoutes');

const app = express(); // Cria a instância da aplicação Express

// ==========================================
// MIDDLEWARES GLOBAIS
// Middlewares são funções executadas em TODA requisição, antes de chegar nas rotas.
// A ordem importa: cors() e json() precisam vir antes das rotas.
// ==========================================

// CORS: permite que o frontend (rodando em porta diferente, ex: 8080)
// consiga acessar a API (porta 3000). Sem isso, o navegador bloqueia.
app.use(cors());

// Faz o Express parsear o corpo das requisições JSON automaticamente.
// Sem isso, req.body seria undefined em POST/PUT.
app.use(express.json());

// Parseia dados de formulários HTML tradicionais (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

/**
 * Middleware de logging: registra no console cada requisição recebida.
 * Útil para debug — mostra método, URL e corpo da requisição.
 * A senha é mascarada (***) por segurança antes de logar.
 * next() passa a requisição para o próximo middleware/rota na cadeia.
 */
app.use((req, _res, next) => {
    const agora = new Date().toLocaleTimeString('pt-BR');
    console.log(`[${agora}] ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        const bodyLog = { ...req.body };
        if (bodyLog.senha) bodyLog.senha = '***';
        console.log('  body:', JSON.stringify(bodyLog));
    }
    next(); // Sem next(), a requisição ficaria "presa" neste middleware
});

// ==========================================
// ROTAS DE DIAGNÓSTICO / SAÚDE DA API
// ==========================================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: "success",
        message: "API Graduflow ativa e respondendo com sucesso!",
        timestamp: new Date()
    });
});

// ==========================================
// VINCULAÇÃO DOS ENDPOINTS (ROTAS)
// app.use('/prefixo', roteador) mapeia todas as rotas do roteador
// sob o prefixo informado. Ex: authRoutes com GET '/' vira GET '/api/auth/'
// ==========================================

// Endpoints de autenticação
app.use('/api/auth', authRoutes);

// Endpoints relacionados aos Coordenadores/Usuários
app.use('/api/usuarios', usuarioRoutes);

// Endpoints relacionados aos Projetos Pedagógicos de Curso (PPCs)
app.use('/api/ppcs', ppcRoutes);

// Endpoints de componentes curriculares (disciplinas) de um PPC
app.use('/api/ppcs/:ppcId/componentes', componenteRoutes);

// Endpoints de exportação (PDF, ODT)
app.use('/api/ppcs', exportRoutes);

// Endpoints de campi (para combobox de campus)
app.use('/api/campi', campusRoutes);

// Endpoints de sites (para combobox de site)
app.use('/api/sites', siteRoutes);

// Endpoints de periodos (para combobox de período)
app.use('/api/periodos', periodoRoutes);

// ==========================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS (404)
// Este middleware só é alcançado se nenhuma rota acima correspondeu à requisição.
// ==========================================
app.use((req, res, next) => {
    res.status(404).json({
        error: "Rota não encontrada",
        message: `O endpoint ${req.originalUrl} com o método ${req.method} não existe nesta API.`
    });
});

// ==========================================
// TRATAMENTO GLOBAL DE ERROS INTERNOS (500)
// Middleware de erro do Express: tem 4 parâmetros (err, req, res, next).
// Captura qualquer exceção não tratada nos controllers.
// ==========================================
app.use((err, req, res, next) => {
    console.error("❌ Erro capturado no Middleware Global:", err.stack);
    res.status(500).json({
        error: "Erro interno do servidor",
        message: err.message || "Ocorreu um problema inesperado no backend do Graduflow."
    });
});

module.exports = app;