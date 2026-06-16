// src/app.js
const express = require('express');
const cors = require('cors');

// Importação dos roteadores das entidades
const usuarioRoutes = require('./routes/usuarioRoutes');
const ppcRoutes = require('./routes/ppcRoutes');

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

// Endpoints relacionados aos Coordenadores/Usuários
app.use('/api/usuarios', usuarioRoutes);

// Endpoints relacionados aos Projetos Pedagógicos de Curso (PPCs)
app.use('/api/ppcs', ppcRoutes);

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