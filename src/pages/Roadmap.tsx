import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import { useFontSettings } from "../lib/FontSettingsContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import {
  Calendar, Target, CheckCircle2, Clock, AlertCircle,
  X, TrendingUp, ListChecks, Users, DollarSign,
  MapPin, HelpCircle, Zap, ChevronRight, Shield,
  Play, Pause, BarChart2, Filter, Eye
} from "lucide-react"

// ─── DADOS PRÉ-CARREGADOS DO PDF ─────────────────
const ACOES_PDF = [
  {
    id: "pdf1",
    iniciativa: "Lançamento do LinkedIn Corporativo",
    objetivo: "Ativar canal para autoridade e relacionamento B2B, alinhado às séries LE3/LE5",
    porque: "Metas de autoridade humana e multiplataformas (LI/YT no H1)",
    responsavel: "Gestor de Marketing e Social Media (lead), Conteúdo, Design, Diretoria",
    area: "Marketing",
    dataInicio: "Abr/26",
    dataFim: "Mai/26",
    onde: "LinkedIn (company page) e YouTube (company page)",
    como: "Criação e ativação de página LI, posicionamento Sábio/Herói, grid de 6 peças base, calendário de 8 semanas. Artes de comunicação interna de lançamento e plano editorial.",
    orcamento: "Não se aplica",
    prioridade: "Alta",
    status: "Em andamento",
    metas: "8 peças publicadas em maio · ER médio ≥2% · 1 case leve até fim de maio",
    kpis: "Convites enviados, confirmações, gravações feitas, peças geradas",
  },
  {
    id: "pdf2",
    iniciativa: "Ativação do Canal YouTube com Rotina Editorial",
    objetivo: "Ativar canal mixchannel para autoridade e relacionamento B2B via vídeo",
    porque: "OKR 3 — Prova Social H2 e Autoridade via vídeo (LE3/LE5)",
    responsavel: "Vídeo (lead), Conteúdo, Design, Social Media, Diretoria",
    area: "Marketing",
    dataInicio: "Abr/26",
    dataFim: "Jun/26",
    onde: "YouTube (company page)",
    como: "Setup canal, artes, roteiros modulares LE3/LE5, 2 vídeos longos (mai/jun), 8 Shorts, gravação e edição. Captação leve (bastidores) e CTA padrão.",
    orcamento: "R$ 3k–5k (equipamentos/locações se necessário)",
    prioridade: "Alta",
    status: "Em andamento",
    metas: "1 vídeo longo em maio · 8 Shorts em maio · CTR end screen ≥1,5%",
    kpis: "Vídeos publicados, visualizações 7 dias, retenção média, CTR end screen",
  },
  {
    id: "pdf3",
    iniciativa: "Pipeline de Prova Social — Coleta e Preparação H2",
    objetivo: "Garantir 3 depoimentos/cases em vídeo no H2 + 6 posts antes/depois no ano",
    porque: "Consolidar autoridade e relacionamento — OKR3 H2",
    responsavel: "Vídeo (lead), Comercial/CS (contato clientes), Conteúdo (roteiros), Diretoria",
    area: "Conteúdo",
    dataInicio: "Abr/26",
    dataFim: "Jun/26",
    onde: "On-site e remoto por estado",
    como: "Shortlist de clientes, convites, termos de consentimento, roteiros (5 perguntas), agendamentos, captação B-roll, edição. 3 versões de prova: vídeo 60–90s, carrossel, quote estático.",
    orcamento: "Interno — deslocamentos pontuais",
    prioridade: "Média",
    status: "Não iniciado",
    metas: "6 clientes convidados até Mai S2 · 3 confirmações até Jun S1 · 2 gravações até Jun S4",
    kpis: "Convites enviados, confirmações, gravações feitas, peças geradas",
  },
]

const PRIORIDADE_CONFIG: Record<string, { color: string; bg: string }> = {
  "Alta":    { color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
  "Média":   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)"  },
  "Baixa":   { color: "#22c55e", bg: "rgba(34,197,94,0.12)"   },
  "Crítica": { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)"  },
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; pct: number }> = {
  "Não iniciado": { color: "#6b7280", bg: "rgba(107,114,128,0.1)",  icon: Clock,        pct: 0   },
  "Em andamento": { color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  icon: TrendingUp,   pct: 50  },
  "Concluído":    { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   icon: CheckCircle2, pct: 100 },
  "Atrasado":     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   icon: AlertCircle,  pct: 30  },
}

// ─── TIMELINE ────────────────────────────────────
function Timeline({ acoes, darkMode, accent, onSelect }: {
  acoes: any[]; darkMode: boolean; accent: any; onSelect: (a: any) => void
}) {
  const cardBg   = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  // Ordem por status
  const ordered = [...acoes].sort((a, b) => {
    const order = ["Em andamento", "Não iniciado", "Concluído", "Atrasado"]
    return order.indexOf(a.status) - order.indexOf(b.status)
  })

  return (
    <div className="relative pl-8">
      {/* Trilho vertical */}
      <div className="absolute left-3 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: `linear-gradient(to bottom, ${accent.from || "#3b82f6"}, transparent)` }} />

      <div className="space-y-3">
        {ordered.map((acao, i) => {
          const st   = STATUS_CONFIG[acao.status] || STATUS_CONFIG["Não iniciado"]
          const prio = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
          const StIcon = st.icon
          const isActive = acao.status === "Em andamento"

          return (
            <div key={acao.id || i} className="relative group">
              {/* Dot */}
              <div className="absolute -left-8 top-4 w-6 h-6 rounded-full flex items-center justify-center z-10"
                style={{ background: st.bg, border: `2px solid ${st.color}` }}>
                <StIcon size={10} style={{ color: st.color }} />
                {isActive && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{ background: st.color }} />
                )}
              </div>

              {/* Card */}
              <div
                className="rounded-2xl p-4 cursor-pointer transition-all duration-200"
                style={{
                  background: cardBg,
                  border: `1px solid ${isActive ? st.color + "35" : cardBorder}`,
                  boxShadow: isActive ? `0 4px 20px ${st.color}12` : "none",
                }}
                onClick={() => onSelect(acao)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = `0 8px 28px ${prio.color}14`
                  e.currentTarget.style.borderColor = prio.color + "40"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = isActive ? `0 4px 20px ${st.color}12` : "none"
                  e.currentTarget.style.borderColor = isActive ? st.color + "35" : cardBorder
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: st.bg, color: st.color }}>
                        {acao.status}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: prio.bg, color: prio.color }}>
                        {acao.prioridade}
                      </span>
                      {acao.area && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${darkMode ? "bg-white/06 text-white/40" : "bg-black/04 text-gray-400"}`}>
                          {acao.area}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {acao.iniciativa}
                    </p>
                    {acao.objetivo && (
                      <p className={`text-xs mt-0.5 line-clamp-1 ${darkMode ? "text-white/40" : "text-gray-500"}`}>
                        {acao.objetivo}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {acao.dataFim && (
                      <div className={`flex items-center gap-1 text-[10px] ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                        <Calendar size={10} />
                        {acao.dataFim}
                      </div>
                    )}
                    <ChevronRight size={14} style={{ color: prio.color }} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] mb-1"
                    style={{ color: darkMode ? "rgba(255,255,255,0.28)" : "#9ca3af" }}>
                    <span>{acao.responsavel?.split(",")[0]}</span>
                    <span style={{ color: st.color }}>{st.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden"
                    style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${st.pct}%`, background: `linear-gradient(90deg, ${st.color}88, ${st.color})` }} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── ACAO CARD (kanban style) ─────────────────────
function AcaoKanbanCard({ acao, darkMode, onClick }: { acao: any; darkMode: boolean; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  const prio = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
  const st   = STATUS_CONFIG[acao.status]   || STATUS_CONFIG["Não iniciado"]

  return (
    <div
      className="rounded-xl p-3 cursor-pointer transition-all duration-200"
      style={{
        background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)",
        border: `1px solid ${hov ? prio.color + "45" : (darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)")}`,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 6px 20px ${prio.color}14` : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      <p className={`text-xs font-bold mb-1.5 leading-tight ${darkMode ? "text-white/90" : "text-gray-800"}`}>
        {acao.iniciativa?.slice(0, 50)}{(acao.iniciativa?.length || 0) > 50 ? "…" : ""}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: prio.bg, color: prio.color }}>
          {acao.prioridade}
        </span>
        {acao.dataFim && (
          <span className={`text-[10px] flex items-center gap-0.5 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
            <Calendar size={9} />{acao.dataFim}
          </span>
        )}
      </div>
      {acao.responsavel && (
        <p className={`text-[10px] mt-1.5 truncate ${darkMode ? "text-white/28" : "text-gray-400"}`}>
          {acao.responsavel.split(",")[0]}
        </p>
      )}
      <div className="mt-2 h-0.5 rounded-full overflow-hidden"
        style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full" style={{ width: `${st.pct}%`, background: prio.color }} />
      </div>

      {/* Ver detalhes — aparece no hover */}
      <div className="overflow-hidden transition-all duration-250"
        style={{ maxHeight: hov ? 28 : 0, opacity: hov ? 1 : 0, marginTop: hov ? 8 : 0 }}>
        <div className="flex items-center justify-center gap-1 py-1 rounded-lg text-[10px] font-semibold"
          style={{ background: prio.color + "18", color: prio.color }}>
          <Eye size={10} /> Ver Detalhes
        </div>
      </div>
    </div>
  )
}

// ─── DETAIL MODAL ────────────────────────────────
function DetailModal({ acao, darkMode, accent, onClose }: {
  acao: any; darkMode: boolean; accent: any; onClose: () => void
}) {
  const prio = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
  const st   = STATUS_CONFIG[acao.status]   || STATUS_CONFIG["Não iniciado"]
  const StIcon = st.icon
  const bg = darkMode ? "#0a1628" : "#ffffff"

  const fields5W2H = [
    { icon: Target,     label: "O Quê?",         value: acao.iniciativa, color: accent.from || "#3b82f6" },
    { icon: HelpCircle, label: "Por Quê?",        value: acao.porque,    color: "#8b5cf6" },
    { icon: Users,      label: "Quem?",           value: acao.responsavel, color: "#3b82f6" },
    { icon: Calendar,   label: "Quando?",         value: acao.dataInicio && acao.dataFim ? `${acao.dataInicio} → ${acao.dataFim}` : acao.dataFim || acao.dataInicio, color: "#f59e0b" },
    { icon: MapPin,     label: "Onde?",           value: acao.onde,      color: "#ec4899" },
    { icon: ListChecks, label: "Como?",           value: acao.como,      color: "#22c55e" },
    { icon: DollarSign, label: "Quanto?",         value: acao.orcamento, color: "#f97316" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bg, maxHeight: "92vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sticky top-0 z-10"
          style={{ background: bg, borderBottom: `1px solid ${prio.color}22` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                  style={{ background: st.bg, color: st.color }}>
                  <StIcon size={9} /> {acao.status}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: prio.bg, color: prio.color }}>
                  Prioridade {acao.prioridade}
                </span>
                {acao.area && (
                  <span className={`text-[10px] px-2.5 py-1 rounded-full ${darkMode ? "bg-white/08 text-white/45" : "bg-gray-100 text-gray-500"}`}>
                    {acao.area}
                  </span>
                )}
              </div>
              <h2 className={`text-xl font-extrabold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                {acao.iniciativa}
              </h2>
              {acao.objetivo && (
                <p className={`text-sm mt-1.5 leading-relaxed ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                  {acao.objetivo}
                </p>
              )}
            </div>
            <button onClick={onClose}
              className={`p-2 rounded-xl flex-shrink-0 mt-1 ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={16} />
            </button>
          </div>

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5"
              style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
              <span>Progresso</span>
              <span className="font-bold" style={{ color: st.color }}>{st.pct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden"
              style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${st.pct}%`, background: `linear-gradient(90deg, ${st.color}80, ${st.color})` }} />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* 5W2H */}
          <div>
            <p className={`text-[11px] font-bold uppercase tracking-widest mb-3 ${darkMode ? "text-white/35" : "text-gray-400"}`}>
              Metodologia 5W2H
            </p>
            <div className="grid grid-cols-1 gap-2">
              {fields5W2H.map((f, i) => {
                const Icon = f.icon
                if (!f.value) return null
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-3.5"
                    style={{ background: f.color + "08", border: `1px solid ${f.color}18` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: f.color + "18" }}>
                      <Icon size={14} style={{ color: f.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                        style={{ color: f.color }}>{f.label}</p>
                      <p className={`text-sm leading-relaxed ${darkMode ? "text-white/78" : "text-gray-700"}`}>
                        {f.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Metas */}
          {acao.metas && (
            <div className="rounded-xl p-4"
              style={{ background: (accent.from || "#3b82f6") + "0a", border: `1px solid ${accent.from || "#3b82f6"}20` }}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 size={13} style={{ color: accent.from || "#3b82f6" }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent.from || "#3b82f6" }}>
                  Metas da Ação
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {acao.metas.split("·").map((m: string, i: number) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{ background: (accent.from || "#3b82f6") + "15", color: darkMode ? "rgba(255,255,255,0.75)" : "#374151" }}>
                    {m.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* KPIs */}
          {acao.kpis && (
            <div className="rounded-xl p-4"
              style={{ background: "#22c55e0a", border: "1px solid rgba(34,197,94,0.18)" }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={13} className="text-green-500" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-green-500">KPIs de Monitoramento</p>
              </div>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-white/65" : "text-gray-600"}`}>
                {acao.kpis}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────
export default function Roadmap({ darkMode = false, accentGradient }: PageProps) {
  const { fontSettings } = useFontSettings()
  const { data: planningData } = usePlanningData()
  const [selectedAcao, setSelectedAcao] = useState<any | null>(null)
  const [filterStatus, setFilterStatus] = useState("Todos")
  const [filterArea, setFilterArea]     = useState("Todas")
  const [view, setView] = useState<"timeline" | "kanban">("timeline")

  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }

  const cardStyle = {
    background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
  }

  const titleStyle = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#fff" : "#111827",
    fontWeight: 800, marginBottom: 4,
  }
  const subStyle = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: 20,
  }

  // Mescla PDF + Dev Mode (Dev Mode tem prioridade se preenchido)
  const devAcoes = planningData.acoes.filter(a => a.iniciativa?.trim())
  const acoes = devAcoes.length > 0 ? devAcoes : ACOES_PDF

  const areas     = ["Todas", ...Array.from(new Set(acoes.map(a => a.area).filter(Boolean)))]
  const statusOpts = ["Todos", ...Array.from(new Set(acoes.map(a => a.status)))]

  const acoesFiltradas = acoes.filter(a => {
    const okS = filterStatus === "Todos" || a.status === filterStatus
    const okA = filterArea   === "Todas" || a.area   === filterArea
    return okS && okA
  })

  // Stats
  const total       = acoes.length
  const concluidas  = acoes.filter(a => a.status === "Concluído").length
  const emAndamento = acoes.filter(a => a.status === "Em andamento").length
  const naoIniciado = acoes.filter(a => a.status === "Não iniciado").length
  const atrasadas   = acoes.filter(a => a.status === "Atrasado").length
  const progresso   = total > 0 ? Math.round(
    acoes.reduce((s, a) => s + (STATUS_CONFIG[a.status]?.pct || 0), 0) / total
  ) : 0

  // Kanban columns
  const kanbanCols = [
    { status: "Não iniciado", color: "#6b7280", icon: Clock        },
    { status: "Em andamento", color: "#3b82f6", icon: TrendingUp   },
    { status: "Concluído",    color: "#22c55e", icon: CheckCircle2 },
    { status: "Atrasado",     color: "#ef4444", icon: AlertCircle  },
  ]

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      <HeroHeader accentGradient={accentGradient} />

      {/* ── SUMMARY STRIP ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Total",        value: total,       color: accent.from || "#3b82f6", icon: ListChecks  },
          { label: "Concluídas",   value: concluidas,  color: "#22c55e",                icon: CheckCircle2 },
          { label: "Em Andamento", value: emAndamento, color: "#3b82f6",                icon: Play        },
          { label: "Não Iniciado", value: naoIniciado, color: "#6b7280",                icon: Pause       },
          { label: "Atrasadas",    value: atrasadas,   color: "#ef4444",                icon: AlertCircle },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="rounded-2xl p-4 flex items-center gap-3" style={cardStyle}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + "18" }}>
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className={`text-[10px] mt-0.5 ${darkMode ? "text-white/38" : "text-gray-500"}`}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── PROGRESSO GERAL ───────────────────────── */}
      <div className="rounded-2xl p-5 md:p-6" style={cardStyle}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className={`font-extrabold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              Progresso Geral do Plano
            </p>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-white/38" : "text-gray-400"}`}>
              {devAcoes.length > 0 ? `${acoes.length} ações · Dev Mode → Plano de Ação` : "3 ações pré-carregadas do PDF de planejamento"}
            </p>
          </div>
          <p className="text-4xl font-extrabold" style={{ color: accent.from || "#3b82f6" }}>
            {progresso}%
          </p>
        </div>

        {/* Segmented progress */}
        <div className="flex gap-1 h-3 rounded-full overflow-hidden">
          {[
            { pct: total > 0 ? (concluidas / total) * 100 : 0,  color: "#22c55e" },
            { pct: total > 0 ? (emAndamento / total) * 100 : 0, color: "#3b82f6" },
            { pct: total > 0 ? (naoIniciado / total) * 100 : 0, color: "#6b7280" },
            { pct: total > 0 ? (atrasadas / total) * 100 : 0,   color: "#ef4444" },
          ].filter(s => s.pct > 0).map((s, i) => (
            <div key={i} className="h-full rounded-full transition-all duration-700"
              style={{ width: `${s.pct}%`, background: s.color }} />
          ))}
        </div>

        <div className="flex gap-4 mt-3 flex-wrap">
          {[
            { label: "Concluído",    color: "#22c55e", count: concluidas  },
            { label: "Em Andamento", color: "#3b82f6", count: emAndamento },
            { label: "Não Iniciado", color: "#6b7280", count: naoIniciado },
            { label: "Atrasado",     color: "#ef4444", count: atrasadas   },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
              <span className={`text-[11px] ${darkMode ? "text-white/45" : "text-gray-500"}`}>
                {l.label}: <strong style={{ color: l.color }}>{l.count}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTROLES ─────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* View toggle */}
        <div className="flex gap-1 p-1 rounded-xl"
          style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
          {[
            { id: "timeline", label: "Timeline",  icon: TrendingUp },
            { id: "kanban",   label: "Kanban",    icon: BarChart2  },
          ].map(v => {
            const Icon = v.icon
            return (
              <button key={v.id} onClick={() => setView(v.id as any)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: view === v.id ? (accent.css || "#3b82f6") : "transparent",
                  color: view === v.id ? "#fff" : (darkMode ? "rgba(255,255,255,0.45)" : "#6b7280"),
                }}>
                <Icon size={12} /> {v.label}
              </button>
            )
          })}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap items-center">
          <Filter size={13} style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }} />
          {[
            { opts: statusOpts, val: filterStatus, set: setFilterStatus },
            { opts: areas,      val: filterArea,   set: setFilterArea   },
          ].map((f, i) => (
            <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium outline-none"
              style={{
                background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
                color: darkMode ? "rgba(255,255,255,0.6)" : "#374151",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
              }}>
              {f.opts.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* ── VIEWS ─────────────────────────────────── */}
      {acoesFiltradas.length === 0 ? (
        <div className="rounded-2xl p-10 text-center"
          style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
          <Zap size={32} className="mx-auto mb-3 opacity-25" style={{ color: accent.from }} />
          <p className={`text-sm ${darkMode ? "text-white/35" : "text-gray-400"}`}>
            Nenhuma ação com os filtros selecionados.
          </p>
        </div>
      ) : view === "timeline" ? (
        <section>
          <p style={titleStyle}>Timeline de Execução</p>
          <p style={subStyle}>Clique em qualquer ação para ver os detalhes completos do 5W2H</p>
          <Timeline acoes={acoesFiltradas} darkMode={darkMode} accent={accent} onSelect={setSelectedAcao} />
        </section>
      ) : (
        <section>
          <p style={titleStyle}>Kanban por Status</p>
          <p style={subStyle}>Arraste mentalmente · hover para ver detalhes · clique para abrir</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kanbanCols.map(col => {
              const ColIcon = col.icon
              const items = acoesFiltradas.filter(a => a.status === col.status)
              return (
                <div key={col.status} className="rounded-2xl p-4"
                  style={{ background: col.color + "08", border: `1px solid ${col.color}20`, minHeight: 200 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ColIcon size={14} style={{ color: col.color }} />
                      <span className="text-xs font-bold" style={{ color: col.color }}>{col.status}</span>
                    </div>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold"
                      style={{ background: col.color + "20", color: col.color }}>
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((a, i) => (
                      <AcaoKanbanCard key={a.id || i} acao={a} darkMode={darkMode} onClick={() => setSelectedAcao(a)} />
                    ))}
                    {items.length === 0 && (
                      <p className={`text-[11px] text-center py-6 ${darkMode ? "text-white/18" : "text-gray-300"}`}>
                        Nenhuma ação
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {selectedAcao && (
        <DetailModal acao={selectedAcao} darkMode={darkMode} accent={accent} onClose={() => setSelectedAcao(null)} />
      )}
    </div>
  )
}
