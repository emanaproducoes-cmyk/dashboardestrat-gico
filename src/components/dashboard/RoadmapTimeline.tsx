import React, { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from "recharts"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { Info, X, TrendingUp, Edit3 } from "lucide-react"

export interface ContentItem {
  id: string
  name: string
  value: number
  color: string
  desc: string
  meta: number
  exemplos: string
}

const DEFAULT_ITEMS: ContentItem[] = [
  { id: "c1", name: "Antes/Depois", value: 40, color: "#f97316", desc: "Transformações reais de negócios — do projeto ao financiamento aprovado.", meta: 45, exemplos: "Cases FNO, projetos aprovados, resultados financeiros" },
  { id: "c2", name: "Vídeos Educ.", value: 30, color: "#eab308", desc: "Explicações sobre FNO, BNDES e linhas de crédito simplificadas.", meta: 30, exemplos: "Tutoriais, webinars, explicações de processo" },
  { id: "c3", name: "Reposts",      value: 20, color: "#06b6d4", desc: "Curadoria de conteúdo relevante do setor com perspectiva da AF.", meta: 15, exemplos: "Notícias do BNDES, updates de política de crédito" },
  { id: "c4", name: "Bastidores",   value: 10, color: "#a855f7", desc: "Cultura, equipe e processos — humanizando a marca AF.", meta: 10, exemplos: "Rotina da equipe, bastidores de projetos, eventos" },
]

function ChartTooltipContent({ active, payload, label, dark }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  const bg = dark ? "rgba(10,18,40,0.97)" : "rgba(255,255,255,0.99)"
  const border = dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.10)"
  const textMain = dark ? "#ffffff" : "#111827"
  const textSub = dark ? "rgba(255,255,255,0.55)" : "#6b7280"
  return (
    <div style={{
      background: bg, border: "1px solid " + border, borderRadius: 12,
      padding: "12px 16px", minWidth: 180, boxShadow: "0 12px 40px rgba(0,0,0,0.35)"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.fill, flexShrink: 0 }} />
        <span style={{ color: textMain, fontSize: 13, fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ color: item.fill, fontSize: 22, fontWeight: 900, lineHeight: 1, marginBottom: 4 }}>
        {item.value}%
      </div>
      {payload[0]?.payload?.meta !== undefined && (
        <div style={{ color: textSub, fontSize: 11 }}>
          Meta: <span style={{ color: "#22c55e", fontWeight: 700 }}>{payload[0].payload.meta}%</span>
        </div>
      )}
    </div>
  )
}

export default function ContentDistribution({ dark }: { dark?: boolean }) {
  const [items, setItems] = useState<ContentItem[]>(DEFAULT_ITEMS)
  const [detail, setDetail] = useState<ContentItem | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

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

  const bg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const textMain = dark ? "#ffffff" : "#111827"
  const textSub = dark ? "rgba(255,255,255,0.45)" : "#6b7280"
  const gridColor = dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
  const axisColor = dark ? "rgba(255,255,255,0.35)" : "#9ca3af"

  const total = items.reduce((s, i) => s + i.value, 0)

  return (
    <div style={{ background: bg, border: "1px solid " + border, borderRadius: 16, padding: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h3 style={{ color: textMain, fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            Distribuição de Conteúdo
          </h3>
          <p style={{ color: textSub, fontSize: 12 }}>
            Mix estratégico por tipo · <span style={{ color: "#f97316", fontWeight: 600 }}>Dev Mode → Conteúdo</span> para editar
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: dark ? "rgba(249,115,22,0.12)" : "rgba(249,115,22,0.08)", borderRadius: 99, padding: "4px 10px", border: "1px solid rgba(249,115,22,0.25)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316" }} />
          <span style={{ color: "#f97316", fontSize: 11, fontWeight: 700 }}>
            {total}% mapeado
          </span>
        </div>
      </div>

      {/* Bar Chart — inspired by the reference image */}
      <div style={{ height: 200, marginBottom: 20 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={items.map(i => ({ ...i, gap: i.meta - i.value }))}
            margin={{ top: 12, right: 8, left: -24, bottom: 0 }}
            barSize={36}
          >
            <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: axisColor, fontSize: 11, fontWeight: 500 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: 10 }}
              axisLine={false} tickLine={false}
              tickFormatter={v => v + "%"}
              domain={[0, 55]}
            />
            <Tooltip content={<ChartTooltipContent dark={dark} />} cursor={{ fill: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", radius: 8 }} />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
              onClick={(d) => setDetail(d as ContentItem)}
              style={{ cursor: "pointer" }}
            >
              {items.map((item) => (
                <Cell
                  key={item.id}
                  fill={hoveredId === item.id ? item.color : item.color + "cc"}
                  style={{ filter: hoveredId === item.id ? "brightness(1.2)" : "none", transition: "all 0.2s" }}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v: any) => v + "%"}
                style={{ fill: dark ? "rgba(255,255,255,0.75)" : "#374151", fontSize: 11, fontWeight: 700 }}
              />
            </Bar>
            {/* Meta line as a second bar with opacity */}
            <Bar dataKey="meta" radius={[3, 3, 0, 0]} fill="transparent">
              {items.map((item) => (
                <Cell key={item.id + "_meta"} fill="transparent"
                  stroke={item.color} strokeWidth={2} strokeDasharray="4 2"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend cards with hover */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setDetail(item)}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 10, cursor: "pointer",
              background: hoveredId === item.id
                ? (dark ? item.color + "22" : item.color + "12")
                : (dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
              border: "1px solid " + (hoveredId === item.id ? item.color + "50" : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)")),
              transition: "all 0.2s", textAlign: "left",
            }}
          >
            <div style={{
              width: 32, height: 32, borderRadius: 8, flexShrink: 0,
              background: item.color + "20", border: "1px solid " + item.color + "40",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: item.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: dark ? "rgba(255,255,255,0.85)" : "#1f2937", fontSize: 12, fontWeight: 600 }}>{item.name}</span>
                <span style={{ color: item.color, fontSize: 13, fontWeight: 800 }}>{item.value}%</span>
              </div>
              <div style={{ marginTop: 4, height: 3, borderRadius: 99, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: (item.value / 50 * 100) + "%", background: item.color, borderRadius: 99, transition: "width 0.6s ease" }} />
              </div>
            </div>
            <Info size={13} style={{ color: item.color, flexShrink: 0, opacity: hoveredId === item.id ? 1 : 0.4 }} />
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {detail && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={() => setDetail(null)}
        >
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }} />
          <div
            style={{
              position: "relative", width: "100%", maxWidth: 420,
              background: dark ? "#0a1628" : "#ffffff",
              borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
              border: "1px solid " + detail.color + "35"
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "20px 24px", background: detail.color + "15", borderBottom: "1px solid " + detail.color + "25" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: detail.color }} />
                    <span style={{ color: detail.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      Tipo de Conteúdo
                    </span>
                  </div>
                  <h2 style={{ color: dark ? "#ffffff" : "#111827", fontSize: 20, fontWeight: 800 }}>{detail.name}</h2>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: detail.color, fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{detail.value}%</div>
                  <div style={{ color: dark ? "rgba(255,255,255,0.4)" : "#9ca3af", fontSize: 11 }}>do mix total</div>
                </div>
              </div>
              {/* Progress vs meta */}
              <div style={{ marginTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ color: dark ? "rgba(255,255,255,0.5)" : "#6b7280", fontSize: 11 }}>Atual vs Meta</span>
                  <span style={{ color: "#22c55e", fontSize: 11, fontWeight: 700 }}>Meta: {detail.meta}%</span>
                </div>
                <div style={{ height: 6, background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: (detail.value / detail.meta * 100) + "%", background: detail.color, borderRadius: 99, transition: "width 0.8s" }} />
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <TrendingUp size={13} style={{ color: detail.color }} />
                  <span style={{ color: detail.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Descrição</span>
                </div>
                <p style={{ color: dark ? "rgba(255,255,255,0.78)" : "#374151", fontSize: 13, lineHeight: 1.6 }}>{detail.desc}</p>
              </div>
              <div style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderRadius: 12, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Edit3 size={13} style={{ color: detail.color }} />
                  <span style={{ color: detail.color, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Exemplos</span>
                </div>
                <p style={{ color: dark ? "rgba(255,255,255,0.78)" : "#374151", fontSize: 13, lineHeight: 1.6 }}>{detail.exemplos}</p>
              </div>
              <div style={{ background: detail.color + "12", borderRadius: 12, padding: "12px 16px", border: "1px solid " + detail.color + "25" }}>
                <p style={{ color: dark ? "rgba(255,255,255,0.5)" : "#6b7280", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                  Para editar estes dados
                </p>
                <p style={{ color: dark ? "rgba(255,255,255,0.75)" : "#374151", fontSize: 12 }}>
                  Acesse <span style={{ color: detail.color, fontWeight: 700 }}>Dev Mode → Conteúdo</span> no menu lateral
                </p>
              </div>
            </div>

            <div style={{ padding: "0 24px 20px" }}>
              <button
                onClick={() => setDetail(null)}
                style={{ width: "100%", padding: "10px", borderRadius: 10, background: detail.color + "15", border: "1px solid " + detail.color + "30", color: detail.color, fontWeight: 700, fontSize: 13, cursor: "pointer" }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
