const { PrismaClient } = require('@prisma/client');

// Linha 5 (ou 3): O construtor limpo e padrão
const prisma = new PrismaClient();

module.exports = prisma;