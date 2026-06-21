const { PrismaClient } = require('@prisma/client');

/**
 * Instância singleton do Prisma Client — o ORM que conecta ao PostgreSQL.
 * Singleton = uma única instância reutilizada em toda a aplicação,
 * evitando abrir múltiplas conexões com o banco de dados.
 * Todos os controllers importam este arquivo para acessar o banco.
 */
const prisma = new PrismaClient();

module.exports = prisma;