import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2 } from "lucide-react"
import { usePlanningData } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

export default function DevMissao({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState(data.missaoVisao)
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
    await saveSection("missaoVisao", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addValor = () => {
    setDraft(prev => ({
      ...prev,
      valores: [...prev.valores, { id: Date.now().toString(), valor: "", descricao: "" }]
    }))
  }

  const removeValor = (id: string) => {
    setDraft(prev => ({ ...prev, valores: prev.valores.filter(v => v.id !== id) }))
  }

  const updateValor = (id: string, field: "valor" | "descricao", value: string) => {
    setDraft(prev => ({
      ...prev,
      valores: prev.valores.map(v => v.id === id ? { ...v, [field]: value } : v)
    }))
  }

  const textareaStyle = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: darkMode ? "white" : "#111827",
    resize: "none" as const,
  }

  return (
    <div className="space-y-4">
      {/* Missão */}
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <h2 className={`text-lg font-bold mb-4 ${textPrimary}`}>🎯 Missão</h2>
        <label className={`text-xs font-medium block mb-1.5 ${textSecondary}`}>
          Razão de existir da empresa
        </label>
        <textarea
          value={draft.missao}
          onChange={e => setDraft(prev => ({ ...prev, missao: e.target.value }))}
          rows={4}
          className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${inputText}`}
          style={textareaStyle}
          placeholder="Descreva a razão de existir da empresa — o que ela faz, para quem e como..."
        />
      </div>

      {/* Visão */}
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <h2 className={`text-lg font-bold mb-4 ${textPrimary}`}>🔭 Visão</h2>
        <label className={`text-xs font-medium block mb-1.5 ${textSecondary}`}>
          Onde a empresa quer chegar (horizonte 3–5 anos)
        </label>
        <textarea
          value={draft.visao}
          onChange={e => setDraft(prev => ({ ...prev, visao: e.target.value }))}
          rows={4}
          className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${inputText}`}
          style={textareaStyle}
          placeholder="Descreva onde a empresa quer chegar — o futuro desejado..."
        />
      </div>

      {/* Propósito */}
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <h2 className={`text-lg font-bold mb-4 ${textPrimary}`}>💡 Propósito</h2>
        <label className={`text-xs font-medium block mb-1.5 ${textSecondary}`}>
          Impacto maior que a empresa quer gerar
        </label>
        <textarea
          value={draft.proposito}
          onChange={e => setDraft(prev => ({ ...prev, proposito: e.target.value }))}
          rows={3}
          className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${inputText}`}
          style={textareaStyle}
          placeholder="Qual é o impacto maior que a empresa quer gerar no mundo?"
        />
      </div>

      {/* Valores */}
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-bold ${textPrimary}`}>🌟 Valores Organizacionais</h2>
          <button onClick={addValor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: accent.css }}>
            <Plus size={13} /> Adicionar
          </button>
        </div>
        <div className="space-y-3">
          {draft.valores.map((v, i) => (
            <div key={v.id} className="flex gap-3 items-start">
              <span className={`text-xs font-bold mt-3 w-5 flex-shrink-0 ${textSecondary}`}>{i + 1}</span>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  value={v.valor}
                  onChange={e => updateValor(v.id, "valor", e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${inputText}`}
                  style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                  placeholder="Valor / Princípio..."
                />
                <input
                  value={v.descricao}
                  onChange={e => updateValor(v.id, "descricao", e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none ${inputText}`}
                  style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                  placeholder="Como se manifesta na prática..."
                />
              </div>
              <button onClick={() => removeValor(v.id)}
                className="mt-2 p-1.5 rounded-lg transition-colors"
                style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.missaoVisao)}
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
