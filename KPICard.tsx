import React from "react"
import { Shield, AlertTriangle, TrendingUp, Zap } from "lucide-react"

interface SwotItem {
  title: string
  icon: React.ReactNode
  lightColor: string
  darkColor: string
  iconBg: string
  items: string[]
}

const swotData: SwotItem[] = [
  {
    title: "Forças",
    icon: <Shield size={18} />,
    lightColor: "bg-emerald-50 border-emerald-200 text-emerald-700",
    darkColor: "bg-emerald-900/20 border-emerald-700/30 text-emerald-400",
    iconBg: "bg-emerald-100 text-emerald-600",
    items: [
      "15 anos de atuação, histórico robusto de projetos econômico-financeiros aprovados",
      "Especialização profunda em FNO e relacionamento sólido com o Banco da Amazônia",
      "Taxa de aprovação próxima de 96% e captação de bilhões de reais para clientes",
      "Corpo técnico sênior, com formação avançada (especializações e mestrado)",
      "Processos mapeados, workflow documentado e disciplina operacional",
      "Sede e infraestrutura modernas, favorecendo reuniões e percepção de valor",
      "Reputação consolidada no Norte, com alto índice de confiança e resultados"
    ]
  },
  {
    title: "Fraquezas",
    icon: <AlertTriangle size={18} />,
    lightColor: "bg-amber-50 border-amber-200 text-amber-700",
    darkColor: "bg-amber-900/20 border-amber-700/30 text-amber-400",
    iconBg: "bg-amber-100 text-amber-600",
    items: [
      "Comunicação digital ainda concentrada (Instagram) e pouco distribuída no CIM",
      "Conteúdo de prova social e cases pouco sistematizados/formatados para escala",
      "Mensuração parcial de autoridade",
      "Baixa cadência multiformato (blog, YouTube, podcast) para sustentar o arquétipo do Sábio"
    ]
  },
  {
    title: "Oportunidades",
    icon: <TrendingUp size={18} />,
    lightColor: "bg-blue-50 border-blue-200 text-blue-700",
    darkColor: "bg-blue-900/20 border-blue-700/30 text-blue-400",
    iconBg: "bg-blue-100 text-blue-600",
    items: [
      "Crescente demanda por crédito estruturado (incluindo ESG/transição energética)",
      "Parcerias com entidades de classe, federações, clusters setoriais e o próprio Banco",
      "ABM (account-based marketing) orientado a decisores de empresas-alvo"
    ]
  },
  {
    title: "Ameaças",
    icon: <Zap size={18} />,
    lightColor: "bg-red-50 border-red-200 text-red-700",
    darkColor: "bg-red-900/20 border-red-700/30 text-red-400",
    iconBg: "bg-red-100 text-red-600",
    items: [
      "Mudanças regulatórias/políticas no FNO ou nas diretrizes do Banco da Amazônia",
      "Concorrentes posicionando-se como especialistas e disputando share of mind",
      "Conjuntura macroeconômica que reduza demanda por investimento/financiamento",
      "Dependência de um canal de aquisição (indicação) sem contrapeso de demanda própria"
    ]
  }
]

interface Props {
  dark?: boolean
}

// BUG FIX: SWOTSection now accepts `dark` prop and applies dark-mode styles correctly
export default function SWOTSection({ dark }: Props) {
  return (
    <div>
      <h2 className={`text-xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>Análise SWOT</h2>
      <p className={`text-sm mb-6 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
        Forças, Fraquezas, Oportunidades e Ameaças estratégicas
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {swotData.map((section) => (
          <div
            key={section.title}
            className={`rounded-xl border p-5 ${dark ? section.darkColor : section.lightColor}`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'bg-white/10' : section.iconBg}`}>
                {section.icon}
              </div>
              <h3 className="font-bold text-base">{section.title}</h3>
              <span className="ml-auto text-xs opacity-60">{section.items.length} itens</span>
            </div>
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-current mt-1.5 flex-shrink-0 opacity-50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
