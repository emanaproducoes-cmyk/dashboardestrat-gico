import type { PageProps } from "../lib/types"
import React from "react"
import RoadmapTimeline from "../components/dashboard/RoadmapTimeline"
import EditableHeroHeader from "../components/dashboard/EditableHeroHeader"
import { useAuth } from "../lib/AuthContext"
import { Calendar, Target } from "lucide-react"

const ADMIN_EMAIL = "emanaproducoes@gmail.com"

const milestones = [
  { date: "Mar/26", label: "Lançamento LinkedIn + YouTube", status: "done" },
  { date: "Abr/26", label: "Primeira rodada de conteúdo (4 semanas)", status: "done" },
  { date: "Jun/26", label: "Início de captação de cases", status: "in_progress" },
  { date: "Jul/26", label: "Lançamento seção 'Histórias que Transformam'", status: "pending" },
  { date: "Set/26", label: "Publicação dos 3–4 cases de sucesso", status: "pending" },
  { date: "Nov/26", label: "Revisão e otimização estratégica", status: "pending" },
  { date: "Dez/26", label: "Consolidação de autoridade e avaliação anual", status: "pending" },
]

const deliverables = [
  { q: "Q1", items: ["Perfis LinkedIn e YouTube ativos", "Primeira publicação em todos os canais", "Calendário editorial definido", "Identidade visual dos canais padronizada"] },
  { q: "Q2", items: ["50+ posts publicados em LI", "8+ vídeos no YouTube", "Captação de 2+ cases iniciada", "Primeiros depoimentos coletados"] },
  { q: "Q3", items: ["3–4 cases publicados no site", "Storytellings distribuídos no omnichannel", "Meta de seguidores LI: 70%", "Meta de inscritos YT: 60%"] },
  { q: "Q4", items: ["Autoridade consolidada no LinkedIn", "Blog com 12+ artigos publicados", "Avaliação completa de OKRs", "Planejamento 2027 iniciado"] },
]

export default function Roadmap({ darkMode = false, accentGradient }: PageProps) {
  const { user } = useAuth()
  const isAdmin = !!(user && user.email === ADMIN_EMAIL)

  const bg = "min-h-screen p-6 md:p-8 space-y-8" + (darkMode ? "" : " bg-gray-50")
  const titleClass = darkMode ? "text-white font-bold text-xl" : "text-gray-900 font-bold text-xl"
  const subClass = darkMode ? "text-white/50 text-sm" : "text-gray-500 text-sm"
  const cardBg = darkMode ? "bg-white/10 border border-white/10 rounded-2xl p-6" : "bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
  const valClass = darkMode ? "text-white" : "text-gray-900"
  const textClass = darkMode ? "text-white/60" : "text-gray-500"

  return (
    <div className={bg}>
      <EditableHeroHeader accentGradient={accentGradient} />

      <section className={cardBg}>
        <h2 className={`${titleClass} mb-1`}>Roadmap Estratégico 2026</h2>
        <p className={`${subClass} mb-6`}>Linha do tempo de execução em 4 fases</p>
        <RoadmapTimeline dark={darkMode} isAdmin={isAdmin} />
      </section>

      <section>
        <h2 className={`${titleClass} mb-1`}>Marcos do Projeto</h2>
        <p className={`${subClass} mb-5`}>Datas e entregas chave do ciclo 2026</p>
        <div className="space-y-3">
          {milestones.map((m, i) => (
            <div key={i} className={`${cardBg} flex items-center gap-4`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${m.status === 'done' ? 'bg-emerald-100' : m.status === 'in_progress' ? 'bg-blue-100' : darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                <Calendar size={18} className={m.status === 'done' ? 'text-emerald-600' : m.status === 'in_progress' ? 'text-blue-600' : textClass} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`font-semibold text-sm ${valClass}`}>{m.label}</p>
                  <span className={`text-xs font-medium flex-shrink-0 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{m.date}</span>
                </div>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${m.status === 'done' ? 'bg-emerald-500' : m.status === 'in_progress' ? 'bg-blue-500' : darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={`${titleClass} mb-1`}>Entregáveis por Trimestre</h2>
        <p className={`${subClass} mb-5`}>O que esperamos produzir em cada fase</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deliverables.map((d, i) => (
            <div key={i} className={cardBg}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Target size={16} className="text-white" />
                </div>
                <span className={`font-bold ${valClass}`}>{d.q}</span>
              </div>
              <ul className="space-y-2">
                {d.items.map((item, j) => (
                  <li key={j} className={`flex items-start gap-2 text-xs ${textClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${darkMode ? 'bg-white/30' : 'bg-gray-300'}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
