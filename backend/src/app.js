// src/app.js
const express = require('express');
const cors = require('cors');

// Importação dos roteadores das entidades
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const ppcRoutes = require('./routes/ppcRoutes');
const componenteRoutes = require('./routes/componenteRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();

// ==========================================
// MIDDLEWARES GLOBAIS
// ==========================================

// Permite que o frontend (mesmo em portas diferentes) acesse a API
app.use(cors());

// Permite que o Express consiga ler requisições com formato JSON no corpo (req.body)
app.use(express.json());

// Permite interpretar dados vindos de formulários padrão (caso necessário)
app.use(express.urlencoded({ extended: true }));

// Log de todas as requisições recebidas
app.use((req, _res, next) => {
    const agora = new Date().toLocaleTimeString('pt-BR');
    console.log(`[${agora}] ${req.method} ${req.originalUrl}`);
    if (req.body && Object.keys(req.body).length > 0) {
        const bodyLog = { ...req.body };
        if (bodyLog.senha) bodyLog.senha = '***';
        console.log('  body:', JSON.stringify(bodyLog));
    }
    next();
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

// ==========================================
// TRATAMENTO DE ROTAS NÃO ENCONTRADAS (404)
// ==========================================
app.use((req, res, next) => {
    res.status(404).json({
        error: "Rota não encontrada",
        message: `O endpoint ${req.originalUrl} com o método ${req.method} não existe nesta API.`
    });
});

// ==========================================
// TRATAMENTO GLOBAL DE ERROS INTERNOS (500)
// ==========================================
app.use((err, req, res, next) => {
    console.error("❌ Erro capturado no Middleware Global:", err.stack);
    res.status(500).json({
        error: "Erro interno do servidor",
        message: err.message || "Ocorreu um problema inesperado no backend do Graduflow."
    });
});

module.exports = app;