import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2 } from "lucide-react"
import { usePlanningData, MembroEquipe } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const NIVEIS = ["Júnior", "Pleno", "Sênior", "Especialista", "Gestor", "Diretor", "C-Level"]
const STATUS_OPTIONS = ["Ativo", "Inativo", "Férias", "Afastado"]

export default function DevEquipe({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<MembroEquipe[]>(data.equipe)
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
    await saveSection("equipe", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addMembro = () => {
    setDraft(prev => [...prev, {
      id: Date.now().toString(), nome: "", cargo: "", area: "",
      email: "", okrPrincipal: "", kpiResponsavel: "",
      nivel: "Pleno", status: "Ativo"
    }])
  }

  const removeMembro = (id: string) => setDraft(prev => prev.filter(m => m.id !== id))

  const updateMembro = (id: string, field: keyof MembroEquipe, value: string) => {
    setDraft(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m))
  }

  const getInitials = (nome: string) => nome.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"

  const statusColor: Record<string, string> = {
    "Ativo": "#22c55e", "Inativo": "#6b7280",
    "Férias": "#f59e0b", "Afastado": "#ef4444"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className={`text-sm ${textSecondary}`}>{draft.length} membro(s) cadastrado(s)</p>
        <button onClick={addMembro}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: accent.css }}>
          <Plus size={15} /> Novo Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {draft.map((membro, i) => (
          <div key={membro.id} className="rounded-2xl p-5 space-y-4"
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            {/* Header com avatar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: accent.css }}>
                  {getInitials(membro.nome)}
                </div>
                <div>
                  <p className={`font-bold text-sm ${textPrimary}`}>{membro.nome || "Novo membro"}</p>
                  <p className={`text-xs ${textSecondary}`}>{membro.cargo || "Cargo não definido"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{ background: (statusColor[membro.status] || "#6b7280") + "20", color: statusColor[membro.status] || "#6b7280" }}>
                  {membro.status}
                </span>
                <button onClick={() => removeMembro(membro.id)} className="p-1 rounded text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Nome</label>
                <input value={membro.nome} onChange={e => updateMembro(membro.id, "nome", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}
                  placeholder="Nome completo..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Cargo</label>
                <input value={membro.cargo} onChange={e => updateMembro(membro.id, "cargo", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}
                  placeholder="Cargo / Função..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Área</label>
                <input value={membro.area} onChange={e => updateMembro(membro.id, "area", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}
                  placeholder="Área / Depto..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>E-mail</label>
                <input value={membro.email} onChange={e => updateMembro(membro.id, "email", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}
                  placeholder="email@..." type="email" />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>OKR Principal</label>
                <input value={membro.okrPrincipal} onChange={e => updateMembro(membro.id, "okrPrincipal", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}
                  placeholder="OKR relacionado..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>KPI Responsável</label>
                <input value={membro.kpiResponsavel} onChange={e => updateMembro(membro.id, "kpiResponsavel", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}
                  placeholder="KPI responsável..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Nível</label>
                <select value={membro.nivel} onChange={e => updateMembro(membro.id, "nivel", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}>
                  {NIVEIS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Status</label>
                <select value={membro.status} onChange={e => updateMembro(membro.id, "status", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-xs outline-none ${inputText}`} style={inputStyle}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      {draft.length === 0 && (
        <div className={`text-center py-12 ${textSecondary}`}
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16 }}>
          <p className="text-sm">Nenhum membro cadastrado. Clique em "Novo Membro" para começar.</p>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.equipe)}
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
