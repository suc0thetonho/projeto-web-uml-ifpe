// index.js
const app = require('./src/app');

// Puxa a porta do arquivo .env ou usa a 3000 como padrão
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor do Graduflow rodando com sucesso!`);
    console.log(`🔗 URL local: http://localhost:${PORT}`);
});