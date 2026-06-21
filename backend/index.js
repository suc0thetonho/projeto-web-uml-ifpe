/**
 * index.js — Ponto de entrada da aplicação.
 * Importa o app Express configurado em src/app.js e inicia o servidor HTTP.
 * A porta é definida no arquivo .env (variável PORT) ou usa 3000 como padrão.
 */
const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor do Graduflow rodando com sucesso!`);
    console.log(`🔗 URL local: http://localhost:${PORT}`);
});