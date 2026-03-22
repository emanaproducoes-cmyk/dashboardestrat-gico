import React, { useState } from "react"
import { Save, RotateCcw, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { usePlanningData, Canal, CanalMensal } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface Props { darkMode?: boolean; accentGradient?: GradientOption }

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]
const TIPOS = ["Redes Sociais","Financeiro","Vendas","Engajamento","Marketing","Outro"]
const CORES_SUGERIDAS = ["#e1306c","#0077b5","#ff4444","#22c55e","#f59e0b","#8b5cf6","#ec4899","#06b6d4","#f97316","#14b8a6"]

export default function DevCanais({ darkMode = true, accentGradient }: Props) {
  const { data, saveSection } = usePlanningData()
  const [draft, setDraft] = useState<Canal[]>(data.canais)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState<string[]>([])

  const accent = accentGradient || { css: "linear-gradient(135deg,#3b82f6,#8b5cf6)", from: "#3b82f6" }
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const innerBg = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
  const textPrimary = darkMode ? "text-white" : "text-gray-900"
  const textSecondary = darkMode ? "text-white/50" : "text-gray-500"
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
  const inputBorder = darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"
  const inputText = darkMode ? "text-white" : "text-gray-900"
  const inputStyle = { background: inputBg, border: `1px solid ${inputBorder}` }

  const handleSave = async () => {
    setSaving(true)
    await saveSection("canais", draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const toggleExpanded = (id: string) =>
    setExpanded(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id])

  const addCanal = () => {
    const newCanal: Canal = {
      id: Date.now().toString(),
      nome: "",
      icone: "??",
      cor: CORES_SUGERIDAS[draft.length % CORES_SUGERIDAS.length],
      unidade: "",
      meta_anual: 0,
      tipo: "Redes Sociais",
      descricao: "",
      ativo: true,
      dados_mensais: MESES.map(mes => ({ mes, valor: 0 }))
    }
    setDraft(prev => [...prev, newCanal])
    setExpanded(prev => [...prev, newCanal.id])
  }

  const removeCanal = (id: string) => setDraft(prev => prev.filter(c => c.id !== id))

  const updateCanal = (id: string, field: keyof Canal, value: any) =>
    setDraft(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))

  const updateMes = (canalId: string, mesIdx: number, valor: number) =>
    setDraft(prev => prev.map(c => c.id === canalId ? {
      ...c,
      dados_mensais: c.dados_mensais.map((m, i) => i === mesIdx ? { ...m, valor } : m)
    } : c))

  const formatNum = (v: number) =>
    v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="rounded-2xl p-4 flex items-start gap-3"
        style={{ background: accent.from + "12", border: `1px solid ${accent.from}25` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
          style={{ background: accent.css }}>i</div>
        <div>
          <p className={`text-sm font-bold ${textPrimary}`}>Canais Dinâmicos</p>
          <p className={`text-xs mt-0.5 ${textSecondary}`}>
            Adicione qualquer tipo de canal — redes sociais, financeiro, vendas, engajamento.
            Os gráficos são gerados automaticamente e aparecem para todos os usuários em tempo real.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className={`text-sm ${textSecondary}`}>{draft.length} canal(is) cadastrado(s)</p>
        <button onClick={addCanal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: accent.css }}>
          <Plus size={15} /> Novo Canal
        </button>
      </div>

      {draft.map((canal, ci) => (
        <div key={canal.id} className="rounded-2xl overflow-hidden"
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>

          {/* Canal header */}
          <div className="p-5">
            <div className="flex items-center gap-3">
              {/* Color + icon preview */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                style={{ background: canal.cor }}>
                {canal.icone || "??"}
              </div>

              <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div>
                  <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Nome</label>
                  <input value={canal.nome}
                    onChange={e => updateCanal(canal.id, "nome", e.target.value)}
                    className={`w-full px-2.5 py-2 rounded-lg text-sm outline-none font-medium ${inputText}`}
                    style={inputStyle} placeholder="Ex: Instagram..." />
                </div>
                <div>
                  <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Ícone (2 letras)</label>
                  <input value={canal.icone} maxLength={2}
                    onChange={e => updateCanal(canal.id, "icone", e.target.value.toUpperCase())}
                    className={`w-full px-2.5 py-2 rounded-lg text-sm outline-none text-center font-black ${inputText}`}
                    style={inputStyle} placeholder="IG" />
                </div>
                <div>
                  <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Unidade</label>
                  <input value={canal.unidade}
                    onChange={e => updateCanal(canal.id, "unidade", e.target.value)}
                    className={`w-full px-2.5 py-2 rounded-lg text-sm outline-none ${inputText}`}
                    style={inputStyle} placeholder="seg., R$, %" />
                </div>
                <div>
                  <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Meta Anual</label>
                  <input type="number" value={canal.meta_anual}
                    onChange={e => updateCanal(canal.id, "meta_anual", Number(e.target.value))}
                    className={`w-full px-2.5 py-2 rounded-lg text-sm outline-none ${inputText}`}
                    style={inputStyle} placeholder="0" />
                </div>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => toggleExpanded(canal.id)}
                  className={`p-2 rounded-lg transition-colors ${textSecondary}`}
                  style={{ background: inputBg }}>
                  {expanded.includes(canal.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <button onClick={() => removeCanal(canal.id)}
                  className="p-2 rounded-lg text-red-400"
                  style={{ background: "rgba(239,68,68,0.1)" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Linha 2: cor, tipo, descrição, ativo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Cor</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={canal.cor}
                    onChange={e => updateCanal(canal.id, "cor", e.target.value)}
                    className="w-9 h-9 rounded-lg cursor-pointer border-0 p-0.5"
                    style={{ background: inputBg }} />
                  <div className="flex gap-1 flex-wrap">
                    {CORES_SUGERIDAS.slice(0, 5).map(cor => (
                      <button key={cor} onClick={() => updateCanal(canal.id, "cor", cor)}
                        className="w-5 h-5 rounded-full border-2 transition-all"
                        style={{ background: cor, borderColor: canal.cor === cor ? "#fff" : "transparent" }} />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Tipo</label>
                <select value={canal.tipo}
                  onChange={e => updateCanal(canal.id, "tipo", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-sm outline-none ${inputText}`}
                  style={inputStyle}>
                  {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Descrição</label>
                <input value={canal.descricao}
                  onChange={e => updateCanal(canal.id, "descricao", e.target.value)}
                  className={`w-full px-2.5 py-2 rounded-lg text-sm outline-none ${inputText}`}
                  style={inputStyle} placeholder="Breve descrição..." />
              </div>
              <div>
                <label className={`text-[10px] uppercase tracking-wider block mb-1 ${textSecondary}`}>Status</label>
                <button
                  onClick={() => updateCanal(canal.id, "ativo", !canal.ativo)}
                  className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: canal.ativo ? "rgba(34,197,94,0.12)" : inputBg,
                    color: canal.ativo ? "#22c55e" : darkMode ? "rgba(255,255,255,0.4)" : "#9ca3af",
                    border: `1px solid ${canal.ativo ? "rgba(34,197,94,0.25)" : inputBorder}`
                  }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: canal.ativo ? "#22c55e" : "#6b7280" }} />
                  {canal.ativo ? "Ativo" : "Inativo"}
                </button>
              </div>
            </div>
          </div>

          {/* Dados mensais */}
          {expanded.includes(canal.id) && (
            <div className="px-5 pb-5" style={{ borderTop: `1px solid ${cardBorder}` }}>
              <div className="flex items-center justify-between pt-4 mb-3">
                <span className={`text-xs font-semibold uppercase tracking-wider ${textSecondary}`}>
                  Dados Mensais — {canal.unidade || "valores"}
                </span>
                <span className={`text-xs ${textSecondary}`}>
                  Total: {formatNum(canal.dados_mensais.reduce((s, m) => s + m.valor, 0))} {canal.unidade}
                </span>
              </div>

              {/* Mini preview bars */}
              <div className="flex items-end gap-1 h-10 mb-3">
                {canal.dados_mensais.map((m, i) => {
                  const max = Math.max(...canal.dados_mensais.map(x => x.valor), 1)
                  const h = Math.round((m.valor / max) * 100)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                      <div className="w-full rounded-sm transition-all"
                        style={{ height: `${h}%`, minHeight: 2, background: canal.cor, opacity: 0.7 }} />
                    </div>
                  )
                })}
              </div>

              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {canal.dados_mensais.map((m, i) => (
                  <div key={i} className="rounded-xl p-2.5"
                    style={{ background: innerBg, border: `1px solid ${cardBorder}` }}>
                    <p className={`text-[10px] font-semibold mb-1.5 text-center ${textSecondary}`}>{m.mes}</p>
                    <input
                      type="number"
                      value={m.valor}
                      onChange={e => updateMes(canal.id, i, Number(e.target.value))}
                      className={`w-full px-1.5 py-1.5 rounded-lg text-xs text-center outline-none font-bold ${inputText}`}
                      style={{ background: inputBg, border: `1px solid ${canal.cor}35`, color: canal.cor }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {draft.length === 0 && (
        <div className={`text-center py-12 rounded-2xl ${textSecondary}`}
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <p className="text-sm">Nenhum canal cadastrado. Clique em "Novo Canal" para começar.</p>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={() => setDraft(data.canais)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${textSecondary}`}
          style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
          <RotateCcw size={14} /> Descartar
        </button>
        <button onClick={handleSave} disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ background: saved ? "linear-gradient(135deg,#22c55e,#16a34a)" : accent.css, opacity: saving ? 0.7 : 1 }}>
          <Save size={14} />
          {saving ? "Salvando..." : saved ? "✓ Salvo para todos!" : "Salvar para todos"}
        </button>
      </div>
    </div>
  )
}
