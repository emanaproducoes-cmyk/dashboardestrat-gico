import React, { useState, useEffect } from "react"
import { CheckCircle2, Clock, Pause, Pencil, Check, X, ArrowRight } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts"

interface PhaseItem {
  quarter: string
  title: string
  period: string
  status: "complete" | "in_progress" | "pending"
  progress: number
  color: string
  accent: string
  items: string[]
  detail: {
    objetivo: string
    kpis: { label: string; val: string; meta: string }[]
    radarData: { metric: string; val: number }[]
    lineData: { semana: string; progresso: number }[]
    insight: string
  }
}

const initialPhases: PhaseItem[] = [
  {
    quarter: "Q1", title: "Lançamento do Mixchannel", period: "Mar – Abr",
    status: "complete", progress: 100, color: "from-blue-600 to-indigo-700", accent: "#6366f1",
    items: ["Lançamento das novas redes: LI e YT", "Captação de novos seguidores para os novos canais", "Postagens semanais em ambos canais"],
    detail: {
      objetivo: "Estabelecer presença digital sólida no LinkedIn e YouTube, criando base de audiência qualificada para os próximos trimestres.",
      kpis: [{ label: "Seguidores LinkedIn", val: "80", meta: "200" }, { label: "Inscritos YouTube", val: "50", meta: "500" }, { label: "Posts publicados", val: "24", meta: "24" }],
      radarData: [{ metric: "Alcance", val: 100 }, { metric: "Conteúdo", val: 100 }, { metric: "Engajamento", val: 80 }, { metric: "Conversão", val: 65 }, { metric: "Autoridade", val: 70 }],
      lineData: [{ semana: "S1", progresso: 20 }, { semana: "S2", progresso: 45 }, { semana: "S3", progresso: 70 }, { semana: "S4", progresso: 85 }, { semana: "S5", progresso: 95 }, { semana: "S6", progresso: 100 }],
      insight: "Q1 foi concluído com sucesso. A base de seguidores estabelecida cria o alicerce para as conversões nos próximos trimestres."
    }
  },
  {
    quarter: "Q2", title: "Coletar Social", period: "Jun – Ago",
    status: "in_progress", progress: 60, color: "from-teal-600 to-cyan-700", accent: "#0891b2",
    items: ["Início das captações de prova social", "Planejamento de lançamento", "Lançamento de teasers"],
    detail: {
      objetivo: "Captar depoimentos e cases de sucesso dos clientes aprovados para construção da prova social estratégica.",
      kpis: [{ label: "Clientes abordados", val: "8", meta: "12" }, { label: "Depoimentos captados", val: "3", meta: "4" }, { label: "Teasers publicados", val: "6", meta: "8" }],
      radarData: [{ metric: "Captação", val: 60 }, { metric: "Qualidade", val: 75 }, { metric: "Alcance", val: 55 }, { metric: "Engajamento", val: 65 }, { metric: "Conversão", val: 50 }],
      lineData: [{ semana: "S1", progresso: 10 }, { semana: "S2", progresso: 25 }, { semana: "S3", progresso: 40 }, { semana: "S4", progresso: 55 }, { semana: "S5", progresso: 60 }, { semana: "S6", progresso: 60 }],
      insight: "Estamos a 60% do objetivo. Os próximos passos focam em ampliar o número de clientes abordados e finalizar os teasers restantes."
    }
  },
  {
    quarter: "Q3", title: "Publicar Social Proof", period: "Set – Nov",
    status: "pending", progress: 0, color: "from-rose-500 to-pink-600", accent: "#e11d48",
    items: ["3 a 4 Storytellings de casos de sucesso", "Publicações em todo omnichannel", "Publicações no site: Histórias que Transformam"],
    detail: {
      objetivo: "Publicar cases de sucesso elaborados em formato de storytelling, distribuídos em todos os canais digitais da AF.",
      kpis: [{ label: "Cases publicados", val: "0", meta: "4" }, { label: "Alcance estimado", val: "0", meta: "50K" }, { label: "Leads gerados", val: "0", meta: "20" }],
      radarData: [{ metric: "Conteúdo", val: 0 }, { metric: "Distribuição", val: 0 }, { metric: "Alcance", val: 0 }, { metric: "Conversão", val: 0 }, { metric: "Autoridade", val: 0 }],
      lineData: [{ semana: "S1", progresso: 0 }, { semana: "S2", progresso: 0 }, { semana: "S3", progresso: 0 }, { semana: "S4", progresso: 0 }, { semana: "S5", progresso: 0 }, { semana: "S6", progresso: 0 }],
      insight: "Q3 inicia em Setembro. A qualidade dos cases captados em Q2 será determinante para o impacto desta fase."
    }
  },
  {
    quarter: "Q4", title: "Consolidar Autoridade", period: "Dez",
    status: "pending", progress: 0, color: "from-blue-500 to-blue-700", accent: "#1d4ed8",
    items: ["Publicações no blog: temas transversais", "Consolidação da autoridade digital", "Avaliação de resultados anuais"],
    detail: {
      objetivo: "Consolidar a AF como referência digital em FNO no Pará, com publicações de alta autoridade e avaliação do ciclo anual.",
      kpis: [{ label: "Posts no blog", val: "0", meta: "6" }, { label: "Posição SEO média", val: "-", meta: "Top 10" }, { label: "NPS anual", val: "-", meta: "85+" }],
      radarData: [{ metric: "SEO", val: 0 }, { metric: "Autoridade", val: 0 }, { metric: "Conteúdo", val: 0 }, { metric: "Resultados", val: 0 }, { metric: "Planejamento", val: 0 }],
      lineData: [{ semana: "S1", progresso: 0 }, { semana: "S2", progresso: 0 }, { semana: "S3", progresso: 0 }, { semana: "S4", progresso: 0 }, { semana: "S5", progresso: 0 }, { semana: "S6", progresso: 0 }],
      insight: "Q4 é o trimestre de consolidação e avaliação. O sucesso depende da execução consistente de Q1 a Q3."
    }
  }
]

const statusConfig = {
  complete:    { icon: CheckCircle2, label: "Completo",     className: "text-emerald-600 bg-emerald-50" },
  in_progress: { icon: Clock,        label: "Em Andamento", className: "text-blue-600 bg-blue-50" },
  pending:     { icon: Pause,        label: "Pendente",     className: "text-gray-400 bg-gray-100" },
}

function EditField({ value, onChange, className = "", dark, isAdmin }: {
  value: string; onChange: (v: string) => void
  className?: string; dark?: boolean; isAdmin: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  const save = () => { onChange(draft); setEditing(false) }

  if (!isAdmin) return <span className={className}>{value}</span>

  if (editing) return (
    <span className="inline-flex items-center gap-1">
      <input autoFocus value={draft} onChange={e => setDraft(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && save()}
        className={`bg-black/10 border border-black/20 rounded px-1 py-0.5 outline-none ${className}`}
        style={{ minWidth: 80 }} />
      <button onClick={save} className="p-0.5 rounded bg-black/10"><Check size={11} /></button>
    </span>
  )

  return (
    <span className="inline-flex items-center gap-1 group/ef cursor-pointer" onClick={() => setEditing(true)}>
      <span className={className}>{value}</span>
      <Pencil size={11} className={`opacity-0 group-hover/ef:opacity-60 transition-opacity flex-shrink-0 ${dark ? 'text-white/50' : 'text-gray-400'}`} />
    </span>
  )
}

export default function RoadmapTimeline({ dark, isAdmin = false }: { dark?: boolean; isAdmin?: boolean }) {
  const [phases, setPhases] = useState<PhaseItem[]>(initialPhases)
  const [selected, setSelected] = useState<PhaseItem | null>(null)

  const updatePhase = (i: number, field: keyof PhaseItem, value: string | number) => {
    if (!isAdmin) return
    setPhases(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  const updateItem = (phaseIdx: number, itemIdx: number, value: string) => {
    if (!isAdmin) return
    setPhases(prev => prev.map((p, i) => {
      if (i !== phaseIdx) return p
      const newItems = [...p.items]; newItems[itemIdx] = value
      return { ...p, items: newItems }
    }))
  }

  return (
    <>
      <div className="space-y-4">
        {phases.map((phase, i) => {
          const StatusIcon = statusConfig[phase.status].icon
          return (
            <div key={i} className={`rounded-xl border p-6 transition-all duration-300 group ${dark ? 'bg-white/10 border-white/10 hover:bg-white/15' : 'bg-white border-gray-100 hover:shadow-lg'}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}>
                  <EditField value={phase.quarter} onChange={v => updatePhase(i, 'quarter', v)} className="text-white font-extrabold text-sm" dark={dark} isAdmin={isAdmin} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>
                      <EditField value={phase.title} onChange={v => updatePhase(i, 'title', v)} className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`} dark={dark} isAdmin={isAdmin} />
                    </h3>
                    <EditField value={phase.period} onChange={v => updatePhase(i, 'period', v)} className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`} dark={dark} isAdmin={isAdmin} />
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[phase.status].className}`}>
                      <StatusIcon size={12} />{statusConfig[phase.status].label}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden mb-4 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <div className={`h-full rounded-full bg-gradient-to-r ${phase.color} transition-all duration-700`} style={{ width: `${phase.progress}%` }} />
                  </div>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className={`flex items-start gap-2 text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dark ? 'bg-white/30' : 'bg-gray-300'}`} />
                        <EditField value={item} onChange={v => updateItem(i, j, v)} className={`text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`} dark={dark} isAdmin={isAdmin} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className={`text-2xl font-extrabold ${dark ? 'text-white/20' : 'text-gray-200'}`}>
                    <EditField value={String(phase.progress)} onChange={v => updatePhase(i, 'progress', Number(v) || 0)} className={`text-2xl font-extrabold ${dark ? 'text-white/20' : 'text-gray-200'}`} dark={dark} isAdmin={isAdmin} />%
                  </div>
                  <button
                    onClick={() => setSelected(phase)}
                    className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg"
                    style={{ background: `${phase.accent}20`, color: phase.accent }}
                  >
                    Ver detalhes <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100" style={{ background: `${selected.accent}10` }}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-white font-extrabold text-xl`}>{selected.quarter}</div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">{selected.title}</h2>
                  <p className="text-sm text
