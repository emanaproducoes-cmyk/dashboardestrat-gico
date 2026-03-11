import React, { useState } from "react"
import { TrendingUp, ArrowUpRight, X } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  subtitle: string
  trend?: string
  trendLabel?: string
  darkMode?: boolean
}

const kpiDetails: Record<string, { description: string; bullets: string[]; tip: string }> = {
  "Meta LinkedIn Seguidores": {
    description: "Crescimento orgânico da audiência no LinkedIn, canal prioritário B2B.",
    bullets: ["Publicações 3–4x/semana", "Artigos técnicos sobre FNO", "Interação ativa com comentários"],
    tip: "Taxa atual: 40% do objetivo atingido (80 novos seguidores)"
  },
  "Meta YouTube Inscritos": {
    description: "Canal educativo com vídeos informativos sobre financiamento e FNO.",
    bullets: ["1–2 vídeos/semana", "Shorts para maior alcance", "SEO em títulos e descrições"],
    tip: "Taxa atual: 10% do objetivo atingido (50 inscritos)"
  },
  "Engajamento LinkedIn": {
    description: "Taxa de engajamento mede a qualidade da interação com o conteúdo publicado.",
    bullets: ["Likes, comentários e compartilhamentos", "Curtidas em artigos longos", "Respostas a perguntas estratégicas"],
    tip: "Taxa atual estimada: ~3.8% (dentro da faixa alvo)"
  },
  "Engajamento YouTube": {
    description: "Interações no canal do YouTube incluindo likes, comentários e retenção.",
    bullets: ["Taxa de retenção acima de 50%", "Comentários respondidos em 24h", "CTR dos thumbnails monitorado"],
    tip: "Taxa atual estimada: ~4.2% (dentro da faixa alvo)"
  },
  "Conversões Instagram": {
    description: "Leads e contatos gerados via DM, stories e bio do Instagram.",
    bullets: ["DMs convertidas em reuniões", "Link na bio com UTM tracking", "Stories com CTA direto"],
    tip: "22 conversões registradas neste ciclo"
  },
  "Cases de Sucesso": {
    description: "Publicação de histórias de sucesso de clientes, a partir de Q3/2026.",
    bullets: ["Storytelling em vídeo e texto", "Distribuição omnichannel", "Publicação no site: 'Histórias que Transformam'"],
    tip: "Início previsto: Julho/2026 (Q3)"
  },
}

export default function KPICard({ title, value, subtitle, trend, trendLabel, darkMode }: KPICardProps) {
  const [open, setOpen] = useState(false)
  const detail = kpiDetails[title]

  const cardBg = darkMode
    ? "bg-white/10 border-white/10 hover:bg-white/15"
    : "bg-white border-gray-100 hover:shadow-lg hover:border-gray-200"
  const titleColor = darkMode ? "text-white/50" : "text-gray-500"
  const valueColor = darkMode ? "text-white" : "text-gray-900"
  const subColor = darkMode ? "text-white/30" : "text-gray-400"

  return (
    <>
      <div className={`rounded-xl border p-5 transition-all duration-300 group cursor-pointer ${cardBg}`} onClick={() => setOpen(true)}>
        <div className="flex items-start justify-between">
          <p className={`text-sm font-medium ${titleColor}`}>{title}</p>
          <button className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-gray-50 group-hover:bg-blue-50'}`}>
            <ArrowUpRight size={14} className={`${darkMode ? 'text-white/40 group-hover:text-blue-300' : 'text-gray-400 group-hover:text-blue-600'}`} />
          </button>
        </div>
        <p className={`text-3xl font-extrabold mt-2 tracking-tight ${valueColor}`}>{value}</p>
        <p className={`text-xs mt-1 ${subColor}`}>{subtitle}</p>
        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} />{trend}
            </span>
            <span className={`text-xs ${subColor}`}>{trendLabel}</span>
          </div>
        )}
        <div className={`text-xs mt-3 font-medium ${darkMode ? 'text-blue-300/70' : 'text-blue-500'} opacity-0 group-hover:opacity-100 transition-opacity`}>
          Ver detalhes →
        </div>
      </div>

      {open && detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="text-2xl font-extrabold text-blue-600 mt-1">{value}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{detail.description}</p>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estratégias</h3>
                <ul className="space-y-1.5">
                  {detail.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700 font-medium">
                📊 {detail.tip}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
