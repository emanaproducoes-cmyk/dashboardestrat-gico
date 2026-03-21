import type { PageProps } from "../lib/types"
import React from "react"
import KPICard from "../components/dashboard/KPICard"
import OKRCard from "../components/dashboard/OKRCard"
import ChannelChart from "../components/dashboard/ChannelChart"
import OKRNightingaleChart from "../components/dashboard/OKRNightingaleChart"
import HeroHeader from "../components/dashboard/HeroHeader"
import { TrendingUp, Users, BarChart2, Target } from "lucide-react"
import { useFontSettings } from "../lib/FontSettingsContext"

const kpis = [
  { title: "Meta LinkedIn Seguidores", value: "+200", subtitle: "Novos seguidores em 2026", trend: "+40%", trendLabel: "do objetivo atingido" },
  { title: "Meta YouTube Inscritos", value: "+500", subtitle: "Novos inscritos em 2026", trend: "+10%", trendLabel: "do objetivo atingido" },
  { title: "Engajamento LinkedIn", value: "2.5–5.5%", subtitle: "Taxa alvo de engajamento", trend: "+64%", trendLabel: "do objetivo atingido" },
  { title: "Engajamento YouTube", value: "3.0–6.8%", subtitle: "Taxa alvo de engajamento", trend: "+59%", trendLabel: "do objetivo atingido" },
  { title: "Conversões Instagram", value: "70–105", subtitle: "Conversões no ano", trend: "+29%", trendLabel: "do objetivo atingido" },
  { title: "Cases de Sucesso", value: "3–4", subtitle: "Publicação a partir de Jul/26", trend: "0%", trendLabel: "início em Q3" },
]

export default function KPIs({ darkMode = false, accentGradient }: PageProps) {
  const { fontSettings } = useFontSettings()

  const bg = darkMode ? "min-h-screen p-6 md:p-8 space-y-8" : "min-h-screen p-6 md:p-8 space-y-8 bg-gray-50"
  const sectionBg = darkMode ? "rounded-2xl bg-white/8 border border-white/10 p-6" : "rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"

  const titleStyle = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 700,
    marginBottom: "4px",
  }
  const subStyle = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: "20px",
  }

  const okrs = [
    {
      icon: <TrendingUp size={22} className={darkMode ? 'text-blue-300' : 'text-blue-600'} />,
      iconBg: "bg-blue-50",
      title: "Crescimento de Audiência",
      description: "Aumentar o alcance orgânico nos canais proprietários",
      metrics: [
        { label: "LinkedIn Seguidores", target: "+200", progress: 40, detail: "80 novos seguidores conquistados" },
        { label: "YouTube Inscritos", target: "+500", progress: 10, detail: "50 inscritos conquistados" },
      ]
    },
    {
      icon: <BarChart2 size={22} className={darkMode ? 'text-violet-300' : 'text-violet-600'} />,
      iconBg: "bg-violet-50",
      title: "Engajamento & Qualidade",
      description: "Elevar a qualidade de interação com o público",
      metrics: [
        { label: "LI Engajamento", target: "2.5–5.5%", progress: 64, detail: "Taxa atual: ~3.8%" },
        { label: "YT Engajamento", target: "3.0–6.8%", progress: 59, detail: "Taxa atual: ~4.2%" },
      ]
    },
    {
      icon: <Users size={22} className={darkMode ? 'text-rose-300' : 'text-rose-600'} />,
      iconBg: "bg-rose-50",
      title: "Conversões & Prova Social",
      description: "Transformar audiência em leads e cases de sucesso",
      metrics: [
        { label: "IG Conversão", target: "70–105/ano", progress: 29, detail: "22 conversões registradas" },
        { label: "Prova Social", target: "3–4 cases", progress: 0, detail: "Captação iniciada em Q2" },
      ]
    },
    {
      icon: <Target size={22} className={darkMode ? 'text-amber-300' : 'text-amber-600'} />,
      iconBg: "bg-amber-50",
      title: "Conversão Direta por Canal",
      description: "Rastrear e otimizar a conversão em cada canal",
      metrics: [
        { label: "LI Conversão", target: "28–32/ano", progress: 9, detail: "3 conversões via LinkedIn" },
        { label: "YT Conversão", target: "43–56/ano", progress: 7, detail: "4 conversões via YouTube" },
      ]
    }
  ]

  return (
    <div className={bg}>
      <HeroHeader />

      <section>
        <p style={titleStyle}>Indicadores-Chave de Performance</p>
        <p style={subStyle}>Metas e progresso do Ciclo Estratégico 2026</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kpis.map((kpi, i) => <KPICard key={i} {...kpi} darkMode={darkMode} />)}
        </div>
      </section>

      <section>
        <p style={titleStyle}>OKRs — Objetivos e Resultados-Chave</p>
        <p style={subStyle}>Progresso em relação às metas estratégicas</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {okrs.map((okr, i) => <OKRCard key={i} {...okr} darkMode={darkMode} />)}
        </div>
      </section>

      <section>
        <p style={titleStyle}>Infográfico OKR</p>
        <p style={subStyle}>Visualização comparativa de todos os objetivos</p>
        <OKRNightingaleChart dark={darkMode} accentGradient={accentGradient} />
      </section>

      <section className={sectionBg}>
        <p style={titleStyle}>Crescimento por Canal</p>
        <p style={subStyle}>Evolução de seguidores ao longo de 2026</p>
        <ChannelChart dark={darkMode} />
      </section>
    </div>
  )
}
