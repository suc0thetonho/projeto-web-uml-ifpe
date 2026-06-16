-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "telefoneCelular" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "cursoAreaCoordena" TEXT NOT NULL,
    "departamentoSetor" TEXT NOT NULL,
    "campus" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "codigoRecuperacao" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ppcs" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'EM_ANDAMENTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campusNome" TEXT NOT NULL,
    "campusCidade" TEXT NOT NULL,
    "campusCnpj" TEXT NOT NULL,
    "campusCep" TEXT NOT NULL,
    "campusBairro" TEXT NOT NULL,
    "campusRua" TEXT NOT NULL,
    "campusNumero" TEXT NOT NULL,
    "campusTelefoneFax" TEXT NOT NULL,
    "campusEmail" TEXT NOT NULL,
    "campusAtoLegal" TEXT NOT NULL,
    "campusSite" TEXT NOT NULL,
    "cursoTipo" TEXT NOT NULL,
    "cursoNome" TEXT NOT NULL,
    "cursoEixoTecnologico" TEXT NOT NULL,
    "cursoModalidade" TEXT NOT NULL,
    "cursoOferta" TEXT NOT NULL,
    "cursoTitulacao" TEXT NOT NULL,
    "cursoEstagio" TEXT NOT NULL,
    "cursoSemanasLetivas" INTEGER NOT NULL,
    "cursoAtivComplem" INTEGER NOT NULL,
    "cursoIntegMinima" INTEGER NOT NULL,
    "cursoIntegMaxima" INTEGER NOT NULL,
    "cursoFormasAcesso" TEXT NOT NULL,
    "cursoPreRequisitos" TEXT NOT NULL,
    "ofertaRegime" TEXT NOT NULL,
    "ofertaTurnos" TEXT NOT NULL,
    "ofertaNumTurmas" INTEGER NOT NULL,
    "ofertaVagasTurma" INTEGER NOT NULL,
    "ofertaVagasTurno" INTEGER NOT NULL,
    "ofertaVagasSemestre" INTEGER NOT NULL,
    "ofertaDuracao" INTEGER NOT NULL,
    "indicadorCC" TEXT NOT NULL DEFAULT 'Não se aplica',
    "indicadorCPC" TEXT NOT NULL DEFAULT 'Não se aplica',
    "indicadorEnade" TEXT NOT NULL DEFAULT 'Não se aplica',
    "indicadorIGC" TEXT NOT NULL DEFAULT 'Não se aplica',
    "cursoSituacao" TEXT NOT NULL,
    "cursoStatus" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "ppcs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "componentes_curriculares" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "creditosPraticos" INTEGER NOT NULL,
    "creditosTeoricos" INTEGER NOT NULL,
    "creditosExtensao" INTEGER NOT NULL,
    "horasPraticas" INTEGER NOT NULL,
    "horasTeoricas" INTEGER NOT NULL,
    "horasExtensao" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "periodo" INTEGER NOT NULL,
    "preRequisitos" TEXT NOT NULL DEFAULT '',
    "correquisitos" TEXT NOT NULL DEFAULT '',
    "ppcId" INTEGER NOT NULL,

    CONSTRAINT "componentes_curriculares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_matricula_key" ON "usuarios"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "componentes_curriculares_codigo_ppcId_key" ON "componentes_curriculares"("codigo", "ppcId");

-- AddForeignKey
ALTER TABLE "ppcs" ADD CONSTRAINT "ppcs_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "componentes_curriculares" ADD CONSTRAINT "componentes_curriculares_ppcId_fkey" FOREIGN KEY ("ppcId") REFERENCES "ppcs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
