import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2 } from "lucide-react"
import { usePlanningData, Acao } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const PRIORIDADES = ["Alta", "Média", "Baixa"]
const STATUS_OPTIONS = ["Não iniciado", "Em andamento", "Concluído", "Cancelado", "Atrasado"]

export default function DevAcoes({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<Acao[]>(data.acoes)
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

  const prioColor: Record<string, string> = {
    "Alta": "#ef4444", "Média": "#f59e0b", "Baixa": "#22c55e"
  }

  const handleSave = async () => {
    setSaving(true)
    await saveSection("acoes", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addAcao = () => {
    setDraft(prev => [...prev, {
      id: Date.now().toString(),
      iniciativa: "", objetivo: "", porque: "", responsavel: "",
      area: "", dataInicio: "", dataFim: "", onde: "", como: "",
      orcamento: "", prioridade: "Alta", status: "Não iniciado"
    }])
  }

  const removeAcao = (id: string) => setDraft(prev => prev.filter(a => a.id !== id))

  const updateAcao = (id: string, field: keyof Acao, value: string) => {
    setDraft(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className={`text-sm ${textSecondary}`}>{draft.length} ação(ões) cadastrada(s)</p>
        <button onClick={addAcao}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: accent.css }}>
          <Plus size={15} /> Nova Ação
        </button>
      </div>

      {draft.map((acao, i) => (
        <div key={acao.id} className="rounded-2xl p-5 space-y-4" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: accent.css + "30", color: accentGradient?.from || "#3b82f6" }}>
                #{i + 1}
              </span>
              <span className="text-xs px-2 py-1 rounded-full font-medium text-white" style={{ background: prioColor[acao.prioridade] }}>
                {acao.prioridade}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${textSecondary}`} style={{ background: inputBg }}>
                {acao.status}
              </span>
            </div>
            <button onClick={() => removeAcao(acao.id)} className="p-1.5 rounded-lg text-red-400">
              <Trash2 size={15} />
            </button>
          </div>

          {/* 5W2H Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>O quê? (Iniciativa)</label>
              <input value={acao.iniciativa} onChange={e => updateAcao(acao.id, "iniciativa", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                placeholder="Descreva a iniciativa..." />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Por quê?</label>
              <input value={acao.porque} onChange={e => updateAcao(acao.id, "porque", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                placeholder="Justificativa..." />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Quem? (Responsável)</label>
              <input value={acao.responsavel} onChange={e => updateAcao(acao.id, "responsavel", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                placeholder="Responsável..." />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Área</label>
              <input value={acao.area} onChange={e => updateAcao(acao.id, "area", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                placeholder="Área / Departamento..." />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Quando? (Início)</label>
              <input type="date" value={acao.dataInicio} onChange={e => updateAcao(acao.id, "dataInicio", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle} />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Quando? (Fim)</label>
              <input type="date" value={acao.dataFim} onChange={e => updateAcao(acao.id, "dataFim", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle} />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Onde?</label>
              <input value={acao.onde} onChange={e => updateAcao(acao.id, "onde", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                placeholder="Local / Canal..." />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Como?</label>
              <input value={acao.como} onChange={e => updateAcao(acao.id, "como", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                placeholder="Método / Abordagem..." />
            </div>
            <div>
              <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Quanto? (Orçamento R$)</label>
              <input value={acao.orcamento} onChange={e => updateAcao(acao.id, "orcamento", e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}
                placeholder="R$ 0,00" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Prioridade</label>
                <select value={acao.prioridade} onChange={e => updateAcao(acao.id, "prioridade", e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}>
                  {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Status</label>
                <select value={acao.status} onChange={e => updateAcao(acao.id, "status", e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm outline-none ${inputText}`} style={inputStyle}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      ))}

      {draft.length === 0 && (
        <div className={`text-center py-12 ${textSecondary}`} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16 }}>
          <p className="text-sm">Nenhuma ação cadastrada. Clique em "Nova Ação" para começar.</p>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.acoes)}
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
