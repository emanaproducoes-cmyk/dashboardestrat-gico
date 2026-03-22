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
    como: "Shortlist de clientes, convites, termos de consentimento, roteiros (5 perguntas), agendamentos, captação B-roll, edição. 3 versões: vídeo 60–90s, carrossel, quote estático.",
    orcamento: "Interno — deslocamentos pontuais",
    prioridade: "Média",
    status: "Não iniciado",
    metas: "6 clientes convidados até Mai S2 · 3 confirmações até Jun S1 · 2 gravações até Jun S4",
    kpis: "Convites enviados, confirmações, gravações feitas, peças geradas",
  },
]

const PRIORIDADE_CONFIG: Record<string, { color: string; bg: string }> = {
  "Alta":    { color: "#ef4444", bg: "rgba(239,68,68,0.15)"   },
  "Média":   { color: "#f59e0b", bg: "rgba(245,158,11,0.15)"  },
  "Baixa":   { color: "#22c55e", bg: "rgba(34,197,94,0.15)"   },
  "Crítica": { color: "#8b5cf6", bg: "rgba(139,92,246,0.15)"  },
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: any; pct: number }> = {
  "Não iniciado": { color: "#9ca3af", bg: "rgba(156,163,175,0.15)", icon: Clock,        pct: 0   },
  "Em andamento": { color: "#3b82f6", bg: "rgba(59,130,246,0.15)",  icon: TrendingUp,   pct: 50  },
  "Concluído":    { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   icon: CheckCircle2, pct: 100 },
  "Atrasado":     { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   icon: AlertCircle,  pct: 30  },
}

// ─── TIMELINE ────────────────────────────────────
function Timeline({ acoes, darkMode, accent, onSelect }: {
  acoes: any[]; darkMode: boolean; accent: any; onSelect: (a: any) => void
}) {
  const cardBg     = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)"

  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-3 bottom-3 w-0.5 rounded-full"
        style={{ background: `linear-gradient(to bottom, ${accent.from || "#3b82f6"}, transparent)` }} />

      <div className="space-y-3">
        {acoes.map((acao, i) => {
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
                  border: `1px solid ${isActive ? st.color + "40" : cardBorder}`,
                  boxShadow: isActive ? `0 4px 20px ${st.color}14` : "none",
                }}
                onClick={() => onSelect(acao)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = `0 8px 28px ${prio.color}18`
                  e.currentTarget.style.borderColor = prio.color + "50"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = isActive ? `0 4px 20px ${st.color}14` : "none"
                  e.currentTarget.style.borderColor = isActive ? st.color + "40" : cardBorder
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ background: st.bg, color: st.color }}>
                        <StIcon size={9} />{acao.status}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: prio.bg, color: prio.color }}>
                        {acao.prioridade}
                      </span>
                      {acao.area && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
                            color: darkMode ? "rgba(255,255,255,0.65)" : "#4b5563",
                          }}>
                          {acao.area}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {acao.iniciativa}
                    </p>
                    {acao.objetivo && (
                      <p className="text-xs mt-0.5 line-clamp-1"
                        style={{ color: darkMode ? "rgba(255,255,255,0.50)" : "#6b7280" }}>
                        {acao.objetivo}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {acao.dataFim && (
                      <div className="flex items-center gap-1 text-[10px]"
                        style={{ color: darkMode ? "rgba(255,255,255,0.38)" : "#9ca3af" }}>
                        <Calendar size={10} />{acao.dataFim}
                      </div>
                    )}
                    <ChevronRight size={14} style={{ color: prio.color }}
                      className="opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between mb-1"
                    style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>
                    <span className="text-[10px]">{acao.responsavel?.split(",")[0]}</span>
                    <span className="text-[10px] font-bold" style={{ color: st.color }}>{st.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden"
                    style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${st.pct}%`, background: `linear-gradient(90deg,${st.color}80,${st.color})` }} />
                  </div>
                </div>

                {/* Ver detalhes — aparece no hover */}
                <div className="overflow-hidden transition-all duration-200 group-hover:max-h-10 max-h-0">
                  <div className="mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold"
                    style={{
                      background: prio.color + "22",
                      color: prio.color,
                      border: `1px solid ${prio.color}45`,
                    }}>
                    <Eye size={12} /> Ver Detalhes
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

// ─── KANBAN CARD ─────────────────────────────────
function AcaoKanbanCard({ acao, darkMode, onClick }: {
  acao: any; darkMode: boolean; onClick: () => void
}) {
  const [hov, setHov] = useState(false)
  const prio = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
  const st   = STATUS_CONFIG[acao.status]   || STATUS_CONFIG["Não iniciado"]

  return (
    <div
      className="rounded-xl p-3 cursor-pointer transition-all duration-200"
      style={{
        background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.92)",
        border: `1px solid ${hov ? prio.color + "50" : (darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.07)")}`,
        transform: hov ? "translateY(-2px)" : "none",
        boxShadow: hov ? `0 6px 20px ${prio.color}18` : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      <p className="text-xs font-bold mb-1.5 leading-tight"
        style={{ color: darkMode ? "rgba(255,255,255,0.90)" : "#1f2937" }}>
        {acao.iniciativa?.slice(0, 50)}{(acao.iniciativa?.length || 0) > 50 ? "…" : ""}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: prio.bg, color: prio.color }}>
          {acao.prioridade}
        </span>
        {acao.dataFim && (
          <span className="text-[10px] flex items-center gap-0.5"
            style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>
            <Calendar size={9} />{acao.dataFim}
          </span>
        )}
      </div>
      {acao.responsavel && (
        <p className="text-[10px] mt-1.5 truncate"
          style={{ color: darkMode ? "rgba(255,255,255,0.38)" : "#6b7280" }}>
          {acao.responsavel.split(",")[0]}
        </p>
      )}
      <div className="mt-2 h-0.5 rounded-full overflow-hidden"
        style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
        <div className="h-full rounded-full" style={{ width: `${st.pct}%`, background: prio.color }} />
      </div>

      <div className="overflow-hidden transition-all duration-200"
        style={{ maxHeight: hov ? 32 : 0, opacity: hov ? 1 : 0, marginTop: hov ? 8 : 0 }}>
        <div className="flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-bold"
          style={{
            background: prio.color + "25",
            color: prio.color,
            border: `1px solid ${prio.color}50`,
          }}>
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
  const prio   = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
  const st     = STATUS_CONFIG[acao.status]   || STATUS_CONFIG["Não iniciado"]
  const StIcon = st.icon
  const bg     = darkMode ? "#0a1628" : "#ffffff"

  const fields5W2H = [
    { icon: Target,     label: "O Quê?",       value: acao.iniciativa,  color: accent.from || "#3b82f6" },
    { icon: HelpCircle, label: "Por Quê?",      value: acao.porque,      color: "#8b5cf6" },
    { icon: Users,      label: "Quem?",         value: acao.responsavel, color: "#3b82f6" },
    { icon: Calendar,   label: "Quando?",       value: acao.dataInicio && acao.dataFim ? `${acao.dataInicio} → ${acao.dataFim}` : acao.dataFim || acao.dataInicio, color: "#f59e0b" },
    { icon: MapPin,     label: "Onde?",         value: acao.onde,        color: "#ec4899" },
    { icon: ListChecks, label: "Como?",         value: acao.como,        color: "#22c55e" },
    { icon: DollarSign, label: "Quanto?",       value: acao.orcamento,   color: "#f97316" },
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
          style={{ background: bg, borderBottom: `1px solid ${prio.color}25` }}>
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
                  <span className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
                      color: darkMode ? "rgba(255,255,255,0.70)" : "#374151",
                    }}>
                    {acao.area}
                  </span>
                )}
              </div>
              <h2 className={`text-xl font-extrabold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
                {acao.iniciativa}
              </h2>
              {acao.objetivo && (
                <p className="text-sm mt-1.5 leading-relaxed"
                  style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "#6b7280" }}>
                  {acao.objetivo}
                </p>
              )}
            </div>
            <button onClick={onClose}
              className={`p-2 rounded-xl flex-shrink-0 mt-1 ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: darkMode ? "rgba(255,255,255,0.38)" : "#9ca3af" }}>Progresso</span>
              <span className="font-bold" style={{ color: st.color }}>{st.pct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden"
              style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${st.pct}%`, background: `linear-gradient(90deg,${st.color}80,${st.color})` }} />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* 5W2H */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest mb-3"
              style={{ color: darkMode ? "rgba(255,255,255,0.38)" : "#9ca3af" }}>
              Metodologia 5W2H
            </p>
            <div className="grid grid-cols-1 gap-2">
              {fields5W2H.map((f, i) => {
                const Icon = f.icon
                if (!f.value) return null
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-3.5"
                    style={{ background: f.color + "0c", border: `1px solid ${f.color}20` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: f.color + "20" }}>
                      <Icon size={14} style={{ color: f.color }} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                        style={{ color: f.color }}>{f.label}</p>
                      <p className="text-sm leading-relaxed"
                        style={{ color: darkMode ? "rgba(255,255,255,0.82)" : "#374151" }}>
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
              style={{ background: (accent.from || "#3b82f6") + "0c", border: `1px solid ${accent.from || "#3b82f6"}25` }}>
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 size={13} style={{ color: accent.from || "#3b82f6" }} />
                <p className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: accent.from || "#3b82f6" }}>Metas da Ação</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {acao.metas.split("·").map((m: string, i: number) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                    style={{
                      background: (accent.from || "#3b82f6") + "18",
                      color: darkMode ? "rgba(255,255,255,0.82)" : "#1f2937",
                    }}>
                    {m.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* KPIs */}
          {acao.kpis && (
            <div className="rounded-xl p-4"
              style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.22)" }}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={13} style={{ color: "#22c55e" }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#22c55e" }}>
                  KPIs de Monitoramento
                </p>
              </div>
              <p className="text-sm leading-relaxed"
                style={{ color: darkMode ? "rgba(255,255,255,0.72)" : "#374151" }}>
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
    color: darkMode ? "rgba(255,255,255,0.50)" : "#6b7280",
    marginBottom: 20,
  }

  const devAcoes = planningData.acoes.filter(a => a.iniciativa?.trim())
  const acoes    = devAcoes.length > 0 ? devAcoes : ACOES_PDF

  const areas      = ["Todas", ...Array.from(new Set(acoes.map(a => a.area).filter(Boolean)))]
  const statusOpts = ["Todos", ...Array.from(new Set(acoes.map(a => a.status)))]

  const acoesFiltradas = acoes.filter(a => {
    const okS = filterStatus === "Todos" || a.status === filterStatus
    const okA = filterArea   === "Todas" || a.area   === filterArea
    return okS && okA
  })

  const total       = acoes.length
  const concluidas  = acoes.filter(a => a.status === "Concluído").length
  const emAndamento = acoes.filter(a => a.status === "Em andamento").length
  const naoIniciado = acoes.filter(a => a.status === "Não iniciado").length
  const atrasadas   = acoes.filter(a => a.status === "Atrasado").length
  const progresso   = total > 0
    ? Math.round(acoes.reduce((s, a) => s + (STATUS_CONFIG[a.status]?.pct || 0), 0) / total)
    : 0

  const kanbanCols = [
    { status: "Não iniciado", color: "#9ca3af", icon: Clock        },
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
          { label: "Total",        value: total,       color: accent.from || "#3b82f6", icon: ListChecks   },
          { label: "Concluídas",   value: concluidas,  color: "#22c55e",                icon: CheckCircle2 },
          { label: "Em Andamento", value: emAndamento, color: "#3b82f6",                icon: Play         },
          { label: "Não Iniciado", value: naoIniciado, color: "#9ca3af",                icon: Pause        },
          { label: "Atrasadas",    value: atrasadas,   color: "#ef4444",                icon: AlertCircle  },
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
                <p className="text-[10px] mt-0.5"
                  style={{ color: darkMode ? "rgba(255,255,255,0.38)" : "#6b7280" }}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── PROGRESSO GERAL DO ROADMAP ────────────── */}
      <div className="rounded-2xl p-5 md:p-6" style={cardStyle}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className={`font-extrabold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>
              Progresso Geral do Roadmap
            </p>
            <p className="text-xs mt-0.5"
              style={{ color: darkMode ? "rgba(255,255,255,0.38)" : "#9ca3af" }}>
              {`${acoes.length} ação(ões) · Dev Mode → Plano de Ação`}
            </p>
          </div>
          <p className="text-4xl font-extrabold" style={{ color: accent.from || "#3b82f6" }}>
            {progresso}%
          </p>
        </div>

        {/* Barra contínua com degradê */}
        <div className="h-3 rounded-full overflow-hidden"
          style={{ background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progresso}%`,
              background: `linear-gradient(90deg, ${accent.from || "#3b82f6"}, ${accent.to || "#8b5cf6"})`,
            }} />
        </div>

        <div className="flex gap-5 mt-3 flex-wrap">
          {[
            { label: "Concluído",    color: "#22c55e", count: concluidas  },
            { label: "Em Andamento", color: "#3b82f6", count: emAndamento },
            { label: "Não Iniciado", color: "#9ca3af", count: naoIniciado },
            { label: "Atrasado",     color: "#ef4444", count: atrasadas   },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: l.color }} />
              <span className="text-[11px]"
                style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "#6b7280" }}>
                {l.label}: <strong style={{ color: l.color }}>{l.count}</strong>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CONTROLES ─────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 p-1 rounded-xl"
          style={{ background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
          {[
            { id: "timeline", label: "Matriz 5W2H", icon: TrendingUp },
            { id: "kanban",   label: "Kanban",      icon: BarChart2  },
          ].map(v => {
            const Icon = v.icon
            return (
              <button key={v.id} onClick={() => setView(v.id as any)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: view === v.id ? (accent.css || "#3b82f6") : "transparent",
                  color: view === v.id ? "#fff" : (darkMode ? "rgba(255,255,255,0.50)" : "#6b7280"),
                }}>
                <Icon size={12} /> {v.label}
              </button>
            )
          })}
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <Filter size={13} style={{ color: darkMode ? "rgba(255,255,255,0.30)" : "#9ca3af" }} />
          {[
            { opts: statusOpts, val: filterStatus, set: setFilterStatus },
            { opts: areas,      val: filterArea,   set: setFilterArea   },
          ].map((f, i) => (
            <select key={i} value={f.val} onChange={e => f.set(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium outline-none"
              style={{
                background: darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)",
                color: darkMode ? "rgba(255,255,255,0.65)" : "#374151",
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"}`,
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
          <p className="text-sm" style={{ color: darkMode ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>
            Nenhuma ação com os filtros selecionados.
          </p>
        </div>
      ) : view === "timeline" ? (
        <section>
          <p style={titleStyle}>Matriz 5W2H</p>
          <p style={subStyle}>Clique em qualquer ação para ver os detalhes completos</p>
          <Timeline acoes={acoesFiltradas} darkMode={darkMode} accent={accent} onSelect={setSelectedAcao} />
        </section>
      ) : (
        <section>
          <p style={titleStyle}>Kanban por Status</p>
          <p style={subStyle}>Hover para ver detalhes · clique para abrir</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kanbanCols.map(col => {
              const ColIcon = col.icon
              const items = acoesFiltradas.filter(a => a.status === col.status)
              return (
                <div key={col.status} className="rounded-2xl p-4"
                  style={{ background: col.color + "0a", border: `1px solid ${col.color}22`, minHeight: 200 }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <ColIcon size={14} style={{ color: col.color }} />
                      <span className="text-xs font-bold" style={{ color: col.color }}>{col.status}</span>
                    </div>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold"
                      style={{ background: col.color + "22", color: col.color }}>
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((a, i) => (
                      <AcaoKanbanCard key={a.id || i} acao={a} darkMode={darkMode} onClick={() => setSelectedAcao(a)} />
                    ))}
                    {items.length === 0 && (
                      <p className="text-[11px] text-center py-6"
                        style={{ color: darkMode ? "rgba(255,255,255,0.20)" : "#d1d5db" }}>
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

      {/* ── VER DETALHES DO ROADMAP ───────────────── */}
      <section>
        <p style={titleStyle}>Detalhes do Roadmap</p>
        <p style={subStyle}>Visão consolidada · status · responsáveis · prazos · clique para abrir</p>
        <div className="rounded-2xl overflow-hidden" style={cardStyle}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{
                  background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                  borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                }}>
                  {["Iniciativa","Área","Prioridade","Status","Início","Prazo",""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: darkMode ? "rgba(255,255,255,0.40)" : "#9ca3af" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {acoes.map((acao, i) => {
                  const prio   = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
                  const st     = STATUS_CONFIG[acao.status]   || STATUS_CONFIG["Não iniciado"]
                  const StIcon = st.icon
                  return (
                    <tr key={acao.id || i}
                      className="cursor-pointer transition-colors"
                      style={{ borderTop: i > 0 ? `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}` : "none" }}
                      onClick={() => setSelectedAcao(acao)}
                      onMouseEnter={e => (e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold"
                          style={{ color: darkMode ? "rgba(255,255,255,0.88)" : "#1f2937" }}>
                          {acao.iniciativa?.slice(0, 42)}{(acao.iniciativa?.length || 0) > 42 ? "…" : ""}
                        </p>
                        {acao.objetivo && (
                          <p className="text-[10px] mt-0.5 line-clamp-1"
                            style={{ color: darkMode ? "rgba(255,255,255,0.38)" : "#9ca3af" }}>
                            {acao.objetivo?.slice(0, 52)}…
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)",
                            color: darkMode ? "rgba(255,255,255,0.65)" : "#4b5563",
                          }}>
                          {acao.area || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: prio.bg, color: prio.color }}>
                          {acao.prioridade}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
                          style={{ background: st.bg, color: st.color }}>
                          <StIcon size={9} />{acao.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[11px]"
                        style={{ color: darkMode ? "rgba(255,255,255,0.48)" : "#6b7280" }}>
                        {acao.dataInicio || "—"}
                      </td>
                      <td className="px-4 py-3 text-[11px]"
                        style={{ color: darkMode ? "rgba(255,255,255,0.48)" : "#6b7280" }}>
                        {acao.dataFim || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                          style={{
                            background: (accent.from || "#3b82f6") + "22",
                            color: accent.from || "#3b82f6",
                            border: `1px solid ${accent.from || "#3b82f6"}40`,
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = (accent.from || "#3b82f6") + "38")}
                          onMouseLeave={e => (e.currentTarget.style.background = (accent.from || "#3b82f6") + "22")}
                        >
                          <Eye size={10} /> Ver
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selectedAcao && (
        <DetailModal acao={selectedAcao} darkMode={darkMode} accent={accent} onClose={() => setSelectedAcao(null)} />
      )}
    </div>
  )
}
