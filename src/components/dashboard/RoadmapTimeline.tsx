import React, { useState, useEffect } from "react"
import { CheckCircle2, Clock, Pause, ArrowRight, X, Code2 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts"
import { db } from "../../lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export interface RoadmapFase {
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

const DEFAULT_PHASES: RoadmapFase[] = [
  {
    quarter: "Q1", title: "Lançamento do Mixchannel", period: "Mar – Abr",
    status: "complete", progress: 100, color: "from-blue-600 to-indigo-700", accent: "#6366f1",
    items: ["Lançamento das novas redes: LI e YT", "Captação de novos seguidores para os novos canais", "Postagens semanais em ambos canais"],
    detail: {
      objetivo: "Estabelecer presença digital sólida no LinkedIn e YouTube, criando base de audiência qualificada.",
      kpis: [{ label: "Seguidores LinkedIn", val: "80", meta: "200" }, { label: "Inscritos YouTube", val: "50", meta: "500" }, { label: "Posts publicados", val: "24", meta: "24" }],
      radarData: [{ metric: "Alcance", val: 100 }, { metric: "Conteúdo", val: 100 }, { metric: "Engajamento", val: 80 }, { metric: "Conversão", val: 65 }, { metric: "Autoridade", val: 70 }],
      lineData: [{ semana: "S1", progresso: 20 }, { semana: "S2", progresso: 45 }, { semana: "S3", progresso: 70 }, { semana: "S4", progresso: 85 }, { semana: "S5", progresso: 95 }, { semana: "S6", progresso: 100 }],
      insight: "Q1 foi concluído com sucesso. A base de seguidores estabelecida cria o alicerce para conversões futuras."
    }
  },
  {
    quarter: "Q2", title: "Coletar Social Proof", period: "Jun – Ago",
    status: "in_progress", progress: 60, color: "from-teal-600 to-cyan-700", accent: "#0891b2",
    items: ["Início das captações de prova social", "Planejamento de lançamento", "Lançamento de teasers"],
    detail: {
      objetivo: "Captar depoimentos e cases de sucesso dos clientes aprovados para construção da prova social.",
      kpis: [{ label: "Clientes abordados", val: "8", meta: "12" }, { label: "Depoimentos captados", val: "3", meta: "4" }, { label: "Teasers publicados", val: "6", meta: "8" }],
      radarData: [{ metric: "Captação", val: 60 }, { metric: "Qualidade", val: 75 }, { metric: "Alcance", val: 55 }, { metric: "Engajamento", val: 65 }, { metric: "Conversão", val: 50 }],
      lineData: [{ semana: "S1", progresso: 10 }, { semana: "S2", progresso: 25 }, { semana: "S3", progresso: 40 }, { semana: "S4", progresso: 55 }, { semana: "S5", progresso: 60 }, { semana: "S6", progresso: 60 }],
      insight: "Estamos a 60% do objetivo. Os próximos passos focam em ampliar o número de clientes abordados."
    }
  },
  {
    quarter: "Q3", title: "Publicar Social Proof", period: "Set – Nov",
    status: "pending", progress: 0, color: "from-rose-500 to-pink-600", accent: "#e11d48",
    items: ["3 a 4 Storytellings de casos de sucesso", "Publicações em todo omnichannel", "Publicações no site: Histórias que Transformam"],
    detail: {
      objetivo: "Publicar cases de sucesso em formato de storytelling, distribuídos em todos os canais digitais.",
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
      objetivo: "Consolidar a AF como referência digital em FNO no Pará, com avaliação do ciclo anual.",
      kpis: [{ label: "Posts no blog", val: "0", meta: "6" }, { label: "Posição SEO média", val: "-", meta: "Top 10" }, { label: "NPS anual", val: "-", meta: "85+" }],
      radarData: [{ metric: "SEO", val: 0 }, { metric: "Autoridade", val: 0 }, { metric: "Conteúdo", val: 0 }, { metric: "Resultados", val: 0 }, { metric: "Planejamento", val: 0 }],
      lineData: [{ semana: "S1", progresso: 0 }, { semana: "S2", progresso: 0 }, { semana: "S3", progresso: 0 }, { semana: "S4", progresso: 0 }, { semana: "S5", progresso: 0 }, { semana: "S6", progresso: 0 }],
      insight: "Q4 é o trimestre de consolidação. O sucesso depende da execução consistente de Q1 a Q3."
    }
  }
]

const statusConfig = {
  complete:    { icon: CheckCircle2, label: "Concluído",    cls: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  in_progress: { icon: Clock,        label: "Em Andamento", cls: "text-blue-600 bg-blue-50 border-blue-200" },
  pending:     { icon: Pause,        label: "Pendente",     cls: "text-gray-400 bg-gray-100 border-gray-200" },
}

function CustomTooltip({ active, payload, dark }: { active?: boolean; payload?: { value: number }[]; dark?: boolean }) {
  if (!active || !payload?.length) return null
  const bg  = dark ? "#1e293b" : "#ffffff"
  const txt = dark ? "#f1f5f9" : "#1e293b"
  return (
    <div style={{ background: bg, border: "1px solid rgba(99,102,241,0.3)", borderRadius: 10, padding: "8px 14px" }}>
      <p style={{ color: txt, fontWeight: 700, fontSize: 13 }}>{payload[0].value}%</p>
    </div>
  )
}

export default function RoadmapTimeline({ dark }: { dark?: boolean }) {
  const [phases, setPhases] = useState<RoadmapFase[]>(DEFAULT_PHASES)
  const [selected, setSelected] = useState<RoadmapFase | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const ref = doc(db, "planning", "main")
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        if (d.roadmapFases && Array.isArray(d.roadmapFases) && d.roadmapFases.length) {
          setPhases(d.roadmapFases)
        }
      }
    })
    return unsub
  }, [])

  const valC = dark ? "text-white" : "text-gray-900"
  const subC = dark ? "text-white/50" : "text-gray-500"

  const overallProgress = Math.round(phases.reduce((s, p) => s + p.progress, 0) / phases.length)

  return (
    <>
      <div>
        {/* Section header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold ${valC}`}>Roadmap Estratégico</h2>
            <p className={`text-sm mt-0.5 ${subC}`}>Progresso anual — clique em uma fase para detalhes</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-1 flex-shrink-0"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)" }}
            title="Para editar: Dev Mode → aba Roadmap"
          >
            <Code2 size={11} className="text-indigo-400" />
            <span className="text-[10px] text-indigo-400 font-semibold">Dev Mode → Roadmap</span>
          </div>
        </div>

        {/* Overall progress bar */}
        <div className={`rounded-xl border p-4 mb-4 ${dark ? "bg-white/5 border-white/10" : "bg-white border-gray-100"}`}>
          <div className="flex justify-between items-center mb-2">
            <span className={`text-xs font-semibold ${valC}`}>Progresso Geral do Ano</span>
            <span className="text-xs font-extrabold" style={{ color: "#6366f1" }}>{overallProgress}%</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${dark ? "bg-white/10" : "bg-gray-100"}`}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%`, background: "linear-gradient(90deg,#6366f1,#06b6d4,#f97316)" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {phases.map((p) => (
              <span key={p.quarter} className="text-[10px] font-semibold" style={{ color: p.accent }}>{p.quarter}</span>
            ))}
          </div>
        </div>

        {/* Phase cards */}
        <div className="space-y-3">
          {phases.map((phase, i) => {
            const StatusIcon = statusConfig[phase.status].icon
            const isHov = hovered === i
            return (
              <div
                key={i}
                className={`rounded-xl border p-5 cursor-pointer transition-all duration-250 group
                  ${dark ? "bg-white/5 border-white/10" : "bg-white border-gray-100"}`}
                style={{
                  transform: isHov ? "translateY(-2px)" : "none",
                  boxShadow: isHov ? `0 8px 24px ${phase.accent}28` : undefined,
                  borderColor: isHov ? `${phase.accent}50` : undefined,
                  transition: "all 0.22s ease"
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setSelected(phase)}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Quarter badge */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-extrabold text-sm">{phase.quarter}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className={`font-bold text-base ${valC}`}>{phase.title}</h3>
                      <span className={`text-xs ${subC}`}>{phase.period}</span>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${statusConfig[phase.status].cls}`}>
                        <StatusIcon size={11} />{statusConfig[phase.status].label}
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className={`w-full h-2 rounded-full overflow-hidden mb-3 ${dark ? "bg-white/10" : "bg-gray-100"}`}>
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${phase.color} transition-all duration-700`}
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>

                    <ul className="space-y-1">
                      {phase.items.map((item, j) => (
                        <li key={j} className={`flex items-start gap-2 text-xs ${dark ? "text-white/55" : "text-gray-500"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dark ? "bg-white/25" : "bg-gray-300"}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className={`text-2xl font-extrabold ${dark ? "text-white/20" : "text-gray-200"}`}>
                      {phase.progress}%
                    </div>
                    <button
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

        {/* Dev Mode path hint */}
        <div className="flex items-center gap-2 mt-4 p-2.5 rounded-lg"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.14)" }}>
          <Code2 size={12} className="text-indigo-400 flex-shrink-0" />
          <p className="text-[11px] text-indigo-400">
            Para editar fases, progresso e dados: <strong>Dev Mode → aba "Roadmap"</strong>. Salvo aparece aqui em tempo real para todos.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100" style={{ background: `${selected.accent}10` }}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-white font-extrabold text-xl`}>
                  {selected.quarter}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">{selected.title}</h2>
                  <p className="text-sm text-gray-500">{selected.period} · {statusConfig[selected.status].label}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-xl p-4" style={{ background: `${selected.accent}10` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: selected.accent }}>🎯 Objetivo</p>
                <p className="text-sm text-gray-700">{selected.detail.objetivo}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">Progresso Atual</p>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-5xl font-extrabold mb-2" style={{ color: selected.accent }}>{selected.progress}%</div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${selected.color}`}
                        style={{ width: `${selected.progress}%`, transition: "width 1s ease" }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Meta: 100%</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-3">KPIs</p>
                  <div className="space-y-2">
                    {selected.detail.kpis.map((k, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <span className="text-xs text-gray-600">{k.label}</span>
                        <div className="text-right">
                          <span className="text-sm font-bold" style={{ color: selected.accent }}>{k.val}</span>
                          <span className="text-xs text-gray-400 ml-1">/ {k.meta}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Curva de Progresso</p>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={selected.detail.lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="progresso" stroke={selected.accent} strokeWidth={3} dot={{ r: 5, fill: selected.accent }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Radar de Competências</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={selected.detail.radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <Radar dataKey="val" stroke={selected.accent} fill={selected.accent} fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl p-4 border-l-4" style={{ background: `${selected.accent}08`, borderColor: selected.accent }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: selected.accent }}>💡 Insight</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.detail.insight}</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <Code2 size={13} className="text-indigo-500 flex-shrink-0" />
                <p className="text-xs text-indigo-500">
                  Edite esses dados em: <strong>Dev Mode → aba "Roadmap"</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
