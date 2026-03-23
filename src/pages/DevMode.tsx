import React, { useState, useEffect } from "react"
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { Plus, Trash2, Save, RefreshCw } from "lucide-react"
import type { ContentItem } from "../dashboard/ContentDistribution"

const DEFAULT_ITEMS: ContentItem[] = [
  { id: "c1", name: "Antes/Depois", value: 40, color: "#f97316", desc: "Transformações reais de negócios — do projeto ao financiamento aprovado.", meta: 45, exemplos: "Cases FNO, projetos aprovados, resultados financeiros" },
  { id: "c2", name: "Vídeos Educ.", value: 30, color: "#eab308", desc: "Explicações sobre FNO, BNDES e linhas de crédito simplificadas.", meta: 30, exemplos: "Tutoriais, webinars, explicações de processo" },
  { id: "c3", name: "Reposts",      value: 20, color: "#06b6d4", desc: "Curadoria de conteúdo relevante do setor com perspectiva da AF.", meta: 15, exemplos: "Notícias do BNDES, updates de política de crédito" },
  { id: "c4", name: "Bastidores",   value: 10, color: "#a855f7", desc: "Cultura, equipe e processos — humanizando a marca AF.", meta: 10, exemplos: "Rotina da equipe, bastidores de projetos, eventos" },
]

interface Props {
  darkMode?: boolean
  accentGradient?: { from: string; to: string; css: string }
}

export default function DevContentDistribution({ darkMode = true, accentGradient }: Props) {
  const accent = accentGradient ?? { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }
  const [items, setItems] = useState<ContentItem[]>(DEFAULT_ITEMS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const text1 = darkMode ? "rgba(255,255,255,0.88)" : "#111827"
  const text2 = darkMode ? "rgba(255,255,255,0.50)" : "#6b7280"
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"
  const inputBg = darkMode ? "rgba(255,255,255,0.06)" : "#f9fafb"
  const inputBorder = darkMode ? "rgba(255,255,255,0.12)" : "#e5e7eb"
  const inp: React.CSSProperties = { width: "100%", background: inputBg, border: "1px solid " + inputBorder, borderRadius: 8, padding: "7px 10px", color: text1, fontSize: 12, outline: "none" }

  useEffect(() => {
    const ref = doc(db, "planning", "main")
    const unsub = onSnapshot(ref, snap => {
      if (snap.exists()) {
        const d = snap.data()
        if (d?.contentDistribution?.length) setItems(d.contentDistribution)
      }
    })
    return unsub
  }, [])

  const update = (id: string, field: keyof ContentItem, val: any) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i))
  }

  const addItem = () => {
    setItems(prev => [...prev, {
      id: "c" + Date.now(), name: "Novo Tipo", value: 10, color: "#6366f1",
      desc: "Descrição do tipo de conteúdo", meta: 10, exemplos: "Exemplos de posts"
    }])
  }

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))

  const handleSave = async () => {
    setSaving(true)
    const ref = doc(db, "planning", "main")
    const snap = await getDoc(ref)
    const current = snap.exists() ? snap.data() : {}
    await setDoc(ref, { ...current, contentDistribution: items })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const handleReset = () => {
    if (window.confirm("Restaurar dados padrão?")) setItems(DEFAULT_ITEMS)
  }

  const total = items.reduce((s, i) => s + i.value, 0)
  const totalOk = total === 100

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div>
          <h2 style={{ color: text1, fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Distribuição de Conteúdo</h2>
          <p style={{ color: text2, fontSize: 13 }}>
            Aparece em <span style={{ color: accent.from, fontWeight: 600 }}>Visão Geral → Distribuição de Conteúdo</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handleReset} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: "transparent", border: "1px solid " + inputBorder, color: text2, cursor: "pointer" }}>
            <RefreshCw size={13} /> Restaurar
          </button>
          <button onClick={addItem} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, background: inputBg, border: "1px solid " + inputBorder, color: text1, cursor: "pointer" }}>
            <Plus size={13} /> Novo tipo
          </button>
          <button onClick={handleSave} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, background: saved ? "#22c55e" : accent.css, color: "#fff", border: "none", cursor: "pointer", transition: "background .3s" }}>
            <Save size={14} /> {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
          </button>
        </div>
      </div>

      {/* Total indicator */}
      <div style={{ background: totalOk ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", border: "1px solid " + (totalOk ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"), borderRadius: 10, padding: "10px 14px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: totalOk ? "#22c55e" : "#ef4444", fontSize: 13, fontWeight: 600 }}>
          {totalOk ? "Total: 100% ✓" : "Total: " + total + "% — deve somar 100%"}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          {items.map(i => (
            <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: i.color }} />
              <span style={{ color: text2, fontSize: 10 }}>{i.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items editor */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((item, idx) => (
          <div key={item.id} style={{ background: cardBg, border: "1px solid " + item.color + "30", borderRadius: 14, padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input type="color" value={item.color} onChange={e => update(item.id, "color", e.target.value)}
                  style={{ width: 30, height: 30, border: "none", borderRadius: 6, cursor: "pointer", padding: 2 }} />
                <span style={{ color: item.color, fontSize: 12, fontWeight: 700 }}>Tipo {idx + 1}</span>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 7, padding: "5px 8px", cursor: "pointer", color: "#ef4444", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                <Trash2 size={11} /> Remover
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ display: "block", color: text2, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Nome</label>
                <input style={inp} value={item.name} onChange={e => update(item.id, "name", e.target.value)} placeholder="Ex: Antes/Depois" />
              </div>
              <div>
                <label style={{ display: "block", color: text2, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>% Atual</label>
                <input style={inp} type="number" min={0} max={100} value={item.value} onChange={e => update(item.id, "value", parseInt(e.target.value) || 0)} />
              </div>
              <div>
                <label style={{ display: "block", color: text2, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>% Meta</label>
                <input style={inp} type="number" min={0} max={100} value={item.meta} onChange={e => update(item.id, "meta", parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: "block", color: text2, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Descrição</label>
              <input style={inp} value={item.desc} onChange={e => update(item.id, "desc", e.target.value)} placeholder="Descrição do tipo de conteúdo" />
            </div>
            <div>
              <label style={{ display: "block", color: text2, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Exemplos de posts</label>
              <input style={inp} value={item.exemplos} onChange={e => update(item.id, "exemplos", e.target.value)} placeholder="Ex: Cases FNO, projetos aprovados..." />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
