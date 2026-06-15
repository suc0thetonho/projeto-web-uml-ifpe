// ==========================================
// USUÁRIOS E PERFIS
// ==========================================

export interface IPerfil {
  id?: number;
  nome: string;
  descricao: string;
}

export interface IUsuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  vinculoInstitucional: string;
  ativo: boolean;
  perfil?: IPerfil;
}

export interface IParticipacaoPPC {
  id?: number;
  papelNoPPC: string;
  permissaoEdicao: boolean;
  dataEntrada: Date | string;
  usuario?: IUsuario;
  ppc?: IPPC;
}

// ==========================================
// DADOS INSTITUCIONAIS E CURSO
// ==========================================

export interface IDadosInstitucionais {
  id?: number;
  nomeInstituicao: string;
  campus: string;
  cnpj: string;
  endereco: string;
  email: string;
}

export interface ICurso {
  id?: number;
  nome: string;
  tipoCurso: string;
  modalidade: string;
  formaOferta: string;
  titulacao: string;
  turno: string;
  vagas: number;
  duracao: string;
}

// ==========================================
// MATRIZ E COMPONENTES CURRICULARES
// ==========================================

export interface IComponenteCurricular {
  id?: number;
  codigo: string;
  nome: string;
  creditos: number;
  cargaHorariaTeorica: number;
  cargaHorariaPratica: number;
  cargaHorariaExtensao: number;
  periodo: number;
  matrizCurricularId?: number; 
}

export interface IMatrizCurricular {
  id?: number;
  cargaHorariaTotal: number;
  periodoMinimo: number;
  periodoMaximo: number;
  componentes?: IComponenteCurricular[];
}

// ==========================================
// CHECKLIST DE CONFORMIDADE
// ==========================================

export interface IItemChecklist {
  id?: number;
  descricao: string;
  status: string;
  observacao: string;
  checklistId?: number;
}

export interface IChecklistConformidade {
  id?: number;
  status: string;
  dataVerificacao: Date | string;
  itens?: IItemChecklist[];
}

// ==========================================
// GERAÇÃO DE DOCUMENTOS E HISTÓRICO
// ==========================================

export interface ITemplatePPC {
  id?: number;
  nome: string;
  versao: string;
  dataAtualizacao: Date | string;
}

export interface IDocumentoGerado {
  id?: number;
  tipoArquivo: string;
  caminhoArquivo: string;
  dataGeracao: Date | string;
  template?: ITemplatePPC;
  ppcId?: number;
}

export interface IHistoricoAlteracao {
  id?: number;
  acao: string;
  dataHora: Date | string;
  descricao: string;
  usuarioId?: number;
  ppcId?: number;
}

// ==========================================
// ENTIDADE CENTRAL: PPC
// ==========================================

export interface IPPC {
  id?: number;
  titulo: string;
  status: string;
  dataCriacao: Date | string;
  dataAtualizacao: Date | string;
  
  // Relacionamentos (Agregações e Composições)
  curso?: ICurso;
  dadosInstitucionais?: IDadosInstitucionais;
  matrizCurricular?: IMatrizCurricular;
  checklistConformidade?: IChecklistConformidade;
  participantes?: IParticipacaoPPC[];
  documentosGerados?: IDocumentoGerado[];
  historico?: IHistoricoAlteracao[];
}