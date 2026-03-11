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
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [editingBar, setEditingBar] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')
  const tooltipLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cx = 290, cy = 255
  const maxR = 150
  const n = data.length
  const anglePerSlice = (2 * Math.PI) / n
  const gap = 0.06
  const baseAngle = -Math.PI / 2
  const labelR = 220

  const acc
