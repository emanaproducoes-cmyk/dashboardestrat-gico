import React, { useState } from "react"
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar
} from "recharts"
import { X, TrendingUp, Users, Eye } from "lucide-react"

interface Props { dark?: boolean }

const CHANNELS = [
  {
    id: "instagram",
    label: "Instagram",
    color: "#e1306c",
    fill: "#e1306c14",
    target: 105,
    unit: "conv.",
    icon: "IG",
    q: [
      { q: "Q1", min: 30, max: 45, mid: 37 },
      { q: "Q2", min: 20, max: 30, mid: 25 },
      { q: "Q3", min: 10, max: 20, mid: 15 },
      { q: "Q4", min: 10, max: 20, mid: 15 },
    ],
    meta_anual: "70–105",
    desc: "Conversão de clientes em seguidores",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "#0077b5",
    fill: "#0077b514",
    target: 200,
    unit: "seg.",
    icon: "LI",
    q: [
      { q: "Q1", min: 80, max: 80, mid: 80 },
      { q: "Q2", min: 120, max: 120, mid: 120 },
      { q: "Q3", min: 150, max: 150, mid: 150 },
      { q: "Q4", min: 180, max: 180, mid: 180 },
    ],
    meta_anual: "+200",
    desc: "Seguidores líquidos acumulados em 2026",
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "#ff4444",
    fill: "#ff444412",
    target: 500,
    unit: "insc.",
    icon: "YT",
    q: [
      { q: "Q1", min: 50, max: 50, mid: 50 },
      { q: "Q2", min: 80, max: 80, mid: 80 },
      { q: "Q3", min: 100, max: 100, mid: 100 },
      { q: "Q4", min: 350, max: 350, mid: 350 },
    ],
    meta_anual: "+500",
    desc: "Inscritos líquidos acumulados em 2026",
  },
]

const MONTHLY_DATA = [
  { mes: "Jan", Instagram: 10, LinkedIn: 15, YouTube: 8 },
  { mes: "Fev", Instagram: 22, LinkedIn: 32, YouTube: 18 },
  { mes: "Mar", Instagram: 37, LinkedIn: 55, YouTube: 32 },
  { mes: "Abr", Instagram: 54, LinkedIn: 78, YouTube: 52 },
  { mes: "Mai", Instagram: 65, LinkedIn: 98, YouTube: 70 },
  { mes: "Jun", Instagram: 72, LinkedIn: 118, YouTube: 88 },
  { mes: "Jul", Instagram: 78, LinkedIn: 138, YouTube: 108 },
  { mes: "Ago", Instagram: 82, LinkedIn: 158, YouTube: 145 },
  { mes: "Set", Instagram: 86, LinkedIn: 165, YouTube: 185 },
  { mes: "Out", Instagram: 89, LinkedIn: 172, YouTube: 280 },
  { mes: "Nov", Instagram: 93, LinkedIn: 185, YouTube: 390 },
  { mes: "Dez", Instagram: 97, LinkedIn: 196, YouTube: 490 },
]

function DonutRing({ pct, color, size = 56 }: { pct: number; color: string; size?: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dasharray 0.8s ease" }} />
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  )
}

function MiniSparkline({ data, color, dataKey }: { data: any[]; color: string; dataKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <ComposedChart data={data.slice(-6)} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Area type="monotone" dataKey={dataKey} stroke={color} fill={color + "18"} strokeWidth={1.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function ChannelCard({ ch, dark, active, onToggle, onDetail, current }: {
  ch: typeof CHANNELS[0]; dark: boolean; active: boolean; onToggle: () => void; onDetail: () => void; current: number
}) {
  const [hovered, setHovered] = useState(false)
  const pct = Math.min(Math.round((current / ch.target) * 100), 100)
  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const inactiveBg = dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"
  const border = active
    ? `1px solid ${ch.color}45`
    : `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-250 flex-1 min-w-0"
      style={{
        background: active ? cardBg : inactiveBg,
        border,
        opacity: active ? 1 : 0.5,
        boxShadow: hovered && active ? `0 8px 28px ${ch.color}18, 0 0 0 1px ${ch.color}30` : "none",
        transform: hovered && active ? "translateY(-2px)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
            style={{ background: ch.color }}>{ch.icon}</div>
          <div>
            <p className={`text-xs font-bold ${dark ? "text-white" : "text-gray-900"}`}>{ch.label}</p>
            <p className={`text-[10px] ${dark ? "text-white/35" : "text-gray-400"}`}>{ch.unit}</p>
          </div>
        </div>
        <DonutRing pct={pct} color={ch.color} size={48} />
      </div>

      <div className="mb-2">
        <p className="text-xl font-extrabold" style={{ color: ch.color }}>
          {current.toLocaleString("pt-BR")}
          <span className="text-xs font-normal ml-1" style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>
            / {ch.target.toLocaleString("pt-BR")}
          </span>
        </p>
        <p className={`text-[10px] mt-0.5 ${dark ? "text-white/30" : "text-gray-400"}`}>Meta: {ch.meta_anual} {ch.unit}</p>
      </div>

      <MiniSparkline data={MONTHLY_DATA} color={ch.color} dataKey={ch.label} />

      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: ch.color }} />
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
        style={{ background: hovered ? ch.color + "20" : "transparent", color: ch.color, border: `1px solid ${hovered ? ch.color + "40" : "transparent"}` }}
        onClick={e => { e.stopPropagation(); onDetail() }}
      >
        <Eye size={11} />
        Ver Detalhes
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label, dark }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: dark ? "rgba(5,12,28,0.97)" : "rgba(255,255,255,0.99)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
      minWidth: 160,
    }}>
      <p style={{ color: dark ? "rgba(255,255,255,0.45)" : "#6b7280", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 8 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < payload.length - 1 ? 5 : 0 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: p.color || p.stroke, flexShrink: 0 }} />
          <span style={{ color: dark ? "rgba(255,255,255,0.5)" : "#9ca3af", fontSize: 11, flex: 1 }}>{p.dataKey}</span>
          <span style={{ color: dark ? "#ffffff" : "#111827", fontSize: 12, fontWeight: 800 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function DetailModal({ ch, dark, onClose }: { ch: typeof CHANNELS[0]; dark: boolean; onClose: () => void }) {
  const bg = dark ? "#0a1628" : "#ffffff"
  const lastVal = MONTHLY_DATA[MONTHLY_DATA.length - 1][ch.label as keyof typeof MONTHLY_DATA[0]] as number
  const pct = Math.min(Math.round((lastVal / ch.target) * 100), 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
      <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bg, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-6" style={{ background: `linear-gradient(135deg,${ch.color}18,${ch.color}05)`, borderBottom: `1px solid ${ch.color}25` }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm"
                style={{ background: ch.color }}>{ch.icon}</div>
              <div>
                <h2 className={`text-xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>{ch.label}</h2>
                <p className={`text-xs mt-0.5 ${dark ? "text-white/45" : "text-gray-500"}`}>{ch.desc}</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Projeção Dez/26", value: `${lastVal}`, unit: ch.unit, color: ch.color },
              { label: "Meta Anual", value: ch.meta_anual, unit: ch.unit, color: dark ? "rgba(255,255,255,0.75)" : "#374151" },
              { label: "Progresso", value: `${pct}%`, unit: "", color: ch.color },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-1 ${dark ? "text-white/38" : "text-gray-400"}`}>{s.label}</p>
                <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value} <span className="text-xs font-normal">{s.unit}</span></p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: dark ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
              <span>0</span>
              <span className="font-bold" style={{ color: ch.color }}>{pct}% da meta anual</span>
              <span>{ch.target} {ch.unit}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${ch.color}80,${ch.color})` }} />
            </div>
          </div>

          {/* Evolution chart */}
          <div>
            <p className={`text-xs font-bold mb-3 ${dark ? "text-white/55" : "text-gray-600"}`}>Evolução Mensal Projetada 2026</p>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={MONTHLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={(p: any) => <CustomTooltip {...p} dark={dark} />} />
                <ReferenceLine y={ch.target} stroke={ch.color} strokeDasharray="5 4" strokeOpacity={0.45}
                  label={{ value: `Meta: ${ch.target}`, position: "right", fontSize: 10, fill: ch.color }} />
                <Area type="monotone" dataKey={ch.label} stroke={ch.color} fill={ch.color + "18"} strokeWidth={2.5}
                  dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: dark ? "#0a1628" : "#fff", fill: ch.color }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Quarterly table */}
          <div>
            <p className={`text-xs font-bold mb-3 ${dark ? "text-white/55" : "text-gray-600"}`}>Metas Trimestrais</p>
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={ch.q} margin={{ top: 10, right: 10, bottom: 0, left: 0 }} barSize={36}>
                  <XAxis dataKey="q" tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.4)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.4)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={(p: any) => <CustomTooltip {...p} dark={dark} />} />
                  <Bar dataKey="mid" name="Meta Trimestral" fill={ch.color} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChannelChart({ dark = true }: Props) {
  const [active, setActive] = useState({ Instagram: true, LinkedIn: true, YouTube: true })
  const [detail, setDetail] = useState<typeof CHANNELS[0] | null>(null)

  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  const lastMonth = MONTHLY_DATA[MONTHLY_DATA.length - 1]

  return (
    <div className="space-y-5">
      {/* Channel cards */}
      <div className="flex gap-4">
        {CHANNELS.map(ch => (
          <ChannelCard
            key={ch.id}
            ch={ch}
            dark={dark}
            active={active[ch.label as keyof typeof active]}
            current={lastMonth[ch.label as keyof typeof lastMonth] as number}
            onToggle={() => setActive(prev => ({ ...prev, [ch.label]: !prev[ch.label as keyof typeof prev] }))}
            onDetail={() => setDetail(ch)}
          />
        ))}
      </div>

      {/* Main chart */}
      <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>Crescimento por Canal — 2026</p>
            <p className={`text-[11px] mt-0.5 ${dark ? "text-white/35" : "text-gray-400"}`}>Clique nos cards acima para ocultar/exibir canais · clique em "Ver Detalhes" para análise</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {CHANNELS.map(ch => (
              <div key={ch.id} className="flex items-center gap-1.5 cursor-pointer"
                style={{ opacity: active[ch.label as keyof typeof active] ? 1 : 0.35 }}
                onClick={() => setActive(prev => ({ ...prev, [ch.label]: !prev[ch.label as keyof typeof prev] }))}>
                <div style={{ width: 20, height: 3, borderRadius: 2, background: ch.color }} />
                <span className={`text-[11px] font-medium ${dark ? "text-white/55" : "text-gray-500"}`}>{ch.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={MONTHLY_DATA} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip content={(p: any) => <CustomTooltip {...p} dark={dark} />} />

            {CHANNELS.map(ch => active[ch.label as keyof typeof active] && (
              <Area key={ch.id} type="monotone" dataKey={ch.label}
                stroke={ch.color} fill={ch.fill} strokeWidth={2.5}
                dot={false} activeDot={{ r: 6, strokeWidth: 2, stroke: dark ? "#070f1f" : "#ffffff", fill: ch.color }} />
            ))}

            {/* Reference lines for annual targets */}
            {CHANNELS.map(ch => active[ch.label as keyof typeof active] && (
              <ReferenceLine key={`ref-${ch.id}`} y={ch.target}
                stroke={ch.color} strokeDasharray="5 4" strokeOpacity={0.3} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>

        <div className={`flex justify-center gap-6 mt-3 text-[10px] ${dark ? "text-white/25" : "text-gray-300"}`}>
          <span>Linhas tracejadas = metas anuais por canal</span>
        </div>
      </div>

      {detail && <DetailModal ch={detail} dark={dark} onClose={() => setDetail(null)} />}
    </div>
  )
}
