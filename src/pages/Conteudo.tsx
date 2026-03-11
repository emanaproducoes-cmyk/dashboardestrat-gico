import type { PageProps } from "../lib/types"
import React from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import ContentDistribution from "../components/dashboard/ContentDistribution"
import { Target, BookOpen, Star, Megaphone, CheckCircle2 } from "lucide-react"

const pillars = [
  {
    icon: Target,
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    title: "Missão",
    text: "Transformar o potencial econômico da Amazônia em realidade, conectando empreendedores visionários a oportunidades de financiamento estratégico e desenvolvimento sustentável."
  },
  {
    icon: Star,
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    title: "Posicionamento",
    text: "AF Consultoria é a referência em projetos econômico-financeiros aprovados pelo FNO e BNDES, com 96% de taxa de aprovação e mais de 15 anos de experiência no mercado amazônico."
  },
  {
    icon: BookOpen,
    bg: "bg-amber-50",
    iconColor: "text-amber-600",
    title: "Arquétipo",
    text: "O Sábio — Guia experiente que transforma complexidade em clareza, convertendo projetos em resultados concretos através de conhecimento profundo e rigor técnico."
  },
  {
    icon: Megaphone,
    bg: "bg-rose-50",
    iconColor: "text-rose-600",
    title: "Tom de Voz",
    text: "Técnico e confiante, mas acessível. Autoridade sem arrogância. Inspirador sem ser vago. Fala a língua do empresário, não do acadêmico."
  },
]

const contentTypes = [
  { label: "Antes/Depois", pct: 40, color: "bg-blue-500", desc: "Transformações de negócios reais — do projeto ao financiamento aprovado." },
  { label: "Vídeos Educativos", pct: 30, color: "bg-violet-500", desc: "Explicações sobre FNO, BNDES e linhas de crédito — simplificados." },
  { label: "Reposts & Curadoria", pct: 20, color: "bg-cyan-500", desc: "Conteúdo relevante do setor com perspectiva estratégica da AF." },
  { label: "Bastidores", pct: 10, color: "bg-amber-500", desc: "Cultura, equipe e processo — humanizando a marca AF." },
]

const annualGoals = [
  "Publicar 3 a 4 cases de sucesso completos (storytelling) no H2",
  "Produzir 24 vídeos no YouTube (média de 2 por mês)",
  "Publicar 96 posts no LinkedIn (3x por semana)",
  "Publicar 120 posts no Instagram (4–5x por semana)",
  "Publicar 12 artigos no blog (1 por mês em H1, 2 em H2)",
  "Lançar seção 'Histórias que Transformam' no website em Jul/26",
  "Criar 3 guias práticos para download (lead magnets)",
  "Produzir pelo menos 2 webinars ou lives temáticas",
]

export default function Conteudo({ darkMode = false }: PageProps) {
  const bg = "min-h-screen p-6 md:p-8 space-y-8" + (darkMode ? "" : " bg-gray-50")
  const titleClass = darkMode ? "text-white font-bold text-xl" : "text-gray-900 font-bold text-xl"
  const subClass = darkMode ? "text-white/50 text-sm" : "text-gray-500 text-sm"
  const cardBg = darkMode ? "bg-white/10 border border-white/10 rounded-2xl p-5" : "bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
  const textClass = darkMode ? "text-white/70" : "text-gray-600"

  return (
    <div className={bg}>
      <HeroHeader />

      {/* Brand positioning */}
      <section>
        <h2 className={`${titleClass} mb-1`}>Posicionamento de Marca</h2>
        <p className={`${subClass} mb-5`}>A identidade estratégica da AF Consultoria & Projetos</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <div key={i} className={cardBg}>
                <div className={`w-10 h-10 rounded-xl ${darkMode ? 'bg-white/10' : p.bg} flex items-center justify-center mb-4`}>
                  <Icon size={20} className={darkMode ? 'text-white' : p.iconColor} />
                </div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{p.title}</h3>
                <p className={`text-sm leading-relaxed ${textClass}`}>{p.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Content distribution */}
      <section className={cardBg}>
        <ContentDistribution dark={darkMode} />
      </section>

      {/* Content types detail */}
      <section>
        <h2 className={`${titleClass} mb-1`}>Tipos de Conteúdo</h2>
        <p className={`${subClass} mb-5`}>Mix estratégico de formatos e objetivos</p>
        <div className="space-y-3">
          {contentTypes.map((ct, i) => (
            <div key={i} className={`${cardBg} flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl ${darkMode ? 'bg-white/10' : ct.color.replace('bg-', 'bg-') + '/10'} flex items-center justify-center flex-shrink-0`}>
                <span className={`text-lg font-extrabold ${darkMode ? 'text-white' : ct.color.replace('bg-', 'text-')}`}>{ct.pct}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ct.label}</h3>
                  <span className={`text-xs ${subClass}`}>{ct.pct}% do mix</span>
                </div>
                <p className={`text-xs ${textClass}`}>{ct.desc}</p>
                <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                  <div className={`h-full rounded-full ${ct.color}`} style={{ width: `${ct.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Annual goals */}
      <section>
        <h2 className={`${titleClass} mb-1`}>Metas Anuais de Conteúdo</h2>
        <p className={`${subClass} mb-5`}>Objetivos de produção para o ciclo 2026</p>
        <div className={cardBg}>
          <ul className="space-y-3">
            {annualGoals.map((goal, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 size={18} className={darkMode ? 'text-blue-400 flex-shrink-0 mt-0.5' : 'text-blue-500 flex-shrink-0 mt-0.5'} />
                <span className={`text-sm ${textClass}`}>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
