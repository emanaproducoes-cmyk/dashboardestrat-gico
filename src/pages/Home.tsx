import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import EditableHeroHeader from "../components/dashboard/EditableHeroHeader"
import ChannelChart from "../components/dashboard/ChannelChart"
import ChannelComparison from "../components/dashboard/ChannelComparison"
import ContentDistribution from "../components/dashboard/ContentDistribution"
import ClientJourney from "../components/dashboard/ClientJourney"
import OKRNightingaleChart from "../components/dashboard/OKRNightingaleChart"
import RoadmapTimeline from "../components/dashboard/RoadmapTimeline"
import DraggableCover from "../components/dashboard/DraggableCover"
import PillarModal from "../components/dashboard/PillarModal"
import { Award, Radio, Users, Target, ArrowRight } from "lucide-react"

const pillars = [
  { id: "autoridade", label: "Autoridade Digital", icon: Award, gradient: "from-violet-600 to-purple-800", desc: "Posicionamento como referência em FNO" },
  { id: "multichannel", label: "Estratégia Multichannel", icon: Radio, gradient: "from-blue-600 to-cyan-700", desc: "LinkedIn, YouTube, Instagram, Blog" },
  { id: "provasSocial", label: "Prova Social", icon: Users, gradient: "from-rose-600 to-pink-800", desc: "Cases de sucesso e depoimentos" },
  { id: "posicionamento", label: "Posicionamento", icon: Target, gradient: "from-amber-500 to-orange-700", desc: "Consolidação da marca AF" },
]

export default function Home({ darkMode = true, accentGradient }: PageProps) {
  // BUG FIX: explicitly typed state
  const [selectedPillar, setSelectedPillar] = useState<string | null>(null)

  const sectionBg = darkMode
    ? "bg-white/8 border border-white/10"
    : "bg-white border border-gray-100 shadow-sm"

  const titleClass = darkMode ? "text-white" : "text-gray-900"
  const subtitleClass = darkMode ? "text-white/50" : "text-gray-500"
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
                <h3 className={`font-bold text-sm mb-1 ${titleClass}`}>{p.label}</h3>
                <p className={`text-xs ${subtitleClass}`}>{p.desc}</p>
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

      <section className={`rounded-2xl p-6 ${sectionBg}`}>
        <h2 className={`${sectionTitle} mb-1`}>Editor de Capa</h2>
        <p className={`${sectionSub} mb-5`}>Personalize o slide de abertura — arraste e edite</p>
        <DraggableCover accentGradient={accentGradient} dark={darkMode} />
      </section>

      {selectedPillar && (
        <PillarModal pillar={selectedPillar} onClose={() => setSelectedPillar(null)} />
      )}
    </div>
  )
}
