import type { PageProps } from "../lib/types"
import React from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import SWOTSection from "../components/dashboard/SWOTSection"
import { AlertTriangle, Lightbulb, TrendingUp, CheckCircle2 } from "lucide-react"

const risks = [
  {
    level: "Alto",
    levelColor: "bg-red-100 text-red-700",
    title: "Dependência de um canal de aquisição",
    desc: "Mais de 70% das conversões ainda vêm de indicações. Necessário diversificar fontes de demanda através do inbound digital.",
    mitigation: "Implementar estratégia multichannel com metas por canal até Jun/26"
  },
  {
    level: "Alto",
    levelColor: "bg-red-100 text-red-700",
    title: "Ausência de prova social estruturada",
    desc: "Sem cases publicados, a taxa de conversão de leads digitais permanece baixa e a autoridade no ambiente digital é limitada.",
    mitigation: "Lançar programa de captação de cases em Q2 com publicação em Q3"
  },
  {
    level: "Médio",
    levelColor: "bg-amber-100 text-amber-700",
    title: "Mudanças regulatórias no FNO/BNDES",
    desc: "Alterações nas políticas de crédito podem reduzir a demanda por projetos específicos ou alterar os requisitos de aprovação.",
    mitigation: "Monitorar publicações do Banco da Amazônia e diversificar portfólio de serviços"
  },
  {
    level: "Médio",
    levelColor: "bg-amber-100 text-amber-700",
    title: "Concorrentes ganhando visibilidade digital",
    desc: "Consultoras concorrentes estão investindo em marketing digital, disputando share of mind com o mesmo público-alvo.",
    mitigation: "Acelerar produção de conteúdo autoridade no LinkedIn e YouTube"
  },
  {
    level: "Baixo",
    levelColor: "bg-blue-100 text-blue-700",
    title: "Capacidade de produção de conteúdo",
    desc: "A cadência exigida pelo plano multichannel pode sobrecarregar a equipe sem processos e ferramentas adequadas.",
    mitigation: "Mapear e documentar processos de produção + avaliar suporte externo em Q2"
  },
]

const insights = [
  {
    icon: TrendingUp,
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    title: "Janela de Oportunidade ESG",
    text: "A crescente demanda por crédito estruturado para projetos de transição energética e ESG representa uma oportunidade única para a AF se posicionar como especialista nessa interface com o FNO."
  },
  {
    icon: Lightbulb,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    borderColor: "border-blue-200",
    title: "ABM como Alavanca de Crescimento",
    text: "Account-Based Marketing orientado a decisores de empresas-alvo — usando LinkedIn Ads + conteúdo personalizado — pode multiplicar a taxa de conversão de leads qualificados em 2–3x."
  },
  {
    icon: CheckCircle2,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    borderColor: "border-violet-200",
    title: "Cases como Ativo Estratégico",
    text: "Os 3–4 storytellings planejados para Q3 têm potencial de se tornarem o conteúdo de maior ROI de todo o plano — combinando prova social, SEO e autoridade em um único ativo reutilizável."
  },
  {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    borderColor: "border-amber-200",
    title: "YouTube como Diferencial Competitivo",
    text: "Nenhum concorrente direto da AF tem presença forte no YouTube com conteúdo técnico sobre FNO. Há uma janela de 6–12 meses para ocupar esse espaço antes que a concorrência perceba o valor."
  },
]

export default function Insights({ darkMode = false }: PageProps) {
  const bg = "min-h-screen p-6 md:p-8 space-y-8" + (darkMode ? "" : " bg-gray-50")
  const titleClass = darkMode ? "text-white font-bold text-xl" : "text-gray-900 font-bold text-xl"
  const subClass = darkMode ? "text-white/50 text-sm" : "text-gray-500 text-sm"
  const cardBg = darkMode ? "bg-white/10 border border-white/10 rounded-2xl p-5" : "bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
  const valClass = darkMode ? "text-white" : "text-gray-900"
  const textClass = darkMode ? "text-white/70" : "text-gray-600"

  return (
    <div className={bg}>
      <HeroHeader />

      {/* BUG FIX: pass dark prop to SWOTSection so it renders correctly in dark mode */}
      <section className={cardBg}>
        <SWOTSection dark={darkMode} />
      </section>

      <section>
        <h2 className={`${titleClass} mb-1`}>Riscos Operacionais</h2>
        <p className={`${subClass} mb-5`}>Principais riscos identificados e planos de mitigação</p>
        <div className="space-y-3">
          {risks.map((risk, i) => (
            <div key={i} className={cardBg}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className={`font-bold text-sm ${valClass}`}>{risk.title}</h3>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${risk.levelColor}`}>
                  {risk.level}
                </span>
              </div>
              <p className={`text-xs leading-relaxed mb-3 ${textClass}`}>{risk.desc}</p>
              <div className={`text-xs rounded-lg p-3 ${darkMode ? 'bg-white/5 text-white/50' : 'bg-gray-50 text-gray-500'}`}>
                <span className="font-semibold">Mitigação: </span>{risk.mitigation}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className={`${titleClass} mb-1`}>Insights Estratégicos</h2>
        <p className={`${subClass} mb-5`}>Oportunidades e recomendações prioritárias para 2026</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, i) => {
            const Icon = insight.icon
            return (
              <div key={i} className={`${cardBg} border ${darkMode ? 'border-white/10' : insight.borderColor}`}>
                <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-white/10' : insight.bg} flex items-center justify-center mb-4`}>
                  <Icon size={18} className={darkMode ? 'text-white' : insight.iconColor} />
                </div>
                <h3 className={`font-bold text-sm mb-2 ${valClass}`}>{insight.title}</h3>
                <p className={`text-sm leading-relaxed ${textClass}`}>{insight.text}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
