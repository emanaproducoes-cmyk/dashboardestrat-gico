import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import EditableHeroHeader from "../components/dashboard/EditableHeroHeader"
import RoadmapTimeline from "../components/dashboard/RoadmapTimeline"
import PillarModal from "../components/dashboard/PillarModal"
import {
  Award, Radio, Users, Target, Star, Zap, Globe, Heart, Shield, TrendingUp,
  ArrowRight, Info, MapPin, CheckCircle2, Clock, AlertCircle, Circle,
  ChevronRight, X, Calendar, Code2, User
} from "lucide-react"
import { useAuth } from "../lib/AuthContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import { useFontSettings } from "../lib/FontSettingsContext"

const ICON_MAP: Record<string, React.ElementType> = {
  Award, Radio, Users, Target, Star, Zap, Globe, Heart, Shield, TrendingUp
}

const DEFAULT_PILARES = [
  { id: "autoridade",    label: "Autoridade Digital",      icon: "Award",  gradient: "from-violet-600 to-purple-800", desc: "Posicionamento como referência em FNO" },
  { id: "multichannel",  label: "Estratégia Multichannel", icon: "Radio",  gradient: "from-blue-600 to-cyan-700",    desc: "LinkedIn, YouTube, Instagram, Blog" },
  { id: "provasSocial",  label: "Prova Social",            icon: "Users",  gradient: "from-rose-600 to-pink-800",    desc: "Cases de sucesso e depoimentos" },
  { id: "posicionamento",label: "Posicionamento",          icon: "Target", gradient: "from-amber-500 to-orange-700", desc: "Consolidação da marca AF" },
]

// Dados padrão do Roadmap (Detalhes)
const DEFAULT_ROADMAP_ITEMS = [
  { id: "r1", iniciativa: "Lançamento do LinkedIn Corporativo", status: "Em andamento", responsavel: "Gestor de Marketing", dataFim: "Mai/26", area: "Marketing", prioridade: "Alta", objetivo: "Ativar canal para autoridade e relacionamento B2B" },
  { id: "r2", iniciativa: "Ativação do Canal YouTube com Rotina Editorial", status: "Em andamento", responsavel: "Vídeo (lead)", dataFim: "Jun/26", area: "Marketing", prioridade: "Alta", objetivo: "Ativar canal mixchannel para autoridade via vídeo" },
  { id: "r3", iniciativa: "Pipeline de Prova Social — Coleta e Preparação H2", status: "Não iniciado", responsavel: "Vídeo (lead)", dataFim: "Jun/26", area: "Conteúdo", prioridade: "Média", objetivo: "Garantir 3 depoimentos/cases em vídeo no H2" },
]

const STATUS_CFG: Record<string, { color: string; bg: string; icon: React.ElementType }> = {
  "Não iniciado": { color: "#9ca3af", bg: "rgba(156,163,175,0.15)", icon: Circle },
  "Em andamento": { color: "#3b82f6", bg: "rgba(59,130,246,0.15)", icon: AlertCircle },
  "Concluído":    { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   icon: CheckCircle2 },
  "Atrasado":     { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   icon: AlertCircle },
}
const PRIO_CFG: Record<string, { color: string }> = {
  "Alta":    { color: "#ef4444" },
  "Média":   { color: "#f59e0b" },
  "Baixa":   { color: "#22c55e" },
  "Crítica": { color: "#8b5cf6" },
}

// ── Tooltip DevMode Badge ─────────────────────────
function DevModeTooltip({ dark }: { dark: boolean }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
        style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)" }}>
        <Info size={10} /> Editar pilares
      </button>
      {show && (
        <div className="absolute right-0 top-8 z-30 rounded-xl p-3 shadow-2xl w-52"
          style={{ background: dark ? "#0a1628" : "#fff", border: "1px solid rgba(59,130,246,0.25)" }}>
          <p className="text-[10px] font-bold text-blue-400 mb-1.5 uppercase tracking-wider">Como editar</p>
          <div className="flex items-center gap-1.5 text-[11px] mb-2"
            style={{ color: dark ? "rgba(255,255,255,0.70)" : "#374151" }}>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Dev Mode</span>
            <ArrowRight size={10} className="text-blue-400" />
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Pilares</span>
          </div>
          <p className="text-[10px]" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#6b7280" }}>
            Adicione, edite ou remova pilares. As alterações aparecem aqui em tempo real para todos.
          </p>
        </div>
      )}
    </div>
  )
}

// ── DevMode path badge para Roadmap ──────────────
function RoadmapDevBadge({ dark }: { dark: boolean }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
        style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)" }}>
        <Code2 size={10} /> Editar dados
      </button>
      {show && (
        <div className="absolute right-0 top-8 z-30 rounded-xl p-3 shadow-2xl w-60"
          style={{ background: dark ? "#0a1628" : "#fff", border: "1px solid rgba(59,130,246,0.25)" }}>
          <p className="text-[10px] font-bold text-blue-400 mb-1.5 uppercase tracking-wider">Caminho Dev Mode</p>
          <div className="space-y-1 text-[11px]" style={{ color: dark ? "rgba(255,255,255,0.70)" : "#374151" }}>
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Dev Mode</span>
              <ArrowRight size={10} className="text-blue-400" />
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400">Plano de Ação</span>
            </div>
          </div>
          <p className="text-[10px] mt-2" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#6b7280" }}>
            Edite iniciativas, status, responsáveis e prazos. Salvo no Firestore — todos veem em tempo real.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Modal detalhe de item do Roadmap ─────────────
function RoadmapDetailModal({ item, dark, onClose }: { item: any; dark: boolean; onClose: () => void }) {
  const st = STATUS_CFG[item.status] || STATUS_CFG["Não iniciado"]
  const StIcon = st.icon
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: dark ? "#0a1628" : "#fff", border: `1px solid ${st.color}30` }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6" style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mb-2"
                style={{ background: st.bg, color: st.color }}>
                <StIcon size={9} /> {item.status}
              </span>
              <h3 className={`text-base font-extrabold leading-tight ${dark ? "text-white" : "text-gray-900"}`}>{item.iniciativa}</h3>
              {item.objetivo && (
                <p className="text-xs mt-1" style={{ color: dark ? "rgba(255,255,255,0.5)" : "#6b7280" }}>{item.objetivo}</p>
              )}
            </div>
            <button onClick={onClose} className={`p-1.5 rounded-lg ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={15} />
            </button>
          </div>
        </div>
        <div className="p-6 grid grid-cols-2 gap-3">
          {[
            { icon: User, label: "Responsável", value: item.responsavel },
            { icon: Calendar, label: "Prazo", value: item.dataFim },
            { icon: Target, label: "Área", value: item.area },
            { icon: AlertCircle, label: "Prioridade", value: item.prioridade },
          ].map(({ icon: Icon, label, value }) => value ? (
            <div key={label} className="rounded-xl p-3"
              style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)", border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Icon size={11} style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }} />
                <span className="text-[10px] uppercase tracking-wider" style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>{label}</span>
              </div>
              <p className="text-sm font-semibold" style={{ color: dark ? "rgba(255,255,255,0.90)" : "#1f2937" }}>{value}</p>
            </div>
          ) : null)}
        </div>
      </div>
    </div>
  )
}

// ── Card Detalhes do Roadmap ──────────────────────
function RoadmapDetailsCard({ dark, sectionBg, sectionBorder, isAdmin }: {
  dark: boolean; sectionBg: string; sectionBorder: string; isAdmin: boolean
}) {
  const { data: planning } = usePlanningData()
  const [selected, setSelected] = useState<any | null>(null)

  const devAcoes = planning.acoes?.filter((a: any) => a.iniciativa?.trim())
  const items = devAcoes?.length > 0 ? devAcoes : DEFAULT_ROADMAP_ITEMS

  const statusCount = items.reduce((acc: Record<string, number>, item: any) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <>
      <div className="rounded-2xl overflow-hidden" style={{ background: sectionBg, border: `1px solid ${sectionBorder}` }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"}` }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.25)" }}>
              <MapPin size={15} style={{ color: "#8b5cf6" }} />
            </div>
            <div>
              <p className={`font-extrabold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Detalhes do Roadmap</p>
              <p className="text-[11px]" style={{ color: dark ? "rgba(255,255,255,0.40)" : "#9ca3af" }}>
                Visão consolidada · status · responsáveis · prazos · clique para abrir
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Status pills summary */}
            <div className="hidden sm:flex items-center gap-3">
              {Object.entries(STATUS_CFG).map(([key, cfg]) => {
                const count = statusCount[key] || 0
                if (count === 0) return null
                const Icon = cfg.icon
                return (
                  <div key={key} className="flex items-center gap-1">
                    <Icon size={11} style={{ color: cfg.color }} />
                    <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{count}</span>
                  </div>
                )
              })}
            </div>
            {isAdmin && <RoadmapDevBadge dark={dark} />}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                {["Iniciativa", "Área", "Prioridade", "Status", "Prazo", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, i: number) => {
                const st = STATUS_CFG[item.status] || STATUS_CFG["Não iniciado"]
                const pr = PRIO_CFG[item.prioridade] || PRIO_CFG["Média"]
                const StIcon = st.icon
                return (
                  <tr key={item.id || i}
                    className="cursor-pointer transition-colors"
                    style={{ borderTop: i > 0 ? `1px solid ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` : "none" }}
                    onClick={() => setSelected(item)}
                    onMouseEnter={e => (e.currentTarget.style.background = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-4 py-3">
                      <p className="text-xs font-semibold" style={{ color: dark ? "rgba(255,255,255,0.88)" : "#1f2937" }}>
                        {item.iniciativa?.slice(0, 42)}{(item.iniciativa?.length || 0) > 42 ? "…" : ""}
                      </p>
                      {item.objetivo && (
                        <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }}>
                          {item.objetivo?.slice(0, 52)}…
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: dark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)", color: dark ? "rgba(255,255,255,0.65)" : "#4b5563" }}>
                        {item.area || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold" style={{ color: pr.color }}>
                        {item.prioridade || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"
                        style={{ background: st.bg, color: st.color }}>
                        <StIcon size={9} />{item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px]" style={{ color: dark ? "rgba(255,255,255,0.48)" : "#6b7280" }}>
                      {item.dataFim || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                        style={{ background: "rgba(139,92,246,0.15)", color: "#8b5cf6", border: "1px solid rgba(139,92,246,0.30)" }}>
                        <ChevronRight size={10} /> Ver
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 flex items-center gap-1.5"
          style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}` }}>
          <Info size={10} style={{ color: dark ? "rgba(255,255,255,0.25)" : "#d1d5db" }} />
          <p className="text-[10px]" style={{ color: dark ? "rgba(255,255,255,0.25)" : "#9ca3af" }}>
            Clique em qualquer linha para ver todos os detalhes
          </p>
        </div>
      </div>

      {selected && (
        <RoadmapDetailModal item={selected} dark={dark} onClose={() => setSelected(null)} />
      )}
    </>
  )
}

export default function Home({ darkMode = true, accentGradient }: PageProps) {
  const { user }           = useAuth()
  const { data: planning } = usePlanningData()
  const { fontSettings }   = useFontSettings()
  const isAdmin            = user?.isAdmin ?? false

  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)

  // Pilares do Firestore ou defaults
  const pilaresFromDB = (planning as any).pilares as typeof DEFAULT_PILARES | undefined
  const pilares = pilaresFromDB?.length ? pilaresFromDB : DEFAULT_PILARES

  const sectionBg = darkMode
    ? "rgba(255,255,255,0.04)"
    : "rgba(255,255,255,0.95)"
  const sectionBorder = darkMode
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)"

  const titleStyle: React.CSSProperties = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 800,
    marginBottom: 4,
  }
  const sub1Style: React.CSSProperties = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.4)" : "#9ca3af",
    marginBottom: 20,
  }

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 md:space-y-8">
      <EditableHeroHeader accentGradient={accentGradient} />

      {/* ── PILARES ESTRATÉGICOS ─────────────────── */}
      <section>
        <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
          <div>
            <p style={titleStyle}>Pilares Estratégicos</p>
            <p style={sub1Style}>Os vetores do crescimento digital 2026</p>
          </div>
          {isAdmin && <DevModeTooltip dark={darkMode} />}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pilares.map(p => {
            const Icon = ICON_MAP[p.icon] || Star
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`rounded-2xl p-5 text-left transition-all duration-300 group hover:scale-[1.02]`}
                style={{
                  background: sectionBg,
                  border: `1px solid ${sectionBorder}`,
                  boxShadow: "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.12)"
                  e.currentTarget.style.borderColor = darkMode ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = sectionBorder
                }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className={`font-bold text-sm mb-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{p.label}</h3>
                <p className={`text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>{p.desc}</p>
                <div className={`flex items-center gap-1 text-xs mt-3 group-hover:gap-2 transition-all ${darkMode ? "text-blue-300" : "text-blue-600"}`}>
                  Ver detalhes <ArrowRight size={12} />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── ROADMAP ESTRATÉGICO ──────────────────── */}
      <section className="rounded-2xl p-6"
        style={{ background: sectionBg, border: `1px solid ${sectionBorder}` }}>
        <p style={titleStyle}>Roadmap Estratégico</p>
        <p style={sub1Style}>Linha do tempo de execução 2026</p>
        <RoadmapTimeline dark={darkMode} />
      </section>

      {/* ── DETALHES DO ROADMAP ──────────────────── */}
      <section>
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <p style={titleStyle}>Detalhes do Roadmap</p>
            <p style={sub1Style}>Visão consolidada · status · responsáveis · prazos</p>
          </div>
        </div>
        <RoadmapDetailsCard
          dark={darkMode}
          sectionBg={sectionBg}
          sectionBorder={sectionBorder}
          isAdmin={isAdmin}
        />
      </section>

      {selectedPillar && (
        <PillarModal pillar={selectedPillar} onClose={() => setSelectedPillar(null)} />
      )}
    </div>
  )
}
