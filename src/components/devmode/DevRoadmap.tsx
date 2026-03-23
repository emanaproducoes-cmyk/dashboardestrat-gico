import React, { useState, useEffect } from "react"
import { Save, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { db } from "../../lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { RoadmapFase } from "../dashboard/RoadmapTimeline"

const DEFAULT_PHASES: RoadmapFase[] = [
  {
    quarter: "Q1", title: "Lançamento do Mixchannel", period: "Mar – Abr",
    status: "complete", progress: 100, color: "from-blue-600 to-indigo-700", accent: "#6366f1",
    items: ["Lançamento das novas redes: LI e YT", "Captação de novos seguidores para os novos canais", "Postagens semanais em ambos canais"],
    detail: {
      objetivo: "Estabelecer presença digital sólida no LinkedIn e YouTube.",
      kpis: [{ label: "Seguidores LinkedIn", val: "80", meta: "200" }, { label: "Inscritos YouTube", val: "50", meta: "500" }, { label: "Posts publicados", val: "24", meta: "24" }],
      radarData: [{ metric: "Alcance", val: 100 }, { metric: "Conteúdo", val: 100 }, { metric: "Engajamento", val: 80 }, { metric: "Conversão", val: 65 }, { metric: "Autoridade", val: 70 }],
      lineData: [{ semana: "S1", progresso: 20 }, { semana: "S2", progresso: 45 }, { semana: "S3", progresso: 70 }, { semana: "S4", progresso: 85 }, { semana: "S5", progresso: 95 }, { semana: "S6", progresso: 100 }],
      insight: "Q1 foi concluído com sucesso."
    }
  },
  {
    quarter: "Q2", title: "Coletar Social Proof", period: "Jun – Ago",
    status: "in_progress", progress: 60, color: "from-teal-600 to-cyan-700", accent: "#0891b2",
    items: ["Início das captações de prova social", "Planejamento de lançamento", "Lançamento de teasers"],
    detail: {
      objetivo: "Captar depoimentos e cases de sucesso dos clientes aprovados.",
      kpis: [{ label: "Clientes abordados", val: "8", meta: "12" }, { label: "Depoimentos captados", val: "3", meta: "4" }, { label: "Teasers publicados", val: "6", meta: "8" }],
      radarData: [{ metric: "Captação", val: 60 }, { metric: "Qualidade", val: 75 }, { metric: "Alcance", val: 55 }, { metric: "Engajamento", val: 65 }, { metric: "Conversão", val: 50 }],
      lineData: [{ semana: "S1", progresso: 10 }, { semana: "S2", progresso: 25 }, { semana: "S3", progresso: 40 }, { semana: "S4", progresso: 55 }, { semana: "S5", progresso: 60 }, { semana: "S6", progresso: 60 }],
      insight: "Estamos a 60% do objetivo."
    }
  },
  {
    quarter: "Q3", title: "Publicar Social Proof", period: "Set – Nov",
    status: "pending", progress: 0, color: "from-rose-500 to-pink-600", accent: "#e11d48",
    items: ["3 a 4 Storytellings de casos de sucesso", "Publicações em todo omnichannel", "Publicações no site: Histórias que Transformam"],
    detail: {
      objetivo: "Publicar cases de sucesso em formato de storytelling.",
      kpis: [{ label: "Cases publicados", val: "0", meta: "4" }, { label: "Alcance estimado", val: "0", meta: "50K" }, { label: "Leads gerados", val: "0", meta: "20" }],
      radarData: [{ metric: "Conteúdo", val: 0 }, { metric: "Distribuição", val: 0 }, { metric: "Alcance", val: 0 }, { metric: "Conversão", val: 0 }, { metric: "Autoridade", val: 0 }],
      lineData: [{ semana: "S1", progresso: 0 }, { semana: "S2", progresso: 0 }, { semana: "S3", progresso: 0 }, { semana: "S4", progresso: 0 }, { semana: "S5", progresso: 0 }, { semana: "S6", progresso: 0 }],
      insight: "Q3 inicia em Setembro."
    }
  },
  {
    quarter: "Q4", title: "Consolidar Autoridade", period: "Dez",
    status: "pending", progress: 0, color: "from-blue-500 to-blue-700", accent: "#1d4ed8",
    items: ["Publicações no blog: temas transversais", "Consolidação da autoridade digital", "Avaliação de resultados anuais"],
    detail: {
      objetivo: "Consolidar a AF como referência digital em FNO no Pará.",
      kpis: [{ label: "Posts no blog", val: "0", meta: "6" }, { label: "Posição SEO média", val: "-", meta: "Top 10" }, { label: "NPS anual", val: "-", meta: "85+" }],
      radarData: [{ metric: "SEO", val: 0 }, { metric: "Autoridade", val: 0 }, { metric: "Conteúdo", val: 0 }, { metric: "Resultados", val: 0 }, { metric: "Planejamento", val: 0 }],
      lineData: [{ semana: "S1", progresso: 0 }, { semana: "S2", progresso: 0 }, { semana: "S3", progresso: 0 }, { semana: "S4", progresso: 0 }, { semana: "S5", progresso: 0 }, { semana: "S6", progresso: 0 }],
      insight: "Q4 é o trimestre de consolidação."
    }
  }
]

const STATUS_OPTIONS: RoadmapFase["status"][] = ["complete", "in_progress", "pending"]
const STATUS_LABELS = { complete: "Concluído", in_progress: "Em Andamento", pending: "Pendente" }

export default function DevRoadmap({ dark }: { dark?: boolean }) {
  const [phases, setPhases]     = useState<RoadmapFase[]>(DEFAULT_PHASES)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  const valC   = dark ? "text-white" : "text-gray-900"
  const subC   = dark ? "text-white/50" : "text-gray-500"
  const inp    = dark
    ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-indigo-400"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400"
  const cardBg = dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"

  useEffect(() => {
    const ref = doc(db, "planning", "main")
    getDoc(ref).then(snap => {
      if (snap.exists() && snap.data().roadmapFases?.length) {
        setPhases(snap.data().roadmapFases)
      }
    })
  }, [])

  const updatePhase = (i: number, field: keyof RoadmapFase, val: string | number) => {
    setPhases(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p))
  }

  const updateItem = (pi: number, ii: number, val: string) => {
    setPhases(prev => prev.map((p, idx) => {
      if (idx !== pi) return p
      const items = [...p.items]; items[ii] = val
      return { ...p, items }
    }))
  }

  const updateKpi = (pi: number, ki: number, field: "label" | "val" | "meta", val: string) => {
    setPhases(prev => prev.map((p, idx) => {
      if (idx !== pi) return p
      const kpis = p.detail.kpis.map((k, kIdx) => kIdx === ki ? { ...k, [field]: val } : k)
      return { ...p, detail: { ...p.detail, kpis } }
    }))
  }

  const updateRadar = (pi: number, ri: number, val: number) => {
    setPhases(prev => prev.map((p, idx) => {
      if (idx !== pi) return p
      const radarData = p.detail.radarData.map((r, rIdx) => rIdx === ri ? { ...r, val } : r)
      return { ...p, detail: { ...p.detail, radarData } }
    }))
  }

  const updateLine = (pi: number, li: number, val: number) => {
    setPhases(prev => prev.map((p, idx) => {
      if (idx !== pi) return p
      const lineData = p.detail.lineData.map((l, lIdx) => lIdx === li ? { ...l, progresso: val } : l)
      return { ...p, detail: { ...p.detail, lineData } }
    }))
  }

  const save = async () => {
    setSaving(true)
    try {
      const ref = doc(db, "planning", "main")
      const snap = await getDoc(ref)
      const current = snap.exists() ? snap.data() : {}
      await setDoc(ref, { ...current, roadmapFases: phases })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className={`font-bold text-base ${valC}`}>Roadmap Estratégico</h3>
        <p className={`text-xs mt-0.5 ${subC}`}>
          Firestore: <code className="text-indigo-400">planning/main → roadmapFases</code>
        </p>
      </div>

      {phases.map((phase, i) => (
        <div key={i} className={`rounded-xl border overflow-hidden ${cardBg}`} style={{ borderLeft: `4px solid ${phase.accent}` }}>
          <button
            className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-extrabold"
                style={{ background: phase.accent }}>{phase.quarter}</span>
              <div>
                <span className={`font-semibold text-sm ${valC}`}>{phase.title}</span>
                <span className={`text-xs ml-2 ${subC}`}>{phase.period}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: `${phase.accent}20`, color: phase.accent }}>
                {phase.progress}%
              </span>
            </div>
            {expanded === i ? <ChevronUp size={15} className={subC} /> : <ChevronDown size={15} className={subC} />}
          </button>

          {expanded === i && (
            <div className="px-4 pb-4 space-y-4 border-t" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
              <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Quarter</label>
                  <input className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                    value={phase.quarter} onChange={e => updatePhase(i, "quarter", e.target.value)} />
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Título</label>
                  <input className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                    value={phase.title} onChange={e => updatePhase(i, "title", e.target.value)} />
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Período</label>
                  <input className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                    value={phase.period} onChange={e => updatePhase(i, "period", e.target.value)} />
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Status</label>
                  <select className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                    value={phase.status} onChange={e => updatePhase(i, "status", e.target.value as RoadmapFase["status"])}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Progresso (0–100)</label>
                  <input type="range" min={0} max={100} step={5}
                    className="mt-2 w-full accent-indigo-500"
                    value={phase.progress}
                    onChange={e => updatePhase(i, "progress", Number(e.target.value))} />
                  <span className={`text-xs font-bold ${valC}`}>{phase.progress}%</span>
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Cor accent</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                      value={phase.accent} onChange={e => updatePhase(i, "accent", e.target.value)} />
                    <input className={`flex-1 rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                      value={phase.accent} onChange={e => updatePhase(i, "accent", e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Objetivo</label>
                <textarea className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 resize-none ${inp}`}
                  rows={2} value={phase.detail.objetivo}
                  onChange={e => setPhases(prev => prev.map((p, idx) => idx === i ? { ...p, detail: { ...p.detail, objetivo: e.target.value } } : p))} />
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Itens da fase</label>
                <div className="mt-1 space-y-1.5">
                  {phase.items.map((item, ii) => (
                    <input key={ii} className={`w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                      value={item} onChange={e => updateItem(i, ii, e.target.value)} />
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>KPIs</label>
                <div className="mt-1 space-y-2">
                  {phase.detail.kpis.map((k, ki) => (
                    <div key={ki} className="grid grid-cols-3 gap-2">
                      <input className={`rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        placeholder="Label" value={k.label} onChange={e => updateKpi(i, ki, "label", e.target.value)} />
                      <input className={`rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        placeholder="Valor" value={k.val} onChange={e => updateKpi(i, ki, "val", e.target.value)} />
                      <input className={`rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        placeholder="Meta" value={k.meta} onChange={e => updateKpi(i, ki, "meta", e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Radar (0–100)</label>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-5 gap-2">
                  {phase.detail.radarData.map((r, ri) => (
                    <div key={ri} className="text-center">
                      <p className={`text-[10px] mb-1 ${subC}`}>{r.metric}</p>
                      <input type="number" min={0} max={100}
                        className={`w-full rounded-lg border px-2 py-1 text-sm text-center outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        value={r.val} onChange={e => updateRadar(i, ri, Number(e.target.value))} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Progresso por semana (%)</label>
                <div className="mt-1 grid grid-cols-6 gap-2">
                  {phase.detail.lineData.map((l, li) => (
                    <div key={li} className="text-center">
                      <p className={`text-[10px] mb-1 ${subC}`}>{l.semana}</p>
                      <input type="number" min={0} max={100}
                        className={`w-full rounded-lg border px-2 py-1 text-sm text-center outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        value={l.progresso} onChange={e => updateLine(i, li, Number(e.target.value))} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Insight</label>
                <textarea className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 resize-none ${inp}`}
                  rows={2} value={phase.detail.insight}
                  onChange={e => setPhases(prev => prev.map((p, idx) => idx === i ? { ...p, detail: { ...p.detail, insight: e.target.value } } : p))} />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
        style={{ background: saved ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)", color: saved ? "#34d399" : "#818cf8" }}
      >
        {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? "Salvando..." : saved ? "✓ Salvo para todos os usuários!" : "Salvar Alterações"}
      </button>
    </div>
  )
}
