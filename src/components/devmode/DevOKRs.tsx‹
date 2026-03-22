import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { usePlanningData, Objetivo, KeyResult } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const PILARES = ["P1 - Crescimento & Receita", "P2 - Clientes & Mercado", "P3 - Operações & Processos", "P4 - Pessoas & Cultura", "P5 - Inovação & Tecnologia"]
const STATUS_OPTIONS = ["Não iniciado", "Em andamento", "Concluído", "Atrasado"]

export default function DevOKRs({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<Objetivo[]>(data.objetivos)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([data.objetivos[0]?.id || ""])

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
    await saveSection("objetivos", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleExpanded = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])
  }

  const addObjetivo = () => {
    const newObj: Objetivo = {
      id: Date.now().toString(),
      titulo: "",
      pilar: "P1 - Crescimento & Receita",
      keyResults: [{ id: Date.now().toString() + "kr", descricao: "", baseline: "", meta: "", unidade: "", prazo: "", responsavel: "", status: "Não iniciado", percentual: 0 }]
    }
    setDraft(prev => [...prev, newObj])
    setExpanded(prev => [...prev, newObj.id])
  }

  const removeObjetivo = (id: string) => setDraft(prev => prev.filter(o => o.id !== id))

  const updateObjetivo = (id: string, field: keyof Objetivo, value: any) => {
    setDraft(prev => prev.map(o => o.id === id ? { ...o, [field]: value } : o))
  }

  const addKR = (objId: string) => {
    const kr: KeyResult = { id: Date.now().toString(), descricao: "", baseline: "", meta: "", unidade: "", prazo: "", responsavel: "", status: "Não iniciado", percentual: 0 }
    setDraft(prev => prev.map(o => o.id === objId ? { ...o, keyResults: [...o.keyResults, kr] } : o))
  }

  const removeKR = (objId: string, krId: string) => {
    setDraft(prev => prev.map(o => o.id === objId ? { ...o, keyResults: o.keyResults.filter(k => k.id !== krId) } : o))
  }

  const updateKR = (objId: string, krId: string, field: keyof KeyResult, value: any) => {
    setDraft(prev => prev.map(o => o.id === objId ? {
      ...o,
      keyResults: o.keyResults.map(k => k.id === krId ? { ...k, [field]: value } : k)
    } : o))
  }

  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}` }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={addObjetivo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: accent.css }}>
          <Plus size={15} /> Novo Objetivo
        </button>
      </div>

      {draft.map((obj, oi) => (
        <div key={obj.id} className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          {/* Objective header */}
          <div className="p-5">
            <div className="flex items-start gap-3">
              <span className="text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 mt-1" style={{ background: accent.css + "30", color: accentGradient?.from || "#3b82f6" }}>O{oi + 1}</span>
              <div className="flex-1 space-y-2">
                <input
                  value={obj.titulo}
                  onChange={e => updateObjetivo(obj.id, "titulo", e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm font-medium outline-none ${inputText}`}
                  style={inputStyle}
                  placeholder="Descreva o objetivo estratégico..."
                />
                <select
                  value={obj.pilar}
                  onChange={e => updateObjetivo(obj.id, "pilar", e.target.value)}
                  className={`px-3 py-2 rounded-xl text-xs outline-none ${inputText}`}
                  style={inputStyle}
                >
                  {PILARES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleExpanded(obj.id)} className={`p-1.5 rounded-lg ${textSecondary}`}>
                  {expanded.includes(obj.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button onClick={() => removeObjetivo(obj.id)} className="p-1.5 rounded-lg text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Key Results */}
          {expanded.includes(obj.id) && (
            <div className="px-5 pb-5 space-y-3" style={{ borderTop: `1px solid ${cardBorder}` }}>
              <div className="flex items-center justify-between pt-4">
                <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>Key Results</span>
                <button onClick={() => addKR(obj.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-white"
                  style={{ background: accent.css }}>
                  <Plus size={11} /> KR
                </button>
              </div>
              {obj.keyResults.map((kr, ki) => (
                <div key={kr.id} className="rounded-xl p-4 space-y-3" style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px solid ${cardBorder}` }}>
                  <div className="flex gap-2 items-start">
                    <span className={`text-[10px] font-bold mt-2.5 flex-shrink-0 ${textSecondary}`}>KR{ki + 1}</span>
                    <input
                      value={kr.descricao}
                      onChange={e => updateKR(obj.id, kr.id, "descricao", e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs outline-none ${inputText}`}
                      style={inputStyle}
                      placeholder="Descrição do Key Result..."
                    />
                    <button onClick={() => removeKR(obj.id, kr.id)} className="p-1 rounded text-red-400 flex-shrink-0 mt-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { field: "baseline", placeholder: "Baseline" },
                      { field: "meta", placeholder: "Meta" },
                      { field: "unidade", placeholder: "Unidade" },
                      { field: "prazo", placeholder: "Prazo" },
                    ].map(f => (
                      <input key={f.field}
                        value={(kr as any)[f.field]}
                        onChange={e => updateKR(obj.id, kr.id, f.field as keyof KeyResult, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                        style={inputStyle}
                        placeholder={f.placeholder}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
                    <input
                      value={kr.responsavel}
                      onChange={e => updateKR(obj.id, kr.id, "responsavel", e.target.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                      style={inputStyle}
                      placeholder="Responsável"
                    />
                    <select
                      value={kr.status}
                      onChange={e => updateKR(obj.id, kr.id, "status", e.target.value)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                      style={inputStyle}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${textSecondary}`}>%</span>
                      <input
                        type="number" min={0} max={100}
                        value={kr.percentual}
                        onChange={e => updateKR(obj.id, kr.id, "percentual", Number(e.target.value))}
                        className={`flex-1 px-2.5 py-1.5 rounded-lg text-xs outline-none ${inputText}`}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${kr.percentual}%`, background: accent.css }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.objetivos)}
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
