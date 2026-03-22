import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore"
import { db } from "./firebase"

export interface MissaoVisao {
  missao: string
  visao: string
  proposito: string
  valores: { id: string; valor: string; descricao: string }[]
}

export interface SwotItem { id: string; fator: string; impacto: string }
export interface Swot {
  forcas: SwotItem[]
  fraquezas: SwotItem[]
  oportunidades: SwotItem[]
  ameacas: SwotItem[]
}

export interface KeyResult {
  id: string
  descricao: string
  baseline: string
  meta: string
  unidade: string
  prazo: string
  responsavel: string
  status: string
  percentual: number
}

export interface Objetivo {
  id: string
  titulo: string
  pilar: string
  keyResults: KeyResult[]
}

export interface KPI {
  id: string
  perspectiva: string
  indicador: string
  formula: string
  baseline: string
  meta: string
  unidade: string
  frequencia: string
  responsavel: string
  status: string
}

export interface Acao {
  id: string
  iniciativa: string
  objetivo: string
  porque: string
  responsavel: string
  area: string
  dataInicio: string
  dataFim: string
  onde: string
  como: string
  orcamento: string
  prioridade: string
  status: string
}

export interface ReceitaItem { id: string; categoria: string; meses: number[] }
export interface DespesaItem { id: string; categoria: string; meses: number[] }
export interface Orcamento {
  receitas: ReceitaItem[]
  despesas: DespesaItem[]
}

export interface Risco {
  id: string
  risco: string
  categoria: string
  descricao: string
  probabilidade: number
  impacto: number
  mitigacao: string
  responsavel: string
  prazo: string
  status: string
}

export interface MembroEquipe {
  id: string
  nome: string
  cargo: string
  area: string
  email: string
  okrPrincipal: string
  kpiResponsavel: string
  nivel: string
  status: string
}

export interface RevisaoTrimestral {
  okrsRevisados: string
  kpisPeriodo: string
  acoesConcluidas: string
  desvios: string
  ajustes: string
  proximosPassos: string
}

export interface Acompanhamento {
  q1: RevisaoTrimestral
  q2: RevisaoTrimestral
  q3: RevisaoTrimestral
  q4: RevisaoTrimestral
}

export interface Empresa {
  nome: string
  segmento: string
  cnpj: string
  responsavel: string
  cargo: string
  email: string
  periodo: string
  versao: string
}

// ─── NOVO: Canal dinâmico ─────────────────────────
export interface CanalMensal {
  mes: string
  valor: number
}

export interface Canal {
  id: string
  nome: string
  icone: string        // até 2 letras (ex: "IG", "LI", "YT", "FB")
  cor: string          // hex, ex: "#e1306c"
  unidade: string      // ex: "seg.", "insc.", "R$", "conv.", "%"
  meta_anual: number
  tipo: string         // ex: "Redes Sociais", "Financeiro", "Vendas", "Engajamento"
  descricao: string
  dados_mensais: CanalMensal[]
  ativo: boolean
}

export interface PlanningData {
  empresa: Empresa
  missaoVisao: MissaoVisao
  swot: Swot
  objetivos: Objetivo[]
  kpis: KPI[]
  acoes: Acao[]
  orcamento: Orcamento
  riscos: Risco[]
  equipe: MembroEquipe[]
  acompanhamento: Acompanhamento
  canais: Canal[]
}

const MESES_DEFAULT = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

const makeCanal = (id: string, nome: string, icone: string, cor: string, unidade: string, meta: number, tipo: string, desc: string, valores: number[]): Canal => ({
  id, nome, icone, cor, unidade, meta_anual: meta, tipo, descricao: desc, ativo: true,
  dados_mensais: MESES_DEFAULT.map((mes, i) => ({ mes, valor: valores[i] || 0 }))
})

const EMPTY_REVISAO: RevisaoTrimestral = {
  okrsRevisados: "", kpisPeriodo: "", acoesConcluidas: "",
  desvios: "", ajustes: "", proximosPassos: ""
}

export const DEFAULT_PLANNING_DATA: PlanningData = {
  empresa: { nome: "", segmento: "", cnpj: "", responsavel: "", cargo: "", email: "", periodo: "", versao: "v1.0" },
  missaoVisao: {
    missao: "", visao: "", proposito: "",
    valores: [
      { id: "v1", valor: "", descricao: "" },
      { id: "v2", valor: "", descricao: "" },
      { id: "v3", valor: "", descricao: "" },
    ]
  },
  swot: {
    forcas: [{ id: "f1", fator: "", impacto: "" }],
    fraquezas: [{ id: "fr1", fator: "", impacto: "" }],
    oportunidades: [{ id: "o1", fator: "", impacto: "" }],
    ameacas: [{ id: "a1", fator: "", impacto: "" }],
  },
  objetivos: [{
    id: "obj1", titulo: "", pilar: "P1",
    keyResults: [
      { id: "kr1", descricao: "", baseline: "", meta: "", unidade: "", prazo: "", responsavel: "", status: "Não iniciado", percentual: 0 },
      { id: "kr2", descricao: "", baseline: "", meta: "", unidade: "", prazo: "", responsavel: "", status: "Não iniciado", percentual: 0 },
    ]
  }],
  kpis: [
    { id: "k1", perspectiva: "Financeira", indicador: "", formula: "", baseline: "", meta: "", unidade: "", frequencia: "Mensal", responsavel: "", status: "Ativo" },
    { id: "k2", perspectiva: "Clientes", indicador: "", formula: "", baseline: "", meta: "", unidade: "", frequencia: "Mensal", responsavel: "", status: "Ativo" },
    { id: "k3", perspectiva: "Processos Internos", indicador: "", formula: "", baseline: "", meta: "", unidade: "", frequencia: "Mensal", responsavel: "", status: "Ativo" },
    { id: "k4", perspectiva: "Aprendizado & Crescimento", indicador: "", formula: "", baseline: "", meta: "", unidade: "", frequencia: "Mensal", responsavel: "", status: "Ativo" },
  ],
  acoes: [{
    id: "ac1", iniciativa: "", objetivo: "", porque: "", responsavel: "", area: "",
    dataInicio: "", dataFim: "", onde: "", como: "", orcamento: "", prioridade: "Alta", status: "Não iniciado"
  }],
  orcamento: {
    receitas: [
      { id: "r1", categoria: "Produto A", meses: Array(12).fill(0) },
      { id: "r2", categoria: "Produto B", meses: Array(12).fill(0) },
      { id: "r3", categoria: "Serviço C", meses: Array(12).fill(0) },
    ],
    despesas: [
      { id: "d1", categoria: "Marketing & Vendas", meses: Array(12).fill(0) },
      { id: "d2", categoria: "Operações", meses: Array(12).fill(0) },
      { id: "d3", categoria: "RH & Pessoal", meses: Array(12).fill(0) },
    ]
  },
  riscos: [{
    id: "ri1", risco: "", categoria: "", descricao: "", probabilidade: 1, impacto: 1,
    mitigacao: "", responsavel: "", prazo: "", status: "Ativo"
  }],
  equipe: [{
    id: "eq1", nome: "", cargo: "", area: "", email: "",
    okrPrincipal: "", kpiResponsavel: "", nivel: "Pleno", status: "Ativo"
  }],
  acompanhamento: {
    q1: { ...EMPTY_REVISAO }, q2: { ...EMPTY_REVISAO },
    q3: { ...EMPTY_REVISAO }, q4: { ...EMPTY_REVISAO },
  },
  // Canais padrão — pré-populados com dados do planejamento
  canais: [
    makeCanal("c1","Instagram","IG","#e1306c","conv.",105,"Redes Sociais","Conversão de clientes em seguidores",[10,22,37,54,65,72,78,82,86,89,93,97]),
    makeCanal("c2","LinkedIn","LI","#0077b5","seg.",200,"Redes Sociais","Seguidores líquidos acumulados",[15,32,55,78,98,118,138,158,165,172,185,196]),
    makeCanal("c3","YouTube","YT","#ff4444","insc.",500,"Redes Sociais","Inscritos líquidos acumulados",[8,18,32,52,70,88,108,145,185,280,390,490]),
  ]
}

interface PlanningDataContextValue {
  data: PlanningData
  saveSection: <K extends keyof PlanningData>(section: K, value: PlanningData[K]) => Promise<void>
  loading: boolean
}

const PlanningDataContext = createContext<PlanningDataContextValue | null>(null)
const FIRESTORE_DOC = { collection: "planning", doc: "main" }

export function PlanningDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PlanningData>(DEFAULT_PLANNING_DATA)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ref = doc(db, FIRESTORE_DOC.collection, FIRESTORE_DOC.doc)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData({ ...DEFAULT_PLANNING_DATA, ...snap.data() as PlanningData })
      }
      setLoading(false)
    }, () => setLoading(false))
    return unsub
  }, [])

  const saveSection = useCallback(async <K extends keyof PlanningData>(
    section: K, value: PlanningData[K]
  ) => {
    const ref = doc(db, FIRESTORE_DOC.collection, FIRESTORE_DOC.doc)
    const snap = await getDoc(ref)
    const current = snap.exists() ? snap.data() as PlanningData : DEFAULT_PLANNING_DATA
    await setDoc(ref, { ...current, [section]: value })
  }, [])

  return (
    <PlanningDataContext.Provider value={{ data, saveSection, loading }}>
      {children}
    </PlanningDataContext.Provider>
  )
}

export function usePlanningData() {
  const ctx = useContext(PlanningDataContext)
  if (!ctx) throw new Error("usePlanningData must be inside PlanningDataProvider")
  return ctx
}
