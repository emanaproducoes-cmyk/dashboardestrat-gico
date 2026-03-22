import React, { useState } from "react"
import { Save, RotateCcw } from "lucide-react"
import { usePlanningData, Acompanhamento, RevisaoTrimestral } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const TRIMESTRES = [
  { key: "q1" as const, label: "Q1 — Jan/Fev/Mar", color: "#3b82f6" },
  { key: "q2" as const, label: "Q2 — Abr/Mai/Jun", color: "#8b5cf6" },
  { key: "q3" as const, label: "Q3 — Jul/Ago/Set", color: "#f59e0b" },
  { key: "q4" as const, label: "Q4 — Out/Nov/Dez", color: "#22c55e" },
]

const CAMPOS: { key: keyof RevisaoTrimestral; label: string; placeholder: string }[] = [
  { key: "okrsRevisados", label: "OKRs revisados", placeholder: "Quais OKRs foram revisados neste trimestre?" },
  { key: "kpisPeriodo", label: "KPIs do período", placeholder: "Como foram os KPIs no período?" },
  { key: "acoesConcluidas", label: "Ações concluídas", placeholder: "Quais ações foram concluídas?" },
  { key: "desvios", label: "Desvios identificados", placeholder: "Quais desvios foram identificados?" },
  { key: "ajustes", label: "Ajustes / Decisões tomadas", placeholder: "Quais ajustes ou decisões foram feitos?" },
  { key: "proximosPassos", label: "Próximos passos", placeholder: "Quais são os próximos passos?" },
]

export default function DevAcompanhamento({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<Acompanhamento>(data.acompanhamento)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeQ, setActiveQ] = useState<"q1" | "q2" | "q3" | "q4">("q1")

  const accent = accentGradient || { css: "linear-gradient(135deg,#3b82f6,#8b5cf6)", from: "#3b82f6" }
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const textPrimary = darkMode ? "text-white" : "text-gray-900"
  const textSecondary = darkMode ? "text-white/50" : "text-gray-500"
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
  const inputBorder = darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
  const inputText = darkMode ? "text-white" : "text-gray-900"
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}`, resize: "none" as const }

  const handleSave = async () => {
    setSaving(true)
    await saveSection("acompanhamento", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateCampo = (q: keyof Acompanhamento, field: keyof RevisaoTrimestral, value: string) => {
    setDraft(prev => ({ ...prev, [q]: { ...prev[q], [field]: value } }))
  }

  const activeData = TRIMESTRES.find(t => t.key === activeQ)

  const getCompleteness = (q: keyof Acompanhamento) => {
    const revisao = draft[q]
    const filled = Object.values(revisao).filter(v => v.trim().length > 0).length
    return Math.round((filled / CAMPOS.length) * 100)
  }

  return (
    <div className="space-y-4">
      {/* Quarter selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TRIMESTRES.map(t => {
          const pct = getCompleteness(t.key)
          const isActive = activeQ === t.key
          return (
            <button key={t.key} onClick={() => setActiveQ(t.key)}
              className="rounded-2xl p-4 text-left transition-all"
              style={{
                background: isActive ? t.color + "20" : cardBg,
                border: `1px solid ${isActive ? t.color : cardBorder}`,
              }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold" style={{ color: t.color }}>{t.key.toUpperCase()}</span>
                <span className="text-xs font-bold" style={{ color: t.color }}>{pct}%</span>
              </div>
              <p className={`text-[11px] ${textSecondary} mb-2`}>{t.label.split("—")[1]?.trim()}</p>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: t.color }} />
              </div>
            </button>
          )
        })}
      </div>

      {/* Active quarter editor */}
      <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ background: activeData?.color }} />
          <h3 className={`font-bold ${textPrimary}`}>🔄 {activeData?.label}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAMPOS.map(campo => (
            <div key={campo.key}>
              <label className={`text-[10px] uppercase tracking-wider block mb-1.5 ${textSecondary}`}>
                {campo.label}
              </label>
              <textarea
                value={draft[activeQ][campo.key]}
                onChange={e => updateCampo(activeQ, campo.key, e.target.value)}
                rows={3}
                className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${inputText}`}
                style={inputStyle}
                placeholder={campo.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.acompanhamento)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${textSecondary}`}
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <RotateCcw size={14} /> Descartar
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: saved ? "linear-gradient(135deg,#22c55e,#16a34a)" : accent.css, opacity: saving ? 0.7 : 1 }}>
          <Save size={14} />
          {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar para todos"}
        </button>
      </div>
    </div>
  )
}
