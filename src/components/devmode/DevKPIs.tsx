import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2 } from "lucide-react"
import { usePlanningData, KPI } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const PERSPECTIVAS = ["Financeira", "Clientes", "Processos Internos", "Aprendizado & Crescimento", "Inovação"]
const FREQUENCIAS = ["Diária", "Semanal", "Mensal", "Trimestral", "Anual"]
const STATUS_OPTIONS = ["Ativo", "Inativo", "Em revisão"]

export default function DevKPIs({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<KPI[]>(data.kpis)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [filterPerspectiva, setFilterPerspectiva] = useState("Todas")

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
    await saveSection("kpis", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addKPI = () => {
    const newKPI: KPI = {
      id: Date.now().toString(),
      perspectiva: filterPerspectiva === "Todas" ? "Financeira" : filterPerspectiva,
      indicador: "", formula: "", baseline: "", meta: "",
      unidade: "", frequencia: "Mensal", responsavel: "", status: "Ativo"
    }
    setDraft(prev => [...prev, newKPI])
  }

  const removeKPI = (id: string) => setDraft(prev => prev.filter(k => k.id !== id))

  const updateKPI = (id: string, field: keyof KPI, value: string) => {
    setDraft(prev => prev.map(k => k.id === id ? { ...k, [field]: value } : k))
  }

  const filtered = filterPerspectiva === "Todas" ? draft : draft.filter(k => k.perspectiva === filterPerspectiva)
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}` }

  const perspColors: Record<string, string> = {
    "Financeira": "#22c55e",
    "Clientes": "#3b82f6",
    "Processos Internos": "#f59e0b",
    "Aprendizado & Crescimento": "#8b5cf6",
    "Inovação": "#ec4899",
  }

  return (
    <div className="space-y-4">
      {/* Filter + Add */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="flex gap-1.5 flex-wrap flex-1">
          {["Todas", ...PERSPECTIVAS].map(p => (
            <button key={p} onClick={() => setFilterPerspectiva(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filterPerspectiva === p ? accent.css : cardBg,
                color: filterPerspectiva === p ? "#fff" : darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
                border: `1px solid ${cardBorder}`,
              }}>
              {p}
            </button>
          ))}
        </div>
        <button onClick={addKPI}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white flex-shrink-0"
          style={{ background: accent.css }}>
          <Plus size={15} /> Novo KPI
        </button>
      </div>

      {/* KPIs table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid ${cardBorder}` }}>
                {["Perspectiva", "Indicador", "Fórmula", "Baseline", "Meta", "Unid.", "Freq.", "Responsável", "Status", ""].map(h => (
                  <th key={h} className={`px-3 py-3 text-left text-[10px] uppercase tracking-wider font-semibold ${textSecondary}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((kpi, i) => (
                <tr key={kpi.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${cardBorder}` : "none" }}>
                  <td className="px-3 py-2.5">
                    <select value={kpi.perspectiva}
                      onChange={e => updateKPI(kpi.id, "perspectiva", e.target.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                      style={{ ...inputStyle, minWidth: 80 }}>
                      {PERSPECTIVAS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </td>
                  {["indicador", "formula", "baseline", "meta", "unidade"].map(f => (
                    <td key={f} className="px-3 py-2.5">
                      <input value={(kpi as any)[f]}
                        onChange={e => updateKPI(kpi.id, f as keyof KPI, e.target.value)}
                        className={`px-2 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                        style={{ ...inputStyle, minWidth: f === "indicador" || f === "formula" ? 120 : 60 }}
                        placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                      />
                    </td>
                  ))}
                  <td className="px-3 py-2.5">
                    <select value={kpi.frequencia}
                      onChange={e => updateKPI(kpi.id, "frequencia", e.target.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                      style={inputStyle}>
                      {FREQUENCIAS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2.5">
                    <input value={kpi.responsavel}
                      onChange={e => updateKPI(kpi.id, "responsavel", e.target.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                      style={{ ...inputStyle, minWidth: 100 }}
                      placeholder="Responsável"
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <select value={kpi.status}
                      onChange={e => updateKPI(kpi.id, "status", e.target.value)}
                      className={`px-2 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                      style={inputStyle}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2.5">
                    <button onClick={() => removeKPI(kpi.id)} className="p-1 rounded text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={10} className={`px-3 py-8 text-center text-sm ${textSecondary}`}>
                    Nenhum KPI nesta perspectiva. Clique em "Novo KPI" para adicionar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.kpis)}
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
