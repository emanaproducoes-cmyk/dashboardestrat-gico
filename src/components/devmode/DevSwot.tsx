import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2 } from "lucide-react"
import { usePlanningData, SwotItem } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const QUADRANTS = [
  { key: "forcas",        label: "💪 Forças",        sub: "Internas · Positivas", color: "#22c55e" },
  { key: "oportunidades", label: "🚀 Oportunidades",  sub: "Externas · Positivas", color: "#3b82f6" },
  { key: "fraquezas",     label: "⚠️ Fraquezas",     sub: "Internas · Negativas", color: "#f59e0b" },
  { key: "ameacas",       label: "🔥 Ameaças",       sub: "Externas · Negativas", color: "#ef4444" },
] as const

export default function DevSwot({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState(data.swot)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const accent = accentGradient || { css: "linear-gradient(135deg,#3b82f6,#8b5cf6)", from: "#3b82f6" }
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const textPrimary = darkMode ? "text-white" : "text-gray-900"
  const textSecondary = darkMode ? "text-white/50" : "text-gray-500"
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
  const inputBorder = darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
  const inputText = darkMode ? "text-white" : "text-gray-900"

  const handleSave = async () => {
    setSaving(true)
    await saveSection("swot", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addItem = (key: keyof typeof draft) => {
    setDraft(prev => ({
      ...prev,
      [key]: [...prev[key], { id: Date.now().toString(), fator: "", impacto: "" }]
    }))
  }

  const removeItem = (key: keyof typeof draft, id: string) => {
    setDraft(prev => ({ ...prev, [key]: prev[key].filter(i => i.id !== id) }))
  }

  const updateItem = (key: keyof typeof draft, id: string, field: keyof SwotItem, value: string) => {
    setDraft(prev => ({
      ...prev,
      [key]: prev[key].map(i => i.id === id ? { ...i, [field]: value } : i)
    }))
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUADRANTS.map(q => (
          <div key={q.key} className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className={`font-bold ${textPrimary}`}>{q.label}</h3>
                <p className="text-[11px]" style={{ color: q.color }}>{q.sub}</p>
              </div>
              <button onClick={() => addItem(q.key)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white"
                style={{ background: q.color }}>
                <Plus size={12} /> Add
              </button>
            </div>
            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 mb-1">
                <span className={`text-[10px] uppercase tracking-wider ${textSecondary}`}>Fator</span>
                <span className={`text-[10px] uppercase tracking-wider ${textSecondary}`}>Impacto</span>
              </div>
              {draft[q.key].map((item, i) => (
                <div key={item.id} className="flex gap-2 items-center">
                  <span className={`text-[10px] w-4 flex-shrink-0 ${textSecondary}`}>{i + 1}</span>
                  <input value={item.fator}
                    onChange={e => updateItem(q.key, item.id, "fator", e.target.value)}
                    className={`flex-1 px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`}
                    style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                    placeholder="Fator..." />
                  <input value={item.impacto}
                    onChange={e => updateItem(q.key, item.id, "impacto", e.target.value)}
                    className={`flex-1 px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`}
                    style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                    placeholder="Impacto..." />
                  <button onClick={() => removeItem(q.key, item.id)}
                    className="flex-shrink-0 p-1 rounded"
                    style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.swot)}
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
