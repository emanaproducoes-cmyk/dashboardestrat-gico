import type { PageProps } from "../lib/types"
import React, { useState, useEffect } from "react"
import EditableHeroHeader from "../components/dashboard/EditableHeroHeader"
import ChannelChart from "../components/dashboard/ChannelChart"
import ChannelComparison from "../components/dashboard/ChannelComparison"
import ContentDistribution from "../components/dashboard/ContentDistribution"
import ClientJourney from "../components/dashboard/ClientJourney"
import OKRNightingaleChart from "../components/dashboard/OKRNightingaleChart"
import RoadmapTimeline from "../components/dashboard/RoadmapTimeline"
import PillarModal from "../components/dashboard/PillarModal"
import { Award, Radio, Users, Target, ArrowRight, Pencil, Check } from "lucide-react"
import { useAuth } from "../lib/AuthContext"
import { getGlobalItem, setGlobalItem } from "../lib/auth"

const defaultPillars = [
  { id: "autoridade", label: "Autoridade Digital", icon: Award, gradient: "from-violet-600 to-purple-800", desc: "Posicionamento como referência em FNO" },
  { id: "multichannel", label: "Estratégia Multichannel", icon: Radio, gradient: "from-blue-600 to-cyan-700", desc: "LinkedIn, YouTube, Instagram, Blog" },
  { id: "provasSocial", label: "Prova Social", icon: Users, gradient: "from-rose-600 to-pink-800", desc: "Cases de sucesso e depoimentos" },
  { id: "posicionamento", label: "Posicionamento", icon: Target, gradient: "from-amber-500 to-orange-700", desc: "Consolidação da marca AF" },
]

interface InlineEditableProps {
  value: string
  onChange: (v: string) => void
  className?: string
  textColor?: string
  isAdmin: boolean
}

function InlineEditable({ value, onChange, className = "", textColor, isAdmin }: InlineEditableProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  const save = () => { onChange(draft); setEditing(false) }

  if (!isAdmin) return <span className={className}>{value}</span>

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <input
          autoFocus value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          className={`bg-black/10 border border-black/20 rounded px-1 py-0.5 outline-none ${className}`}
          style={{ minWidth: 80 }}
        />
        <button onClick={save} className="p-0.5 bg-black/10 rounded hover:bg-black/20"><Check size={10} /></button>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 group/edit cursor-pointer" onClick={e => { e.stopPropagation(); setEditing(true) }}>
      <span className={className}>{value}</span>
      <Pencil size={11} className="opacity-0 group-hover/edit:opacity-60 transition-opacity flex-shrink-0" style={{ color: textColor || 'currentColor' }} />
    </span>
  )
}

export default function Home({ darkMode = true, accentGradient }: PageProps) {
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)
  const [pillars, setPillars] = useState(() => {
    const saved = getGlobalItem('home_pillars')
    if (saved) {
      const savedData = JSON.parse(saved)
      return defaultPillars.map(p => {
        const s = savedData.find((x: any) => x.id === p.id)
        return s ? { ...p, label: s.label, desc: s.desc } : p
      })
    }
    return defaultPillars
  })

  const updatePillar = (id: string, field: 'label' | 'desc', val: string) => {
    if (!isAdmin) return
    const next = pillars.map(p => p.id === id ? { ...p, [field]: val } : p)
    setPillars(next)
    setGlobalItem('home_pillars', JSON.stringify(next.map(p => ({ id: p.id, label: p.label, desc: p.desc }))))
  }

  const sectionBg = darkMode ? "bg-white/8 border border-white/10" : "bg-white border border-gray-100 shadow-sm"
  const sectionTitle = darkMode ? "text-white font-bold text-xl" : "text-gray-900 font-bold text-xl"
  const sectionSub = darkMode ? "text-white/40 text-sm" : "text-gray-400 text-sm"

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6 md:space-y-8">
      <EditableHeroHeader accentGradient={accentGradient} />

      <section>
        <h2 className={`${sectionTitle} mb-1`}>Pilares Estratégicos</h2>
        <p className={`${sectionSub} mb-5`}>Os quatro vetores do crescimento digital 2026</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map(p => {
            const Icon = p.icon
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`rounded-xl border p-5 text-left transition-all duration-300 group hover:scale-[1.02] ${
                  darkMode ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white border-gray-100 hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <InlineEditable
                    value={p.label}
                    onChange={v => updatePillar(p.id, 'label', v)}
                    className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    textColor={darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af'}
                    isAdmin={isAdmin}
                  />
                </h3>
                <p className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  <InlineEditable
                    value={p.desc}
                    onChange={v => updatePillar(p.id, 'desc', v)}
                    className={`text-xs ${darkMode ? 'text-white/50' : 'text-gray-500'}`}
                    textColor={darkMode ? 'rgba(255,255,255,0.3)' : '#9ca3af'}
                    isAdmin={isAdmin}
                  />
                </p>
                <div className={`flex items-center gap-1 text-xs mt-3 ${darkMode ? 'text-blue-300' : 'text-blue-600'} group-hover:gap-2 transition-all`}>
                  Ver detalhes <ArrowRight size={12} />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className={`${sectionTitle} mb-1`}>OKRs Estratégicos</h2>
        <p className={`${sectionSub} mb-5`}>Objetivos e resultados-chave do ciclo 2026</p>
        <OKRNightingaleChart dark={darkMode} accentGradient={accentGradient} />
      </section>

      <section className={`rounded-2xl p-6 ${sectionBg}`}>
        <h2 className={`${sectionTitle} mb-1`}>Evolução de Seguidores</h2>
        <p className={`${sectionSub} mb-5`}>Trajetória de crescimento multicanal</p>
        <ChannelChart dark={darkMode} />
      </section>

      <section className={`rounded-2xl p-6 ${sectionBg}`}>
        <ChannelComparison dark={darkMode} />
      </section>

      <section className={`rounded-2xl p-6 ${sectionBg}`}>
        <ContentDistribution dark={darkMode} />
      </section>

      <section className={`rounded-2xl p-6 ${sectionBg}`}>
        <ClientJourney dark={darkMode} />
      </section>

      <section className={`rounded-2xl p-6 ${sectionBg}`}>
        <h2 className={`${sectionTitle} mb-1`}>Roadmap Estratégico</h2>
        <p className={`${sectionSub} mb-5`}>Linha do tempo de execução 2026</p>
        <RoadmapTimeline dark={darkMode} />
      </section>

      {selectedPillar && (
        <PillarModal pillar={selectedPillar} onClose={() => setSelectedPillar(null)} />
      )}
    </div>
  )
}
