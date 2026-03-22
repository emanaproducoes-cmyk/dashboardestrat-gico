import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import { useFontSettings } from "../lib/FontSettingsContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import {
  Calendar, Target, CheckCircle2, Clock, AlertCircle,
  ChevronRight, X, Eye, Filter, TrendingUp, ListChecks,
  Users, DollarSign, MapPin, HelpCircle, Zap
} from "lucide-react"

const PRIORIDADE_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  "Alta":    { color: "#ef4444", bg: "rgba(239,68,68,0.12)",    label: "Alta"    },
  "Média":   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)",   label: "Média"   },
  "Baixa":   { color: "#22c55e", bg: "rgba(34,197,94,0.12)",    label: "Baixa"   },
  "Crítica": { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)",   label: "Crítica" },
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  "Não iniciado": { color: "#6b7280", bg: "rgba(107,114,128,0.1)",  label: "Não iniciado", icon: Clock        },
  "Em andamento": { color: "#3b82f6", bg: "rgba(59,130,246,0.12)",  label: "Em andamento", icon: TrendingUp   },
  "Concluído":    { color: "#22c55e", bg: "rgba(34,197,94,0.12)",   label: "Concluído",    icon: CheckCircle2 },
  "Atrasado":     { color: "#ef4444", bg: "rgba(239,68,68,0.12)",   label: "Atrasado",     icon: AlertCircle  },
  "Cancelado":    { color: "#9ca3af", bg: "rgba(156,163,175,0.1)",  label: "Cancelado",    icon: X            },
}

const MILESTONES_DEFAULT = [
  { date: "Mar/26", label: "Lançamento LinkedIn + YouTube",        status: "done"        },
  { date: "Abr/26", label: "Primeira rodada de conteúdo (4 sem.)", status: "done"        },
  { date: "Jun/26", label: "Início de captação de cases",          status: "in_progress" },
  { date: "Jul/26", label: "Lançamento seção 'Histórias'",         status: "pending"     },
  { date: "Set/26", label: "Publicação dos 3–4 cases de sucesso",  status: "pending"     },
  { date: "Nov/26", label: "Revisão e otimização estratégica",     status: "pending"     },
  { date: "Dez/26", label: "Consolidação de autoridade anual",     status: "pending"     },
]

// ─── TIMELINE COMPONENT ──────────────────────────
function RoadmapTimeline({
  milestones, darkMode, accent
}: {
  milestones: typeof MILESTONES_DEFAULT
  darkMode: boolean
  accent: any
}) {
  const statusStyle = (s: string) => {
    if (s === "done")        return { dot: "#22c55e", ring: "rgba(34,197,94,0.25)",  line: "#22c55e" }
    if (s === "in_progress") return { dot: accent.from || "#3b82f6", ring: (accent.from || "#3b82f6") + "30", line: accent.from || "#3b82f6" }
    return { dot: darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)", ring: "transparent", line: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }
  }

  return (
    <div className="relative">
      {/* Linha central */}
      <div className="absolute left-5 top-5 bottom-5 w-0.5"
        style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />

      <div className="space-y-2">
        {milestones.map((m, i) => {
          const s = statusStyle(m.status)
          const isDone = m.status === "done"
          const isProgress = m.status === "in_progress"
          return (
            <div key={i} className="relative flex items-center gap-4 pl-2">
              {/* Dot */}
              <div className="relative flex-shrink-0 z-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: s.ring, border: `2px solid ${s.dot}` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: s.dot }} />
                </div>
                {isProgress && (
                  <div className="absolute inset-0 rounded-full animate-ping opacity-40"
                    style={{ background: s.dot }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex items-center justify-between py-2 px-4 rounded-xl transition-all"
                style={{
                  background: isProgress
                    ? (accent.from || "#3b82f6") + "10"
                    : isDone
                    ? "rgba(34,197,94,0.06)"
                    : (darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"),
                  border: `1px solid ${isProgress ? (accent.from || "#3b82f6") + "25" : isDone ? "rgba(34,197,94,0.15)" : (darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")}`,
                }}>
                <div>
                  <p className={`text-sm font-semibold ${isDone ? "line-through opacity-60" : ""} ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {m.label}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full`}
                    style={{
                      background: s.ring || (darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                      color: s.dot
                    }}>
                    {m.date}
                  </span>
                  {isDone && <CheckCircle2 size={14} className="text-green-500" />}
                  {isProgress && <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent.from || "#3b82f6" }} />}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── AÇÃO CARD ───────────────────────────────────
function AcaoCard({
  acao, darkMode, accent, onClick
}: {
  acao: any; darkMode: boolean; accent: any; onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const prio = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
  const stat = STATUS_CONFIG[acao.status]   || STATUS_CONFIG["Não iniciado"]
  const StatusIcon = stat.icon

  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{
        background: cardBg,
        border: `1px solid ${hovered ? prio.color + "40" : cardBorder}`,
        boxShadow: hovered ? `0 8px 28px ${prio.color}12, 0 0 0 1px ${prio.color}25` : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className={`text-sm font-bold leading-tight flex-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
          {acao.iniciativa || "Sem título"}
        </p>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
          style={{ background: prio.bg, color: prio.color }}>
          {prio.label}
        </span>
      </div>

      {/* Objetivo */}
      {acao.objetivo && (
        <div className="flex items-start gap-1.5 mb-3">
          <Target size={11} className="flex-shrink-0 mt-0.5" style={{ color: accent.from || "#3b82f6" }} />
          <p className={`text-[11px] leading-tight ${darkMode ? "text-white/45" : "text-gray-500"}`}>
            {acao.objetivo}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
          style={{ background: stat.bg, color: stat.color }}>
          <StatusIcon size={9} />
          {stat.label}
        </span>
        {acao.area && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${darkMode ? "bg-white/06 text-white/40" : "bg-black/04 text-gray-400"}`}>
            {acao.area}
          </span>
        )}
      </div>

      {/* Datas + responsável */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {acao.responsavel && (
            <div className={`flex items-center gap-1 ${darkMode ? "text-white/35" : "text-gray-400"}`}>
              <Users size={10} />
              <span className="text-[10px]">{acao.responsavel}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {acao.dataFim && (
            <div className={`flex items-center gap-1 ${darkMode ? "text-white/35" : "text-gray-400"}`}>
              <Calendar size={10} />
              <span className="text-[10px]">{acao.dataFim}</span>
            </div>
          )}
          <ChevronRight size={12} style={{ color: prio.color }} className="opacity-0 group-hover:opacity-100" />
        </div>
      </div>

      {/* Orçamento */}
      {acao.orcamento && acao.orcamento !== "0" && acao.orcamento !== "" && (
        <div className="mt-2 pt-2 flex items-center gap-1.5"
          style={{ borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` }}>
          <DollarSign size={10} style={{ color: "#22c55e" }} />
          <span className="text-[10px] font-bold" style={{ color: "#22c55e" }}>
            {acao.orcamento}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── AÇÃO DETAIL MODAL ───────────────────────────
function AcaoDetailModal({
  acao, darkMode, accent, onClose
}: {
  acao: any; darkMode: boolean; accent: any; onClose: () => void
}) {
  const prio = PRIORIDADE_CONFIG[acao.prioridade] || PRIORIDADE_CONFIG["Média"]
  const stat = STATUS_CONFIG[acao.status]   || STATUS_CONFIG["Não iniciado"]
  const StatusIcon = stat.icon
  const bg = darkMode ? "#0a1628" : "#ffffff"

  const fields5W2H = [
    { icon: HelpCircle, label: "Por quê?",      value: acao.porque,      color: "#8b5cf6" },
    { icon: Users,      label: "Quem?",          value: acao.responsavel, color: "#3b82f6" },
    { icon: Calendar,   label: "Quando?",        value: acao.dataInicio && acao.dataFim ? `${acao.dataInicio} → ${acao.dataFim}` : acao.dataFim || acao.dataInicio, color: "#f59e0b" },
    { icon: MapPin,     label: "Onde?",          value: acao.onde,        color: "#ec4899" },
    { icon: ListChecks, label: "Como?",          value: acao.como,        color: "#22c55e" },
    { icon: DollarSign, label: "Quanto custa?",  value: acao.orcamento,   color: "#f97316" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bg, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sticky top-0 z-10"
          style={{ background: bg, borderBottom: `1px solid ${prio.color}20` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ background: prio.bg, color: prio.color }}>
                  {prio.label} prioridade
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1"
                  style={{ background: stat.bg, color: stat.color }}>
                  <StatusIcon size={9} />
                  {stat.label}
                </span>
                {acao.area && (
                  <span className={`text-[10px] px-2 py-1 rounded-full ${darkMode ? "bg-white/08 text-white/50" : "bg-gray-100 text-gray-500"}`}>
                    {acao.area}
                  </span>
                )}
              </div>
              <h2 className={`text-lg font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {acao.iniciativa || "Ação sem título"}
              </h2>
              {acao.objetivo && (
                <p className={`text-sm mt-1 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                  {acao.objetivo}
                </p>
              )}
            </div>
            <button onClick={onClose}
              className={`p-2 rounded-xl flex-shrink-0 ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* 5W2H Grid */}
          <div>
            <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              Metodologia 5W2H
            </p>
            <div className="space-y-2">
              {fields5W2H.map((f, i) => {
                const Icon = f.icon
                if (!f.value) return null
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl p-3"
                    style={{ background: f.color + "0a", border: `1px solid ${f.color}18` }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: f.color + "18" }}>
                      <Icon size={13} style={{ color: f.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5"
                        style={{ color: f.color }}>
                        {f.label}
                      </p>
                      <p className={`text-sm leading-snug ${darkMode ? "text-white/80" : "text-gray-700"}`}>
                        {f.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
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
  const [filterArea, setFilterArea] = useState("Todas")
  const [filterPrio, setFilterPrio] = useState("Todas")

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

  // Ações do Dev Mode
  const devAcoes = planningData.acoes.filter(a => a.iniciativa?.trim())

  // Milestones: gera da lista de ações (dataFim como marco) + defaults
  const milestones = devAcoes.length > 0
    ? devAcoes
        .filter(a => a.dataFim)
        .sort((a, b) => a.dataFim.localeCompare(b.dataFim))
        .map(a => ({
          date: a.dataFim,
          label: a.iniciativa,
          status: a.status === "Concluído" ? "done"
                : a.status === "Em andamento" ? "in_progress"
                : "pending"
        }))
    : MILESTONES_DEFAULT

  // Filtros
  const areas = ["Todas", ...Array.from(new Set(devAcoes.map(a => a.area).filter(Boolean)))]
  const statusOpts = ["Todos", ...Object.keys(STATUS_CONFIG)]
  const prioOpts = ["Todas", ...Object.keys(PRIORIDADE_CONFIG)]

  const acoesFiltradas = devAcoes.filter(a => {
    const okS = filterStatus === "Todos" || a.status === filterStatus
    const okA = filterArea  === "Todas"  || a.area === filterArea
    const okP = filterPrio  === "Todas"  || a.prioridade === filterPrio
    return okS && okA && okP
  })

  // Stats
  const total      = devAcoes.length
  const concluidas = devAcoes.filter(a => a.status === "Concluído").length
  const emAndamento= devAcoes.filter(a => a.status === "Em andamento").length
  const atrasadas  = devAcoes.filter(a => a.status === "Atrasado").length
  const progresso  = total > 0 ? Math.round((concluidas / total) * 100) : 0

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      <HeroHeader accentGradient={accentGradient} />

      {/* ── SUMMARY STRIP ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total de Ações",  value: total,       color: accent.from || "#3b82f6", icon: ListChecks  },
          { label: "Concluídas",      value: concluidas,  color: "#22c55e",                icon: CheckCircle2 },
          { label: "Em Andamento",    value: emAndamento, color: "#3b82f6",                icon: TrendingUp  },
          { label: "Atrasadas",       value: atrasadas,   color: "#ef4444",                icon: AlertCircle },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + "20" }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className={`text-xs ${darkMode ? "text-white/40" : "text-gray-500"}`}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ── PROGRESSO GERAL ───────────────────────── */}
      {total > 0 && (
        <div className="rounded-2xl p-5" style={cardStyle}>
          <div className="flex items-center justify-between mb-3">
            <p className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
              Progresso Geral do Plano de Ação
            </p>
            <p className="text-2xl font-extrabold" style={{ color: accent.from || "#3b82f6" }}>
              {progresso}%
            </p>
          </div>
          <div className="h-3 rounded-full overflow-hidden"
            style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${progresso}%`, background: accent.css || "#3b82f6" }} />
          </div>
          <div className="flex justify-between mt-2 text-[11px]"
            style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
            <span>{concluidas} de {total} ações concluídas</span>
            <span>{devAcoes.length > 0 ? "Dados: Dev Mode → Plano de Ação" : "Dados padrão"}</span>
          </div>
        </div>
      )}

      {/* ── TIMELINE ──────────────────────────────── */}
      <section>
        <p style={titleStyle}>Linha do Tempo</p>
        <p style={subStyle}>
          {devAcoes.length > 0
            ? "Gerada automaticamente do Plano de Ação"
            : "Marcos padrão · edite em Dev Mode → Plano de Ação"}
        </p>
        <div className="rounded-2xl p-6" style={cardStyle}>
          <RoadmapTimeline milestones={milestones} darkMode={darkMode} accent={accent} />
        </div>
      </section>

      {/* ── PLANO DE AÇÃO (5W2H) ──────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p style={titleStyle}>Plano de Ação — 5W2H</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>
              {devAcoes.length > 0
                ? `${devAcoes.length} ação(ões) · editável em Dev Mode → Plano de Ação`
                : "Cadastre ações em Dev Mode → Plano de Ação"}
            </p>
          </div>

          {/* Filtros */}
          {devAcoes.length > 0 && (
            <div className="flex gap-2 flex-wrap items-center">
              <Filter size={13} style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }} />
              {[
                { opts: statusOpts, val: filterStatus, set: setFilterStatus },
                { opts: areas,      val: filterArea,   set: setFilterArea   },
                { opts: prioOpts,   val: filterPrio,   set: setFilterPrio   },
              ].map((f, i) => (
                <select
                  key={i}
                  value={f.val}
                  onChange={e => f.set(e.target.value)}
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
          )}
        </div>

        {devAcoes.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {acoesFiltradas.map((acao, i) => (
                <AcaoCard
                  key={acao.id || i}
                  acao={acao}
                  darkMode={darkMode}
                  accent={accent}
                  onClick={() => setSelectedAcao(acao)}
                />
              ))}
              {acoesFiltradas.length === 0 && (
                <div className={`col-span-full text-center py-10 rounded-2xl`}
                  style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <p className={`text-sm ${darkMode ? "text-white/35" : "text-gray-400"}`}>
                    Nenhuma ação encontrada com os filtros selecionados.
                  </p>
                </div>
              )}
            </div>

            {/* Kanban por status */}
            <div className="mt-8">
              <p style={titleStyle}>Kanban por Status</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["Não iniciado", "Em andamento", "Concluído", "Atrasado"].map(st => {
                  const stConf = STATUS_CONFIG[st]
                  const StIcon = stConf.icon
                  const items = devAcoes.filter(a => a.status === st)
                  return (
                    <div key={st} className="rounded-2xl p-4 space-y-2"
                      style={{ background: stConf.color + "08", border: `1px solid ${stConf.color}20` }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                          <StIcon size={13} style={{ color: stConf.color }} />
                          <span className="text-xs font-bold" style={{ color: stConf.color }}>{st}</span>
                        </div>
                        <span className="text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: stConf.bg, color: stConf.color }}>
                          {items.length}
                        </span>
                      </div>
                      {items.slice(0, 4).map((a, i) => (
                        <div key={i}
                          className="rounded-xl p-2.5 cursor-pointer transition-all"
                          style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}
                          onClick={() => setSelectedAcao(a)}>
                          <p className={`text-[11px] font-semibold leading-snug ${darkMode ? "text-white/80" : "text-gray-700"}`}>
                            {a.iniciativa?.slice(0, 45)}{(a.iniciativa?.length || 0) > 45 ? "…" : ""}
                          </p>
                          {a.responsavel && (
                            <p className={`text-[10px] mt-1 ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                              {a.responsavel}
                            </p>
                          )}
                        </div>
                      ))}
                      {items.length > 4 && (
                        <p className="text-[10px] text-center pt-1" style={{ color: stConf.color }}>
                          +{items.length - 4} mais
                        </p>
                      )}
                      {items.length === 0 && (
                        <p className={`text-[10px] text-center py-3 ${darkMode ? "text-white/20" : "text-gray-300"}`}>
                          Nenhuma ação
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-2xl p-10 text-center"
            style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
            <Zap size={32} className="mx-auto mb-3 opacity-25" style={{ color: accent.from }} />
            <p className={`font-semibold text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              Nenhuma ação cadastrada ainda
            </p>
            <p className={`text-xs mt-1 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
              Acesse Dev Mode → Plano de Ação para adicionar iniciativas
            </p>
          </div>
        )}
      </section>

      {selectedAcao && (
        <AcaoDetailModal
          acao={selectedAcao}
          darkMode={darkMode}
          accent={accent}
          onClose={() => setSelectedAcao(null)}
        />
      )}
    </div>
  )
}
