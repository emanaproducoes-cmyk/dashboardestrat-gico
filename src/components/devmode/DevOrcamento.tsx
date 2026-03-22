import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2 } from "lucide-react"
import { usePlanningData, Orcamento, ReceitaItem, DespesaItem } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]

export default function DevOrcamento({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<Orcamento>(data.orcamento)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<"receitas" | "despesas">("receitas")

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
    await saveSection("orcamento", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addReceita = () => {
    setDraft(prev => ({
      ...prev,
      receitas: [...prev.receitas, { id: Date.now().toString(), categoria: "", meses: Array(12).fill(0) }]
    }))
  }

  const addDespesa = () => {
    setDraft(prev => ({
      ...prev,
      despesas: [...prev.despesas, { id: Date.now().toString(), categoria: "", meses: Array(12).fill(0) }]
    }))
  }

  const removeReceita = (id: string) => setDraft(prev => ({ ...prev, receitas: prev.receitas.filter(r => r.id !== id) }))
  const removeDespesa = (id: string) => setDraft(prev => ({ ...prev, despesas: prev.despesas.filter(d => d.id !== id) }))

  const updateReceitaCategoria = (id: string, value: string) => {
    setDraft(prev => ({ ...prev, receitas: prev.receitas.map(r => r.id === id ? { ...r, categoria: value } : r) }))
  }

  const updateReceitaMes = (id: string, mesIdx: number, value: number) => {
    setDraft(prev => ({ ...prev, receitas: prev.receitas.map(r => r.id === id ? { ...r, meses: r.meses.map((m, i) => i === mesIdx ? value : m) } : r) }))
  }

  const updateDespesaCategoria = (id: string, value: string) => {
    setDraft(prev => ({ ...prev, despesas: prev.despesas.map(d => d.id === id ? { ...d, categoria: value } : d) }))
  }

  const updateDespesaMes = (id: string, mesIdx: number, value: number) => {
    setDraft(prev => ({ ...prev, despesas: prev.despesas.map(d => d.id === id ? { ...d, meses: d.meses.map((m, i) => i === mesIdx ? value : m) } : d) }))
  }

  const totalReceitas = draft.receitas.reduce((sum, r) => sum + r.meses.reduce((a, b) => a + b, 0), 0)
  const totalDespesas = draft.despesas.reduce((sum, d) => sum + d.meses.reduce((a, b) => a + b, 0), 0)
  const resultado = totalReceitas - totalDespesas

  const formatCurrency = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })

  const renderTable = (items: (ReceitaItem | DespesaItem)[], onRemove: (id: string) => void, onUpdateCategoria: (id: string, v: string) => void, onUpdateMes: (id: string, i: number, v: number) => void) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr style={{ borderBottom: `1px solid ${cardBorder}` }}>
            <th className={`px-3 py-2.5 text-left font-semibold ${textSecondary} min-w-[140px]`}>Categoria</th>
            {MESES.map(m => <th key={m} className={`px-2 py-2.5 text-center font-semibold ${textSecondary} min-w-[70px]`}>{m}</th>)}
            <th className={`px-3 py-2.5 text-right font-semibold ${textSecondary}`}>Total</th>
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const total = item.meses.reduce((a, b) => a + b, 0)
            return (
              <tr key={item.id} style={{ borderBottom: i < items.length - 1 ? `1px solid ${cardBorder}` : "none" }}>
                <td className="px-3 py-2">
                  <input value={item.categoria}
                    onChange={e => onUpdateCategoria(item.id, e.target.value)}
                    className={`w-full px-2 py-1.5 rounded-lg outline-none ${inputText}`}
                    style={inputStyle} placeholder="Categoria..." />
                </td>
                {item.meses.map((val, mi) => (
                  <td key={mi} className="px-2 py-2">
                    <input type="number" value={val}
                      onChange={e => onUpdateMes(item.id, mi, Number(e.target.value))}
                      className={`w-full px-2 py-1.5 rounded-lg text-center outline-none ${inputText}`}
                      style={inputStyle} />
                  </td>
                ))}
                <td className={`px-3 py-2 text-right font-bold ${textPrimary}`}>
                  {formatCurrency(total)}
                </td>
                <td className="px-2 py-2">
                  <button onClick={() => onRemove(item.id)} className="p-1 rounded text-red-400">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Receitas", value: totalReceitas, color: "#22c55e" },
          { label: "Total Despesas", value: totalDespesas, color: "#ef4444" },
          { label: "Resultado", value: resultado, color: resultado >= 0 ? "#22c55e" : "#ef4444" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <p className={`text-xs ${textSecondary} mb-1`}>{s.label}</p>
            <p className="text-lg font-extrabold" style={{ color: s.color }}>{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["receitas", "despesas"] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === t ? accent.css : cardBg,
              color: activeTab === t ? "#fff" : darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              border: `1px solid ${cardBorder}`,
            }}>
            {t === "receitas" ? "📈 Receitas" : "📉 Despesas"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${cardBorder}` }}>
          <h3 className={`font-bold ${textPrimary}`}>
            {activeTab === "receitas" ? "Projeção de Receitas" : "Projeção de Despesas"}
          </h3>
          <button onClick={activeTab === "receitas" ? addReceita : addDespesa}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white"
            style={{ background: activeTab === "receitas" ? "#22c55e" : "#ef4444" }}>
            <Plus size={13} /> Adicionar linha
          </button>
        </div>
        {activeTab === "receitas"
          ? renderTable(draft.receitas, removeReceita, updateReceitaCategoria, updateReceitaMes)
          : renderTable(draft.despesas, removeDespesa, updateDespesaCategoria, updateDespesaMes)
        }
      </div>

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.orcamento)}
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
