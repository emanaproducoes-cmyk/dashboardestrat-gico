import React, { useState, useEffect } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList
} from "recharts"
import { Code2, ArrowRight, X, TrendingUp } from "lucide-react"
import { db } from "../../lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

interface ContentItem {
  name: string
  value: number
  meta: number
  color: string
  description: string
}

const DEFAULT_DATA: ContentItem[] = [
  { name: "Antes/Depois", value: 40, meta: 45, color: "#f97316", description: "Transformações visuais que demonstram o impacto do trabalho realizado." },
  { name: "Vídeos",        value: 30, meta: 35, color: "#eab308", description: "Conteúdo em vídeo para YouTube e Reels com storytelling." },
  { name: "Reposts",       value: 20, meta: 20, color: "#06b6d4", description: "Compartilhamentos estratégicos de conteúdo de parceiros e clientes." },
  { name: "Bastidores",    value: 10, meta: 15, color: "#a855f7", description: "Humanização da marca com conteúdo de bastidores da equipe." },
]

const GRADIENT_COLORS = [
  { id: "g1", from: "#f97316", to: "#ef4444" },
  { id: "g2", from: "#eab308", to: "#f97316" },
  { id: "g3", from: "#06b6d4", to: "#6366f1" },
  { id: "g4", from: "#a855f7", to: "#ec4899" },
]

interface CustomTooltipProps {
  active?: boolean
  payload?: { payload: ContentItem; value: number }[]
  dark?: boolean
}

function CustomTooltip({ active, payload, dark }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const bg  = dark ? "#1e293b" : "#ffffff"
  const txt = dark ? "#f1f5f9" : "#1e293b"
  const sub = dark ? "#94a3b8" : "#64748b"
  return (
    <div style={{ background: bg, border: `1px solid ${d.color}40`, borderRadius: 12, padding: "12px 16px", boxShadow: "0 8px 32px rgba(0,0,0,0.18)", minWidth: 180 }}>
      <p style={{ color: d.color, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{d.name}</p>
      <p style={{ color: txt, fontSize: 22, fontWeight: 800, margin: "2px 0" }}>{d.value}%</p>
      <p style={{ color: sub, fontSize: 11, marginBottom: 6 }}>Meta: {d.meta}%</p>
      <div style={{ height: 4, borderRadius: 4, background: dark ? "#334155" : "#e2e8f0", overflow: "hidden" }}>
        <div style={{ width: `${Math.min((d.value / d.meta) * 100, 100)}%`, height: "100%", background: d.color, borderRadius: 4 }} />
      </div>
    </div>
  )
}

export default function ContentDistribution({ dark }: { dark?: boolean }) {
  const [data, setData] = useState<ContentItem[]>(DEFAULT_DATA)
  const [hovered, setHovered] = useState<string | null>(null)
  const [selected, setSelected] = useState<ContentItem | null>(null)

  // Firestore live sync
  useEffect(() => {
    const ref = doc(db, "planning", "main")
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        if (d.contentDistribution && Array.isArray(d.contentDistribution)) {
          setData(d.contentDistribution)
        }
      }
    })
    return unsub
  }, [])

  const total = data.reduce((s, d) => s + d.value, 0)
  const valC = dark ? "text-white"      : "text-gray-900"
  const subC = dark ? "text-white/40"   : "text-gray-400"
  const cardBg = dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-100"

  return (
    <>
      <div className={dark ? "" : "bg-white rounded-xl border border-gray-100 p-6"}>
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className={`font-bold text-base ${valC}`}>Distribuição de Conteúdo</h3>
            <p className={`text-xs mt-0.5 ${subC}`}>Mix estratégico por tipo · Total: {total}%</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg cursor-pointer transition-all hover:scale-105"
            style={{ background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)" }}
            title="Dev Mode → aba Conteúdo para editar esses dados"
          >
            <Code2 size={11} className="text-indigo-400" />
            <span className="text-[10px] text-indigo-400 font-semibold">Dev Mode → Conteúdo</span>
          </div>
        </div>

        {/* Bar Chart */}
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 10, right: 8, bottom: 0, left: -28 }} barCategoryGap="28%">
            <defs>
              {GRADIENT_COLORS.map((g, i) => (
                <linearGradient key={g.id} id={`grad-cd-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={g.from} stopOpacity={1} />
                  <stop offset="100%" stopColor={g.to}   stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<CustomTooltip dark={dark} />} cursor={{ fill: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", radius: 6 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={52}
              onMouseEnter={(d) => setHovered(d.name)}
              onMouseLeave={() => setHovered(null)}
              onClick={(d) => setSelected(d as ContentItem)}
              style={{ cursor: "pointer" }}
            >
              {data.map((entry, i) => (
                <Cell
                  key={entry.name}
                  fill={`url(#grad-cd-${i})`}
                  opacity={hovered === null || hovered === entry.name ? 1 : 0.45}
                  style={{ filter: hovered === entry.name ? `drop-shadow(0 0 8px ${entry.color}80)` : "none", transition: "opacity 0.2s, filter 0.2s" }}
                />
              ))}
              <LabelList dataKey="value" position="top" formatter={(v: number) => `${v}%`}
                style={{ fontSize: 10, fontWeight: 700, fill: dark ? "rgba(255,255,255,0.6)" : "#6b7280" }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Legend cards */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item, i) => (
            <div
              key={item.name}
              onClick={() => setSelected(item)}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${cardBg} ${hovered === item.name ? "scale-[1.03] shadow-md" : ""}`}
              style={{ borderColor: hovered === item.name ? `${item.color}60` : undefined }}
            >
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: GRADIENT_COLORS[i]?.from || item.color }} />
              <span className={`text-xs flex-1 truncate ${dark ? "text-white/70" : "text-gray-600"}`}>{item.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}%</span>
                {item.value >= item.meta
                  ? <TrendingUp size={10} className="text-emerald-400" />
                  : <span className="text-[9px] text-gray-400">/{item.meta}%</span>
                }
              </div>
            </div>
          ))}
        </div>

        {/* "Ver detalhes" hint */}
        <p className={`text-[10px] text-center mt-3 ${subC}`}>
          Clique em uma barra ou card para ver detalhes
        </p>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100"
              style={{ background: `${selected.color}12` }}>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ background: selected.color }} />
                <h3 className="text-lg font-extrabold text-gray-900">{selected.name}</h3>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>

              {/* Progress vs meta */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-gray-700">Atual: <span style={{ color: selected.color }}>{selected.value}%</span></span>
                  <span className="text-gray-400">Meta: {selected.meta}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((selected.value / selected.meta) * 100, 100)}%`, background: selected.color }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {Math.round((selected.value / selected.meta) * 100)}% da meta atingida
                </p>
              </div>

              {/* Dev Mode indicator */}
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <Code2 size={14} className="text-indigo-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-indigo-600">Para modificar esses dados:</p>
                  <p className="text-[11px] text-indigo-400 flex items-center gap-1 mt-0.5">
                    Dev Mode <ArrowRight size={9} /> aba <strong>Conteúdo</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
