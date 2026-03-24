import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import EditableHeroHeader from "../components/dashboard/EditableHeroHeader"
import RoadmapTimeline from "../components/dashboard/RoadmapTimeline"
import PillarModal from "../components/dashboard/PillarModal"
import { Award, Radio, Users, Target, Star, Zap, Globe, Heart, Shield, TrendingUp, ArrowRight, Info } from "lucide-react"
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

      {selectedPillar && (
        <PillarModal pillar={selectedPillar} onClose={() => setSelectedPillar(null)} />
      )}
    </div>
  )
}
