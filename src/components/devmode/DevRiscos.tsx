import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2 } from "lucide-react"
import { usePlanningData, Risco } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const CATEGORIAS = ["Estratégico", "Operacional", "Financeiro", "Legal/Regulatório", "Tecnológico", "Reputacional", "Mercado"]
const STATUS_OPTIONS = ["Ativo", "Mitigado", "Aceito", "Transferido"]

export default function DevRiscos({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<Risco[]>(data.riscos)
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
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}` }

  const handleSave = async () => {
    setSaving(true)
    await saveSection("riscos", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addRisco = () => {
    setDraft(prev => [...prev, {
      id: Date.now().toString(), risco: "", categoria: "Estratégico",
      descricao: "", probabilidade: 1, impacto: 1,
      mitigacao: "", responsavel: "", prazo: "", status: "Ativo"
    }])
  }

  const removeRisco = (id: string) => setDraft(prev => prev.filter(r => r.id !== id))

  const updateRisco = (id: string, field: keyof Risco, value: any) => {
    setDraft(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const nivelRisco = (prob: number, imp: number) => prob * imp
  const nivelColor = (nivel: number) => {
    if (nivel > 15) return "#ef4444"
    if (nivel > 8) return "#f97316"
    if (nivel >= 4) return "#f59e0b"
    return "#22c55e"
  }
  const nivelLabel = (nivel: number) => {
    if (nivel > 15) return "Crítico"
    if (nivel > 8) return "Alto"
    if (nivel >= 4) return "Médio"
    return "Baixo"
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "🔴 Crítico (>15)", color: "#ef4444" },
          { label: "🟠 Alto (9–15)", color: "#f97316" },
          { label: "🟡 Médio (4–8)", color: "#f59e0b" },
          { label: "🟢 Baixo (<4)", color: "#22c55e" },
        ].map(l => (
          <span key={l.label} className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ background: l.color + "20", color: l.color }}>
            {l.label}
          </span>
        ))}
        <button onClick={addRisco}
          className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-medium text-white"
          style={{ background: accent.css }}>
          <Plus size={15} /> Novo Risco
        </button>
      </div>

      {draft.map((risco, i) => {
        const nivel = nivelRisco(risco.probabilidade, risco.impacto)
        const color = nivelColor(nivel)
        return (
          <div key={risco.id} className="rounded-2xl p-5 space-y-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ background: accent.css + "30", color: accentGradient?.from || "#3b82f6" }}>
                  #{i + 1}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: color + "20", color }}>
                  {nivelLabel(nivel)} · {nivel}
                </span>
              </div>
              <button onClick={() => removeRisco(risco.id)} className="p-1.5 rounded-lg text-red-400">
                <Trash2 size={15} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Risco / Ameaça</label>
                <input value={risco.risco} onChange={e => updateRisco(risco.id, "risco", e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                  placeholder="Nome do risco..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Categoria</label>
                <select value={risco.categoria} onChange={e => updateRisco(risco.id, "categoria", e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Descrição</label>
                <textarea value={risco.descricao} onChange={e => updateRisco(risco.id, "descricao", e.target.value)}
                  rows={2} className={`w-full px-3 py-2 rounded-xl text-sm outline-none resize-none ${inputText}`}
                  style={inputStyle} placeholder="Descreva o risco em detalhes..." />
              </div>

              {/* Probabilidade e Impacto */}
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-2 ${textSecondary}`}>
                  Probabilidade (1–5): <span style={{ color }}>{risco.probabilidade}</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => updateRisco(risco.id, "probabilidade", v)}
                      className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: risco.probabilidade === v ? color : inputBg,
                        color: risco.probabilidade === v ? "#fff" : darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                        border: `1px solid ${inputBorder}`,
                      }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-2 ${textSecondary}`}>
                  Impacto (1–5): <span style={{ color }}>{risco.impacto}</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(v => (
                    <button key={v} onClick={() => updateRisco(risco.id, "impacto", v)}
                      className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                      style={{
                        background: risco.impacto === v ? color : inputBg,
                        color: risco.impacto === v ? "#fff" : darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                        border: `1px solid ${inputBorder}`,
                      }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Plano de Mitigação</label>
                <textarea value={risco.mitigacao} onChange={e => updateRisco(risco.id, "mitigacao", e.target.value)}
                  rows={2} className={`w-full px-3 py-2 rounded-xl text-sm outline-none resize-none ${inputText}`}
                  style={inputStyle} placeholder="Como mitigar este risco..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Responsável</label>
                <input value={risco.responsavel} onChange={e => updateRisco(risco.id, "responsavel", e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                  placeholder="Responsável..." />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Prazo</label>
                  <input type="date" value={risco.prazo} onChange={e => updateRisco(risco.id, "prazo", e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle} />
                </div>
                <div className="flex-1">
                  <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Status</label>
                  <select value={risco.status} onChange={e => updateRisco(risco.id, "status", e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      {draft.length === 0 && (
        <div className={`text-center py-12 ${textSecondary}`}
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16 }}>
          <p className="text-sm">Nenhum risco cadastrado. Clique em "Novo Risco" para começar.</p>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.riscos)}
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
