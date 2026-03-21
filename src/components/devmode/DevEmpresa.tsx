import React, { useState } from "react"
import { Save, RotateCcw } from "lucide-react"
import { usePlanningData } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

export default function DevEmpresa({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState(data.empresa)
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

  const fields = [
    { key: "nome", label: "Empresa / Organização" },
    { key: "segmento", label: "Segmento / Setor" },
    { key: "cnpj", label: "CNPJ" },
    { key: "responsavel", label: "Responsável pelo Planejamento" },
    { key: "cargo", label: "Cargo / Função" },
    { key: "email", label: "E-mail de contato" },
    { key: "periodo", label: "Período do Planejamento" },
    { key: "versao", label: "Versão do Documento" },
  ]

  const handleSave = async () => {
    setSaving(true)
    await saveSection("empresa", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <h2 className={`text-lg font-bold mb-6 ${textPrimary}`}>Dados da Empresa</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className={`text-xs font-medium block mb-1.5 ${textSecondary}`}>{f.label}</label>
              <input
                value={(draft as any)[f.key] || ""}
                onChange={e => setDraft(prev => ({ ...prev, [f.key]: e.target.value }))}
                className={`w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all ${inputText}`}
                style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                placeholder={`Digite ${f.label.toLowerCase()}...`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.empresa)}
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
