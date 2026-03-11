import React, { useState } from "react"
import { CheckCircle2, Clock, Pause, Pencil, Check } from "lucide-react"

interface PhaseItem {
  quarter: string
  title: string
  period: string
  status: "complete" | "in_progress" | "pending"
  progress: number
  color: string
  items: string[]
}

const initialPhases: PhaseItem[] = [
  {
    quarter: "Q1",
    title: "Lançamento do Mixchannel",
    period: "Mar – Abr",
    status: "complete",
    progress: 100,
    color: "from-blue-600 to-indigo-700",
    items: [
      "Lançamento das novas redes: LI e YT",
      "Captação de novos seguidores para os novos canais",
      "Postagens semanais em ambos canais"
    ]
  },
  {
    quarter: "Q2",
    title: "Coletar Social",
    period: "Jun – Ago",
    status: "in_progress",
    progress: 60,
    color: "from-teal-600 to-cyan-700",
    items: [
      "Início das captações de prova social",
      "Planejamento de lançamento",
      "Lançamento de teasers"
    ]
  },
  {
    quarter: "Q3",
    title: "Publicar Social Proof",
    period: "Set – Nov",
    status: "pending",
    progress: 0,
    color: "from-rose-500 to-pink-600",
    items: [
      "3 a 4 Storytellings de casos de sucesso",
      "Publicações em todo omnichannel",
      "Publicações no site: Histórias que Transformam"
    ]
  },
  {
    quarter: "Q4",
    title: "Consolidar Autoridade",
    period: "Dez",
    status: "pending",
    progress: 0,
    color: "from-blue-500 to-blue-700",
    items: [
      "Publicações no blog: temas transversais",
      "Consolidação da autoridade digital",
      "Avaliação de resultados anuais"
    ]
  }
]

const statusConfig = {
  complete: { icon: CheckCircle2, label: "Completo", className: "text-emerald-600 bg-emerald-50" },
  in_progress: { icon: Clock, label: "Em Andamento", className: "text-blue-600 bg-blue-50" },
  pending: { icon: Pause, label: "Pendente", className: "text-gray-400 bg-gray-100" },
}

interface EditFieldProps {
  value: string
  onChange: (v: string) => void
  className?: string
  dark?: boolean
  multiline?: boolean
}

function EditField({ value, onChange, className = "", dark, multiline }: EditFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  React.useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  const save = () => { onChange(draft); setEditing(false) }

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1">
        {multiline ? (
          <textarea
            autoFocus value={draft}
            onChange={e => setDraft(e.target.value)}
            className={`bg-black/10 border border-black/20 rounded px-1 py-0.5 outline-none resize-none ${className}`}
            rows={2}
            style={{ minWidth: 180 }}
          />
        ) : (
          <input
            autoFocus value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && save()}
            className={`bg-black/10 border border-black/20 rounded px-1 py-0.5 outline-none ${className}`}
            style={{ minWidth: 80 }}
          />
        )}
        <button onClick={save} className="p-0.5 rounded bg-black/10 hover:bg-black/20"><Check size={11} /></button>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 group/ef cursor-pointer" onClick={() => setEditing(true)}>
      <span className={className}>{value}</span>
      <Pencil size={11} className={`opacity-0 group-hover/ef:opacity-60 transition-opacity flex-shrink-0 ${dark ? 'text-white/50' : 'text-gray-400'}`} />
    </span>
  )
}

export default function RoadmapTimeline({ dark }: { dark?: boolean }) {
  const [phases, setPhases] = useState<PhaseItem[]>(initialPhases)

  const updatePhase = (i: number, field: keyof PhaseItem, value: string | number) => {
    setPhases(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p))
  }

  const updateItem = (phaseIdx: number, itemIdx: number, value: string) => {
    setPhases(prev => prev.map((p, i) => {
      if (i !== phaseIdx) return p
      const newItems = [...p.items]
      newItems[itemIdx] = value
      return { ...p, items: newItems }
    }))
  }

  return (
    <div>
      {!dark && <h2 className="text-xl font-bold text-gray-900 mb-1">Roadmap Estratégico</h2>}
      {!dark && <p className="text-sm text-gray-500 mb-6">Linha do tempo de execução de 120 dias</p>}
      <div className="space-y-4">
        {phases.map((phase, i) => {
          const StatusIcon = statusConfig[phase.status].icon
          return (
            <div
              key={i}
              className={`rounded-xl border p-6 hover:brightness-110 transition-all duration-300 ${
                dark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-100 hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-extrabold text-sm">
                    <EditField value={phase.quarter} onChange={v => updatePhase(i, 'quarter', v)} className="text-white font-extrabold text-sm" dark={dark} />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>
                      <EditField value={phase.title} onChange={v => updatePhase(i, 'title', v)} className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`} dark={dark} />
                    </h3>
                    <span className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                      <EditField value={phase.period} onChange={v => updatePhase(i, 'period', v)} className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`} dark={dark} />
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[phase.status].className}`}>
                      <StatusIcon size={12} />
                      {statusConfig[phase.status].label}
                    </span>
                  </div>

                  <div className={`w-full h-2 rounded-full overflow-hidden mb-4 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${phase.color} transition-all duration-700`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>

                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className={`flex items-start gap-2 text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dark ? 'bg-white/30' : 'bg-gray-300'}`} />
                        <EditField
                          value={item}
                          onChange={v => updateItem(i, j, v)}
                          className={`text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`}
                          dark={dark}
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`text-2xl font-extrabold hidden md:block ${dark ? 'text-white/20' : 'text-gray-200'}`}>
                  <EditField
                    value={String(phase.progress)}
                    onChange={v => updatePhase(i, 'progress', Number(v) || 0)}
                    className={`text-2xl font-extrabold ${dark ? 'text-white/20' : 'text-gray-200'}`}
                    dark={dark}
                  />%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
