import React, { useState, useRef } from "react"
import { Pencil, Check } from "lucide-react"
import type { GradientOption } from "../../lib/types"

interface OKRItem {
  label: string
  sublabel: string
  value: number
}

const INITIAL_DATA: OKRItem[] = [
  { label: "LI Seguidores",  sublabel: "+200/ano",   value: 40 },
  { label: "LI Engajamento", sublabel: "2.5–5.5%",   value: 64 },
  { label: "YT Engajamento", sublabel: "3.0–6.8%",   value: 59 },
  { label: "IG Conversão",   sublabel: "70–105/ano",  value: 29 },
  { label: "YT Conversão",   sublabel: "43–56/ano",   value: 7  },
  { label: "Prova Social",   sublabel: "3–4 cases",   value: 0  },
  { label: "YT Inscritos",   sublabel: "+500/ano",    value: 10 },
  { label: "LI Conversão",   sublabel: "28–32/ano",   value: 9  },
]

const COLORS = [
  { from: "#ff7c1e", to: "#c2410c", accent: "#ffb070" },
  { from: "#f97316", to: "#9a3412", accent: "#fb923c" },
  { from: "#a855f7", to: "#3730a3", accent: "#c084fc" },
  { from: "#c026d3", to: "#581c87", accent: "#e879f9" },
  { from: "#ef4444", to: "#831843", accent: "#fca5a5" },
  { from: "#8b5cf6", to: "#1e1b4b", accent: "#a78bfa" },
  { from: "#ec4899", to: "#6b21a8", accent: "#f9a8d4" },
  { from: "#d946ef", to: "#4c1d95", accent: "#f0abfc" },
]

function pxy(cx: number, cy: number, r: number, a: number) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

function slicePath(cx: number, cy: number, r: number, a0: number, a1: number) {
  if (r < 3) r = 3
  const s = pxy(cx, cy, r, a0)
  const e = pxy(cx, cy, r, a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 ${large} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)} Z`
}

interface Props {
  dark?: boolean
  accentGradient?: GradientOption
}

export default function OKRNightingaleChart({ dark = true, accentGradient }: Props) {
  const [data, setData] = useState<OKRItem[]>(INITIAL_DATA)
  // BUG FIX: separate hover state for SVG slices vs bottom bars — they were sharing state causing conflicts
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [editingBar, setEditingBar] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')
  // BUG FIX: use ref to track if mouse is over tooltip to prevent premature close
  const tooltipLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cx = 290, cy = 255
  const maxR = 150
  const n = data.length
  const anglePerSlice = (2 * Math.PI) / n
  const gap = 0.06
  const baseAngle = -Math.PI / 2
  const labelR = 220

  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }

  const startEdit = (i: number) => { setEditingBar(i); setEditVal(String(data[i].value)) }
  const confirmEdit = (i: number) => {
    const v = Math.max(0, Math.min(100, Number(editVal) || 0))
    setData(prev => prev.map((d, di) => di === i ? { ...d, value: v } : d))
    setEditingBar(null)
  }
  const updateLabel = (i: number, field: keyof OKRItem, val: string) => {
    setData(prev => prev.map((d, di) => di === i ? { ...d, [field]: val } : d))
  }

  const handleMouseLeave = () => {
    // BUG FIX: small delay so moving to tooltip doesn't hide it immediately
    tooltipLeaveTimer.current = setTimeout(() => setHoveredSlice(null), 80)
  }
  const handleMouseEnterSlice = (i: number) => {
    if (tooltipLeaveTimer.current) clearTimeout(tooltipLeaveTimer.current)
    setHoveredSlice(i)
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #07081a 0%, #0c0b20 50%, #090814 100%)" }}>
      {/* Header */}
      <div className="px-6 pt-6 pb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-1.5 rounded-full" style={{ background: accent.css }} />
            <span className="text-white/30 text-[10px] uppercase tracking-widest font-semibold">
              Infográfico Estratégico
            </span>
          </div>
          <h3 className="text-white font-extrabold text-2xl leading-tight">OKRs</h3>
          <p className="text-white/40 text-sm font-light leading-tight">Estratégicos 2026</p>
        </div>
        <div className="flex gap-1.5 mt-1">
          {COLORS.slice(0, 4).map((c, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 rounded-sm"
              style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }}
            />
          ))}
        </div>
      </div>

      {/* Chart */}
      <div
        className="relative flex justify-center overflow-hidden"
        onMouseLeave={handleMouseLeave}
      >
        <svg
          width="580"
          height="510"
          viewBox="0 0 580 510"
          style={{ maxWidth: "100%", minWidth: 300 }}
          onMouseMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
          }}
        >
          <defs>
            {COLORS.map((c, i) => (
              <radialGradient key={i} id={`rg${i}`} cx="35%" cy="28%" r="72%">
                <stop offset="0%" stopColor={c.from} />
                <stop offset="100%" stopColor={c.to} />
              </radialGradient>
            ))}
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.7)" />
            </filter>
          </defs>

          {[1, 0.65, 0.35].map((r, i) => (
            <circle
              key={i} cx={cx} cy={cy} r={maxR * r}
              fill="none" stroke="rgba(255,255,255,0.06)"
              strokeWidth={1} strokeDasharray="4 5"
            />
          ))}

          {data.map((m, i) => {
            const a0 = baseAngle + i * anglePerSlice + gap / 2
            const a1 = baseAngle + (i + 1) * anglePerSlice - gap / 2
            const r = Math.max(22, (m.value / 100) * maxR)
            return (
              <path
                key={`sh${i}`}
                d={slicePath(cx + 2, cy + 5, r, a0, a1)}
                fill={COLORS[i].to}
                opacity={0.25}
              />
            )
          })}

          {data.map((m, i) => {
            const a0 = baseAngle + i * anglePerSlice + gap / 2
            const a1 = baseAngle + (i + 1) * anglePerSlice - gap / 2
            const r = Math.max(22, (m.value / 100) * maxR)
            const midA = (a0 + a1) / 2
            const tipP = pxy(cx, cy, r + 3, midA)
            const dotP = pxy(cx, cy, Math.min(r + 22, labelR - 14), midA)
            const labelP = pxy(cx, cy, labelR, midA)
            const cosA = Math.cos(midA)
            const anchor = cosA > 0.2 ? "start" : cosA < -0.2 ? "end" : "middle"
            const isHov = hoveredSlice === i
            const scaleR = r * (isHov ? 1.07 : 1)

            return (
              <g key={i}>
                <path
                  d={slicePath(cx, cy, scaleR, a0, a1)}
                  fill={`url(#rg${i})`}
                  opacity={isHov ? 1 : 0.9}
                  filter={isHov ? "url(#glow)" : "url(#shadow)"}
                  style={{ cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={() => handleMouseEnterSlice(i)}
                />
                <path
                  d={slicePath(cx, cy, scaleR, a0, a0 + 0.025)}
                  fill="rgba(255,255,255,0.25)"
                  pointerEvents="none"
                />
                <path
                  d={slicePath(cx, cy, scaleR * 0.45, a0 + 0.04, a1 - 0.04)}
                  fill="rgba(255,255,255,0.07)"
                  pointerEvents="none"
                />
                <line
                  x1={tipP.x.toFixed(1)} y1={tipP.y.toFixed(1)}
                  x2={dotP.x.toFixed(1)} y2={dotP.y.toFixed(1)}
                  stroke={isHov ? COLORS[i].accent : "rgba(255,255,255,0.22)"}
                  strokeWidth={isHov ? 1.2 : 0.7}
                />
                <circle
                  cx={dotP.x} cy={dotP.y} r={2.5}
                  fill={isHov ? COLORS[i].accent : "rgba(255,255,255,0.38)"}
                />
                <text
                  x={labelP.x.toFixed(1)} y={(labelP.y - 5).toFixed(1)}
                  textAnchor={anchor} fill={COLORS[i].accent}
                  fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif"
                >
                  {m.value}%
                </text>
                <text
                  x={labelP.x.toFixed(1)} y={(labelP.y + 7).toFixed(1)}
                  textAnchor={anchor} fill="rgba(255,255,255,0.72)"
                  fontSize="7" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.5"
                >
                  {m.label.toUpperCase()}
                </text>
                <text
                  x={labelP.x.toFixed(1)} y={(labelP.y + 17).toFixed(1)}
                  textAnchor={anchor} fill="rgba(255,255,255,0.35)"
                  fontSize="6.5" fontFamily="system-ui, sans-serif"
                >
                  {m.sublabel}
                </text>
              </g>
            )
          })}

          <circle cx={cx} cy={cy} r={28} fill="#060718" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
          <circle cx={cx} cy={cy} r={6} fill="rgba(255,255,255,0.1)" />
        </svg>

        {/* BUG FIX: tooltip is pointer-events-none so mouse can pass through it without triggering leave */}
        {hoveredSlice !== null && (
          <div
            className="pointer-events-none absolute z-10 rounded-xl px-3 py-2.5"
            style={{
              left: tooltipPos.x + 16,
              top: tooltipPos.y - 12,
              background: "rgba(8,6,28,0.97)",
              border: `1px solid ${COLORS[hoveredSlice].from}60`,
              boxShadow: `0 6px 24px ${COLORS[hoveredSlice].from}40`,
              minWidth: 140,
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${COLORS[hoveredSlice].from},${COLORS[hoveredSlice].to})` }}
              />
              <span className="text-white font-bold text-xs">{data[hoveredSlice].label}</span>
            </div>
            <div style={{ color: COLORS[hoveredSlice].accent }} className="text-xl font-extrabold leading-tight">
              {data[hoveredSlice].value}%
            </div>
            <div className="text-white/40 text-[10px] mt-0.5">{data[hoveredSlice].sublabel}</div>
          </div>
        )}
      </div>

      {/* Bottom editable bars */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
          {data.map((m, i) => (
            <div key={i} className="group">
              <div className="flex items-center justify-between mb-1.5 gap-1">
                {editingBar === i ? (
                  <input
                    value={m.label}
                    onChange={e => updateLabel(i, 'label', e.target.value)}
                    className="flex-1 text-[9px] font-semibold bg-transparent border-b border-white/20 text-white/60 outline-none"
                  />
                ) : (
                  <span className="text-white/45 text-[9px] font-semibold truncate flex-1">{m.label}</span>
                )}

                <div className="flex items-center gap-0.5 flex-shrink-0">
                  {editingBar === i ? (
                    <>
                      <input
                        type="number" min="0" max="100"
                        value={editVal}
                        onChange={e => setEditVal(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && confirmEdit(i)}
                        className="w-10 text-center text-[9px] font-extrabold bg-transparent border-b outline-none"
                        style={{ color: COLORS[i].accent, borderColor: COLORS[i].from + '80' }}
                        autoFocus
                      />
                      <span className="text-white/30 text-[8px]">%</span>
                      <button onClick={() => confirmEdit(i)} className="text-green-400 hover:text-green-300 ml-0.5">
                        <Check size={9} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span style={{ color: COLORS[i].accent }} className="text-[9px] font-extrabold">
                        {m.value}%
                      </span>
                      <button
                        onClick={() => startEdit(i)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
                      >
                        <Pencil size={8} className="text-white/40 hover:text-white/80" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${m.value}%`,
                    background: `linear-gradient(90deg, ${COLORS[i].from}, ${COLORS[i].to})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
