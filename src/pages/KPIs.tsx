import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import ChannelChart from "../components/dashboard/ChannelChart"
import { useFontSettings } from "../lib/FontSettingsContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ComposedChart, Area, Line, CartesianGrid, Cell, LineChart
} from "recharts"
import { TrendingUp, Target, BarChart2, Zap, X, ArrowUpRight, Eye } from "lucide-react"

const PERSP_COLORS: Record<string, string> = {
  "Financeira": "#22c55e",
  "Clientes": "#3b82f6",
  "Processos Internos": "#f59e0b",
  "Aprendizado & Crescimento": "#8b5cf6",
  "Inovação": "#ec4899",
}

const DEFAULT_KPIS = [
  { id: "d1", perspectiva: "Clientes", indicador: "LinkedIn — Seguidores Líquidos", formula: "Meta trimestral de novos seguidores", baseline: "0", meta: "200", unidade: "seg.", frequencia: "Trimestral", responsavel: "Time Marketing", status: "Ativo", trend: "Q1: +80" },
  { id: "d2", perspectiva: "Clientes", indicador: "YouTube — Inscritos Líquidos", formula: "Meta trimestral de novos inscritos", baseline: "0", meta: "500", unidade: "insc.", frequencia: "Trimestral", responsavel: "Time Marketing", status: "Ativo", trend: "Q1: +50" },
  { id: "d3", perspectiva: "Processos Internos", indicador: "LinkedIn — ER Médio", formula: "Interações / Alcance × 100", baseline: "3.8", meta: "5.5", unidade: "%", frequencia: "Mensal", responsavel: "Time Marketing", status: "Ativo", trend: "Meta Q4" },
  { id: "d4", perspectiva: "Processos Internos", indicador: "YouTube — ER Médio", formula: "Interações / Visualizações × 100", baseline: "4.2", meta: "6.8", unidade: "%", frequencia: "Mensal", responsavel: "Time Marketing", status: "Ativo", trend: "Meta Q4" },
  { id: "d5", perspectiva: "Clientes", indicador: "Instagram — Conversão Clientes", formula: "Clientes convertidos em seguidores", baseline: "0", meta: "105", unidade: "conv.", frequencia: "Trimestral", responsavel: "Time Marketing", status: "Ativo", trend: "Q1: 30–45" },
  { id: "d6", perspectiva: "Inovação", indicador: "Cases de Sucesso Publicados", formula: "Publicação a partir de Jul/26", baseline: "0", meta: "4", unidade: "cases", frequencia: "Semestral", responsavel: "Time Conteúdo", status: "Ativo", trend: "H2/2026" },
]

const DEFAULT_OKRS = [
  {
    id: "do1", titulo: "LinkedIn — Autoridade & Crescimento", pilar: "P1 - Crescimento & Receita", color: "#0077b5",
    keyResults: [
      { id: "kr1", descricao: "Seguidores Líquidos Anuais", baseline: "0", meta: "200", unidade: "seg.", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 40 },
      { id: "kr2", descricao: "ER Médio Q4", baseline: "3.8", meta: "5.5", unidade: "%", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 69 },
    ],
    quarterly: [
      { q: "Q1", target: 80, er_min: 2.5, er_max: 3.5, er_mid: 3.0, label: "Jan–Mar" },
      { q: "Q2", target: 120, er_min: 3.0, er_max: 4.0, er_mid: 3.5, label: "Abr–Jun" },
      { q: "Q3", target: 150, er_min: 3.5, er_max: 4.5, er_mid: 4.0, label: "Jul–Set" },
      { q: "Q4", target: 180, er_min: 4.0, er_max: 5.5, er_mid: 4.75, label: "Out–Dez" },
    ],
    meta_anual: 200,
  },
  {
    id: "do2", titulo: "YouTube — Presença & Profundidade", pilar: "P2 - Clientes & Mercado", color: "#ff4444",
    keyResults: [
      { id: "kr3", descricao: "Inscritos Líquidos Anuais", baseline: "0", meta: "500", unidade: "insc.", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 10 },
      { id: "kr4", descricao: "ER Médio Q4", baseline: "4.2", meta: "6.8", unidade: "%", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 62 },
    ],
    quarterly: [
      { q: "Q1", target: 50, er_min: 3.0, er_max: 4.0, er_mid: 3.5, label: "Jan–Mar" },
      { q: "Q2", target: 80, er_min: 3.5, er_max: 4.8, er_mid: 4.15, label: "Abr–Jun" },
      { q: "Q3", target: 100, er_min: 4.2, er_max: 5.8, er_mid: 5.0, label: "Jul–Set" },
      { q: "Q4", target: 350, er_min: 4.8, er_max: 6.8, er_mid: 5.8, label: "Out–Dez" },
    ],
    meta_anual: 500,
  },
  {
    id: "do3", titulo: "Prova Social H2", pilar: "P3 - Operações & Processos", color: "#f59e0b",
    keyResults: [
      { id: "kr5", descricao: "Vídeos curtos por semana", baseline: "0", meta: "1", unidade: "/sem", prazo: "Jul/26", responsavel: "Conteúdo", status: "Não iniciado", percentual: 0 },
      { id: "kr6", descricao: "Cases de Sucesso publicados", baseline: "0", meta: "4", unidade: "cases", prazo: "Dez/26", responsavel: "Conteúdo", status: "Não iniciado", percentual: 0 },
    ],
    quarterly: [
      { q: "Q1", target: 0, label: "Jan–Mar" },
      { q: "Q2", target: 0, label: "Abr–Jun" },
      { q: "Q3", target: 2, label: "Jul–Set" },
      { q: "Q4", target: 4, label: "Out–Dez" },
    ],
    meta_anual: 4,
  },
  {
    id: "do4", titulo: "Conversão de Clientes em Seguidores", pilar: "P4 - Pessoas & Cultura", color: "#8b5cf6",
    keyResults: [
      { id: "kr7", descricao: "Instagram Conversões Anuais", baseline: "0", meta: "105", unidade: "", prazo: "Dez/26", responsavel: "Vendas", status: "Em andamento", percentual: 29 },
      { id: "kr8", descricao: "LinkedIn Conversões Anuais", baseline: "0", meta: "32", unidade: "", prazo: "Dez/26", responsavel: "Vendas", status: "Em andamento", percentual: 9 },
      { id: "kr9", descricao: "YouTube Conversões Anuais", baseline: "0", meta: "56", unidade: "", prazo: "Dez/26", responsavel: "Vendas", status: "Em andamento", percentual: 7 },
    ],
    quarterly: [
      { q: "Q1", ig: [30, 45], li: [3, 5], yt: [4, 6], ig_mid: 37, li_mid: 4, yt_mid: 5, label: "Jan–Mar" },
      { q: "Q2", ig: [20, 30], li: [5, 7], yt: [7, 10], ig_mid: 25, li_mid: 6, yt_mid: 8, label: "Abr–Jun" },
      { q: "Q3", ig: [10, 20], li: [8, 10], yt: [12, 15], ig_mid: 15, li_mid: 9, yt_mid: 13, label: "Jul–Set" },
      { q: "Q4", ig: [10, 20], li: [12, 15], yt: [20, 25], ig_mid: 15, li_mid: 13, yt_mid: 22, label: "Out–Dez" },
    ],
    meta_anual: { ig: [70, 105], li: [28, 32], yt: [43, 56] },
  },
]

// ─── CUSTOM TOOLTIP (high contrast) ──────────────
function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: darkMode ? "rgba(8, 18, 40, 0.97)" : "rgba(255,255,255,0.99)",
      border: `1px solid ${darkMode ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"}`,
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
      minWidth: 140,
    }}>
      <p style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "#6b7280", fontSize: 10, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: 7 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "#9ca3af", fontSize: 11 }}>{p.name}:</span>
          <span style={{ color: darkMode ? "#ffffff" : "#111827", fontSize: 11, fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── MINI SPARKLINE ───────────────────────────────
function MiniSparkline({ color, seed }: { color: string; seed: number }) {
  const data = Array.from({ length: 8 }, (_, i) => ({
    v: Math.round(10 + ((seed * 7 + i * 13) % 50) + i * 4)
  }))
  return (
    <ResponsiveContainer width="100%" height={36}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── KPI CARD ─────────────────────────────────────
function KPICard({ kpi, idx, darkMode, accent, onClick }: { kpi: any; idx: number; darkMode: boolean; accent: any; onClick: () => void }) {
  const color = PERSP_COLORS[kpi.perspectiva] || accent?.from || "#3b82f6"
  const b = parseFloat(kpi.baseline) || 0
  const m = parseFloat(kpi.meta) || 100
  const progress = m > 0 ? Math.min(Math.round((b / m) * 100), 100) : 0
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const metaTextColor = darkMode ? "rgba(255,255,255,0.75)" : "#374151"

  return (
    <div onClick={onClick}
      className="rounded-2xl p-5 cursor-pointer group transition-all duration-200"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 32px ${color}18, 0 0 0 1px ${color}35` }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5"
            style={{ background: color + "20", color }}>{kpi.perspectiva}</span>
          <p className={`text-sm font-bold leading-tight ${darkMode ? "text-white" : "text-gray-900"}`}>{kpi.indicador}</p>
          <p className={`text-xs mt-0.5 truncate ${darkMode ? "text-white/40" : "text-gray-400"}`}>{kpi.formula}</p>
        </div>
        <ArrowUpRight size={15} className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }} />
      </div>

      <div className="flex items-end gap-2 mb-2">
        <div>
          <p className={`text-[10px] mb-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Atual</p>
          <p className="text-2xl font-extrabold leading-none" style={{ color }}>
            {kpi.baseline || "—"}{kpi.unidade && <span className="text-sm font-normal ml-0.5">{kpi.unidade}</span>}
          </p>
        </div>
        <span className={`text-xs mb-1 ${darkMode ? "text-white/20" : "text-gray-300"}`}>→</span>
        <div>
          <p className={`text-[10px] mb-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Meta</p>
          <p className="text-lg font-bold leading-none" style={{ color: metaTextColor }}>
            {kpi.meta || "—"}{kpi.unidade && <span className="text-sm font-normal ml-0.5">{kpi.unidade}</span>}
          </p>
        </div>
        <div className="flex-1" />
        {kpi.trend && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-1" style={{ background: color + "20", color }}>{kpi.trend}</span>
        )}
      </div>

      <MiniSparkline color={color} seed={idx + 1} />

      <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${color}88,${color})` }} />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className={`text-[10px] ${darkMode ? "text-white/30" : "text-gray-400"}`}>{kpi.responsavel}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{progress}%</span>
      </div>
    </div>
  )
}

// ─── OKR CARD (hover + ver detalhes) ─────────────
function OKRCard({ obj, idx, darkMode, accent, onDetail }: { obj: any; idx: number; darkMode: boolean; accent: any; onDetail: () => void }) {
  const [hovered, setHovered] = useState(false)
  const COLORS = ["#0077b5", "#ff4444", "#f59e0b", "#8b5cf6", "#22c55e"]
  const color = obj.color || COLORS[idx % COLORS.length]
  const avg = obj.keyResults?.length > 0
    ? Math.round(obj.keyResults.reduce((s: number, k: any) => s + (k.percentual || 0), 0) / obj.keyResults.length)
    : 0

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
      style={{
        background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
        border: `1px solid ${hovered ? color + "50" : (darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)")}`,
        boxShadow: hovered ? `0 10px 40px ${color}18, 0 0 0 1px ${color}28` : "none",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
          background: `radial-gradient(ellipse at top left, ${color}08, transparent 55%)`
        }} />
      )}

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
          style={{ background: color }}>O{idx + 1}</div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{obj.titulo}</p>
          <p className={`text-[11px] mt-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>{obj.pilar}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold" style={{ color }}>{avg}%</p>
          <p className={`text-[10px] ${darkMode ? "text-white/30" : "text-gray-400"}`}>concluído</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
              strokeDasharray={`${avg} 100`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.7s ease" }} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{avg}%</span>
        </div>
        <div className="flex-1 space-y-2">
          {obj.keyResults?.slice(0, 3).map((kr: any, ki: number) => (
            <div key={ki}>
              <div className="flex justify-between mb-0.5">
                <span className={`text-[10px] truncate ${darkMode ? "text-white/50" : "text-gray-500"}`}>KR{ki + 1} {kr.descricao?.slice(0, 22)}</span>
                <span className="text-[10px] font-bold ml-2 flex-shrink-0" style={{ color }}>{kr.percentual || 0}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${kr.percentual || 0}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: hovered ? 44 : 0, opacity: hovered ? 1 : 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.25s ease" }}>
        <button
          onClick={e => { e.stopPropagation(); onDetail() }}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all"
          style={{ background: color + "18", color, border: `1px solid ${color}30` }}
          onMouseEnter={e => (e.currentTarget.style.background = color + "30")}
          onMouseLeave={e => (e.currentTarget.style.background = color + "18")}
        >
          <Eye size={13} />
          Ver Detalhes
        </button>
      </div>
    </div>
  )
}

// ─── OKR DETAIL MODAL ────────────────────────────
function OKRDetailModal({ obj, darkMode, onClose }: { obj: any; darkMode: boolean; onClose: () => void }) {
  const COLORS = ["#0077b5", "#ff4444", "#f59e0b", "#8b5cf6", "#22c55e"]
  const color = obj.color || COLORS[0]
  const avg = obj.keyResults?.length > 0
    ? Math.round(obj.keyResults.reduce((s: number, k: any) => s + (k.percentual || 0), 0) / obj.keyResults.length)
    : 0
  const isConversion = !!obj.quarterly?.[0]?.ig
  const bgModal = darkMode ? "#0a1628" : "#ffffff"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
      <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bgModal, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>

        <div className="p-6 sticky top-0 z-10" style={{ background: bgModal, borderBottom: `1px solid ${color}20` }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm mb-3"
                style={{ background: color }}>
                {obj.id?.replace("do", "O") || "O?"}
              </div>
              <h2 className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>{obj.titulo}</h2>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/50" : "text-gray-500"}`}>{obj.pilar}</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress ring + KRs */}
          <div className="flex items-start gap-6">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="2.5"
                  strokeDasharray={`${avg} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold" style={{ color }}>{avg}%</span>
                <span className={`text-[9px] ${darkMode ? "text-white/40" : "text-gray-400"}`}>concluído</span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {obj.keyResults?.map((kr: any, ki: number) => (
                <div key={ki}>
                  <div className="flex justify-between mb-1">
                    <span className={`text-xs font-medium ${darkMode ? "text-white/70" : "text-gray-700"}`}>KR{ki + 1}: {kr.descricao}</span>
                    <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color }}>{kr.percentual || 0}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${kr.percentual || 0}%`, background: color }} />
                    </div>
                    <span className={`text-[10px] flex-shrink-0 ${darkMode ? "text-white/35" : "text-gray-400"}`}>{kr.baseline} → {kr.meta} {kr.unidade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quarterly chart — growth type */}
          {!isConversion && obj.quarterly?.[0]?.target !== undefined && (
            <div>
              <p className={`text-sm font-bold mb-3 ${darkMode ? "text-white/70" : "text-gray-700"}`}>Metas por Trimestre</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={obj.quarterly} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                  <XAxis dataKey="q" tick={{ fontSize: 11, fill: darkMode ? "rgba(255,255,255,0.5)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: darkMode ? "rgba(255,255,255,0.5)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={(p) => <CustomTooltip {...p} darkMode={darkMode} />} />
                  <Bar dataKey="target" name="Meta Trimestral" fill={color} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              {obj.quarterly[0]?.er_min !== undefined && (
                <div className="mt-4">
                  <p className={`text-sm font-bold mb-3 ${darkMode ? "text-white/70" : "text-gray-700"}`}>Faixa de ER% por Trimestre</p>
                  <div className="grid grid-cols-4 gap-2">
                    {obj.quarterly.map((q: any) => (
                      <div key={q.q} className="rounded-xl p-3 text-center"
                        style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                        <p className={`text-[10px] mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>{q.q}</p>
                        <p className="text-sm font-bold" style={{ color }}>{q.er_min}–{q.er_max}%</p>
                        <p className={`text-[10px] ${darkMode ? "text-white/30" : "text-gray-400"}`}>{q.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Conversion table for OKR4 */}
          {isConversion && (
            <div>
              <p className={`text-sm font-bold mb-3 ${darkMode ? "text-white/70" : "text-gray-700"}`}>Metas de Conversão por Canal e Trimestre</p>
              <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                      <th className={`text-left px-4 py-3 font-semibold ${darkMode ? "text-white/50" : "text-gray-500"}`}>Canal</th>
                      {obj.quarterly.map((q: any) => (
                        <th key={q.q} className={`text-center px-3 py-3 font-semibold ${darkMode ? "text-white/50" : "text-gray-500"}`}>{q.q}</th>
                      ))}
                      <th className={`text-center px-3 py-3 font-bold ${darkMode ? "text-white/70" : "text-gray-700"}`}>ANO</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "Instagram", key: "ig", color: "#e1306c", meta: obj.meta_anual?.ig },
                      { label: "LinkedIn", key: "li", color: "#0077b5", meta: obj.meta_anual?.li },
                      { label: "YouTube", key: "yt", color: "#ff4444", meta: obj.meta_anual?.yt },
                    ].map((ch, ci) => (
                      <tr key={ch.key} style={{ borderTop: ci > 0 ? `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none" }}>
                        <td className="px-4 py-3">
                          <span className="font-bold" style={{ color: ch.color }}>{ch.label}</span>
                        </td>
                        {obj.quarterly.map((q: any) => (
                          <td key={q.q} className={`text-center px-3 py-3 ${darkMode ? "text-white/70" : "text-gray-700"}`}>
                            {q[ch.key] ? `${q[ch.key][0]}–${q[ch.key][1]}` : "—"}
                          </td>
                        ))}
                        <td className="text-center px-3 py-3 font-bold" style={{ color: ch.color }}>
                          {ch.meta ? `${ch.meta[0]}–${ch.meta[1]}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {obj.keyResults?.slice(0, 2).map((kr: any, i: number) => (
              <div key={i} className="rounded-xl p-3" style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>KR{i + 1} Status</p>
                <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{kr.status}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── KPI MODAL ────────────────────────────────────
function KPIModal({ kpi, darkMode, onClose }: { kpi: any; darkMode: boolean; onClose: () => void }) {
  const color = PERSP_COLORS[kpi.perspectiva] || "#3b82f6"
  const b = parseFloat(kpi.baseline) || 0
  const m = parseFloat(kpi.meta) || 100
  const progress = m > 0 ? Math.min(Math.round((b / m) * 100), 100) : 0

  const monthData = Array.from({ length: 6 }, (_, i) => ({
    mes: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][i],
    real: Math.round((b / 6) * (i + 1) * (0.8 + ((i * 37) % 40) / 100)),
    meta: Math.round(m / 12),
  }))

  const metaColor = darkMode ? "rgba(255,255,255,0.85)" : "#374151"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
      <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: darkMode ? "#0d1b2e" : "#fff" }}
        onClick={e => e.stopPropagation()}>

        <div className="p-6" style={{ background: `linear-gradient(135deg,${color}15,${color}05)`, borderBottom: `1px solid ${color}20` }}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full inline-block mb-2" style={{ background: color + "20", color }}>{kpi.perspectiva}</span>
              <h2 className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>{kpi.indicador}</h2>
              <p className={`text-sm mt-1 ${darkMode ? "text-white/50" : "text-gray-500"}`}>{kpi.formula}</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}><X size={16} /></button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Atual", value: `${kpi.baseline || "—"}${kpi.unidade ? ` ${kpi.unidade}` : ""}`, textColor: color },
              { label: "Meta", value: `${kpi.meta || "—"}${kpi.unidade ? ` ${kpi.unidade}` : ""}`, textColor: metaColor },
              { label: "Progresso", value: `${progress}%`, textColor: color },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>{s.label}</p>
                <p className="text-lg font-extrabold" style={{ color: s.textColor }}>{s.value}</p>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
              <span>0</span>
              <span className="font-semibold" style={{ color }}>{progress}% atingido</span>
              <span>{kpi.meta}{kpi.unidade}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: `linear-gradient(90deg,${color}88,${color})` }} />
            </div>
          </div>

          <div>
            <p className={`text-xs font-semibold mb-3 ${darkMode ? "text-white/50" : "text-gray-500"}`}>Projeção Mensal — H1/2026</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: darkMode ? "rgba(255,255,255,0.4)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: darkMode ? "rgba(255,255,255,0.4)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip content={(p) => <CustomTooltip {...p} darkMode={darkMode} />} />
                <Bar dataKey="meta" name="Meta Mensal" fill={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)"} radius={[4, 4, 0, 0]} />
                <Bar dataKey="real" name="Projeção Real" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Frequência", value: kpi.frequencia },
              { label: "Responsável", value: kpi.responsavel || "—" },
              { label: "Status", value: kpi.status },
              { label: "Unidade", value: kpi.unidade || "—" },
            ].map(f => (
              <div key={f.label} className="rounded-xl p-3" style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>{f.label}</p>
                <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── OKR QUARTERLY TRACKER (novo chart) ──────────
function OKRQuarterlyTracker({ darkMode, accent }: { darkMode: boolean; accent: any }) {
  const [tab, setTab] = useState<"growth" | "er" | "conversion">("growth")
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  const growthData = [
    { q: "Q1", LinkedIn: 80, YouTube: 50 },
    { q: "Q2", LinkedIn: 120, YouTube: 80 },
    { q: "Q3", LinkedIn: 150, YouTube: 100 },
    { q: "Q4", LinkedIn: 180, YouTube: 350 },
    { q: "ANO", LinkedIn: 200, YouTube: 500 },
  ]

  const erData = [
    { q: "Q1", "LI Min": 2.5, "LI Médio": 3.0, "LI Max": 3.5, "YT Min": 3.0, "YT Médio": 3.5, "YT Max": 4.0 },
    { q: "Q2", "LI Min": 3.0, "LI Médio": 3.5, "LI Max": 4.0, "YT Min": 3.5, "YT Médio": 4.15, "YT Max": 4.8 },
    { q: "Q3", "LI Min": 3.5, "LI Médio": 4.0, "LI Max": 4.5, "YT Min": 4.2, "YT Médio": 5.0, "YT Max": 5.8 },
    { q: "Q4", "LI Min": 4.0, "LI Médio": 4.75, "LI Max": 5.5, "YT Min": 4.8, "YT Médio": 5.8, "YT Max": 6.8 },
  ]

  const convData = [
    { q: "Q1", Instagram: 37, LinkedIn: 4, YouTube: 5 },
    { q: "Q2", Instagram: 25, LinkedIn: 6, YouTube: 8 },
    { q: "Q3", Instagram: 15, LinkedIn: 9, YouTube: 13 },
    { q: "Q4", Instagram: 15, LinkedIn: 13, YouTube: 22 },
  ]

  const TABS = [
    { id: "growth", label: "Crescimento" },
    { id: "er", label: "Engajamento ER%" },
    { id: "conversion", label: "Conversão" },
  ]

  const axisProps = { fontSize: 11, fill: darkMode ? "rgba(255,255,255,0.45)" : "#9ca3af" }
  const gridProps = { strokeDasharray: "3 3", stroke: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }
  const dotProps = (color: string) => ({
    r: 5, strokeWidth: 2,
    stroke: darkMode ? "#0a1628" : "#ffffff",
    fill: color,
  })
  const activeDotProps = (color: string) => ({ r: 7, fill: color })

  const Legend = ({ items }: { items: { color: string; label: string }[] }) => (
    <div className="flex gap-5 mb-4 flex-wrap">
      {items.map(l => (
        <div key={l.label} className="flex items-center gap-2">
          <div style={{ width: 22, height: 3, borderRadius: 2, background: l.color }} />
          <span className={`text-xs ${darkMode ? "text-white/50" : "text-gray-500"}`}>{l.label}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="rounded-2xl p-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className={`font-bold text-base ${darkMode ? "text-white" : "text-gray-900"}`}>Tracker Trimestral de OKRs</p>
          <p className={`text-xs mt-0.5 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Metas por canal e trimestre · Planejamento 2026 · dados: Dev Mode → OKRs</p>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: tab === t.id ? (accent?.css || "linear-gradient(135deg,#3b82f6,#8b5cf6)") : (darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"),
                color: tab === t.id ? "#fff" : (darkMode ? "rgba(255,255,255,0.5)" : "#6b7280"),
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "growth" && (
        <>
          <Legend items={[{ color: "#0077b5", label: "LinkedIn — meta anual +200 seg." }, { color: "#ff4444", label: "YouTube — meta anual +500 insc." }]} />
          <ResponsiveContainer width="100%" height={270}>
            <ComposedChart data={growthData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="q" tick={axisProps} axisLine={false} tickLine={false} />
              <YAxis tick={axisProps} axisLine={false} tickLine={false} />
              <Tooltip content={(p) => <CustomTooltip {...p} darkMode={darkMode} />} />
              <Area type="monotone" dataKey="LinkedIn" name="LinkedIn Seguidores" stroke="#0077b5" fill="#0077b518" strokeWidth={2.5}
                dot={dotProps("#0077b5")} activeDot={activeDotProps("#0077b5")} />
              <Area type="monotone" dataKey="YouTube" name="YouTube Inscritos" stroke="#ff4444" fill="#ff444412" strokeWidth={2.5}
                dot={dotProps("#ff4444")} activeDot={activeDotProps("#ff4444")} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className={`text-[10px] text-center mt-2 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
            Pico YouTube Q4: +350 inscritos · Salto expressivo no último trimestre
          </p>
        </>
      )}

      {tab === "er" && (
        <>
          <Legend items={[
            { color: "#0077b5", label: "LinkedIn ER% (banda min–max + médio)" },
            { color: "#ff4444", label: "YouTube ER% (banda min–max + médio)" },
          ]} />
          <ResponsiveContainer width="100%" height={270}>
            <ComposedChart data={erData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="q" tick={axisProps} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${v}%`} tick={axisProps} axisLine={false} tickLine={false} />
              <Tooltip content={(p) => <CustomTooltip {...p} darkMode={darkMode} />} formatter={(v: any) => [`${v}%`, ""]} />
              <Line type="monotone" dataKey="LI Min" name="LI Min" stroke="#0077b5" strokeWidth={1} strokeDasharray="4 3" dot={false} opacity={0.45} />
              <Line type="monotone" dataKey="LI Médio" name="LI Médio" stroke="#0077b5" strokeWidth={2.5} dot={dotProps("#0077b5")} activeDot={activeDotProps("#0077b5")} />
              <Line type="monotone" dataKey="LI Max" name="LI Max" stroke="#0077b5" strokeWidth={1} strokeDasharray="4 3" dot={false} opacity={0.45} />
              <Line type="monotone" dataKey="YT Min" name="YT Min" stroke="#ff4444" strokeWidth={1} strokeDasharray="4 3" dot={false} opacity={0.45} />
              <Line type="monotone" dataKey="YT Médio" name="YT Médio" stroke="#ff4444" strokeWidth={2.5} dot={dotProps("#ff4444")} activeDot={activeDotProps("#ff4444")} />
              <Line type="monotone" dataKey="YT Max" name="YT Max" stroke="#ff4444" strokeWidth={1} strokeDasharray="4 3" dot={false} opacity={0.45} />
            </ComposedChart>
          </ResponsiveContainer>
          <p className={`text-[10px] text-center mt-2 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
            Linhas sólidas = ER médio alvo · Tracejadas = banda min–max por trimestre
          </p>
        </>
      )}

      {tab === "conversion" && (
        <>
          <Legend items={[{ color: "#e1306c", label: "Instagram" }, { color: "#0077b5", label: "LinkedIn" }, { color: "#ff4444", label: "YouTube" }]} />
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={convData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }} barCategoryGap="28%">
              <CartesianGrid {...gridProps} />
              <XAxis dataKey="q" tick={axisProps} axisLine={false} tickLine={false} />
              <YAxis tick={axisProps} axisLine={false} tickLine={false} />
              <Tooltip content={(p) => <CustomTooltip {...p} darkMode={darkMode} />} />
              <Bar dataKey="Instagram" name="Instagram" fill="#e1306c" radius={[5, 5, 0, 0]} />
              <Bar dataKey="LinkedIn" name="LinkedIn" fill="#0077b5" radius={[5, 5, 0, 0]} />
              <Bar dataKey="YouTube" name="YouTube" fill="#ff4444" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className={`text-[10px] text-center mt-2 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
            Valores médios das faixas-alvo · Instagram Anual: 70–105 · LinkedIn: 28–32 · YouTube: 43–56
          </p>
        </>
      )}
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────
export default function KPIs({ darkMode = false, accentGradient }: PageProps) {
  const { data: planningData } = usePlanningData()
  const { fontSettings: fs } = useFontSettings()
  const [selectedKPI, setSelectedKPI] = useState<any | null>(null)
  const [selectedOKR, setSelectedOKR] = useState<any | null>(null)
  const [filterPersp, setFilterPersp] = useState("Todas")

  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }

  const devKPIs = planningData.kpis.filter((k: any) => k.indicador)
  const kpis = devKPIs.length > 0 ? devKPIs : DEFAULT_KPIS

  const devOKRs = planningData.objetivos.filter((o: any) => o.titulo)
  const OKRCOLORS = ["#0077b5", "#ff4444", "#f59e0b", "#8b5cf6", "#22c55e"]
  const okrs = devOKRs.length > 0
    ? devOKRs.map((o: any, i: number) => ({ ...o, color: OKRCOLORS[i % OKRCOLORS.length] }))
    : DEFAULT_OKRS

  const perspectivas = ["Todas", ...Array.from(new Set(kpis.map((k: any) => k.perspectiva)))]
  const filteredKPIs = filterPersp === "Todas" ? kpis : kpis.filter((k: any) => k.perspectiva === filterPersp)

  const avgProgress = kpis.length > 0
    ? Math.round(kpis.reduce((sum: number, k: any) => {
        const b = parseFloat(k.baseline) || 0
        const m = parseFloat(k.meta) || 100
        return sum + Math.min((b / m) * 100, 100)
      }, 0) / kpis.length)
    : 0

  const onTrack = kpis.filter((k: any) => {
    const b = parseFloat(k.baseline) || 0
    const m = parseFloat(k.meta) || 100
    return m > 0 && b / m >= 0.5
  }).length

  const perspData = Array.from(new Set(kpis.map((k: any) => k.perspectiva))).map((p: any) => {
    const items = kpis.filter((k: any) => k.perspectiva === p)
    return {
      name: p.length > 14 ? p.slice(0, 14) + "…" : p,
      avg: items.length > 0
        ? Math.round(items.reduce((s: number, k: any) => {
            const b = parseFloat(k.baseline) || 0
            const m = parseFloat(k.meta) || 100
            return s + Math.min((b / m) * 100, 100)
          }, 0) / items.length)
        : 0,
      count: items.length,
      color: PERSP_COLORS[p] || "#6b7280",
    }
  })

  const cardStyle = {
    background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
  }

  const titleStyle = { fontSize: `${fs.titulo.size}px`, textAlign: fs.titulo.align as any, color: darkMode ? "#fff" : "#111827", fontWeight: 800, marginBottom: 4 }
  const subStyle = { fontSize: `${fs.subtitulo1.size}px`, textAlign: fs.subtitulo1.align as any, color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280", marginBottom: 20 }

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      <HeroHeader accentGradient={accentGradient} />

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "KPIs Monitorados", value: kpis.length, icon: BarChart2, color: accent.from || "#3b82f6" },
          { label: "Progresso Médio", value: `${avgProgress}%`, icon: TrendingUp, color: "#22c55e" },
          { label: "No Caminho Certo", value: onTrack, icon: Target, color: "#f59e0b" },
          { label: "OKRs Ativos", value: okrs.length, icon: Zap, color: "#8b5cf6" },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + "20" }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className={`text-xs ${darkMode ? "text-white/40" : "text-gray-500"}`}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* KPIs section */}
      <section>
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p style={titleStyle}>Indicadores-Chave de Performance</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>
              {devKPIs.length > 0 ? `${kpis.length} KPIs do Dev Mode` : "Dados padrão · "}
              <span style={{ color: accent.from, fontWeight: 600 }}> edite em Dev Mode → KPIs</span>
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {perspectivas.map(p => (
              <button key={p} onClick={() => setFilterPersp(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filterPersp === p ? (accent.css || "#3b82f6") : (darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                  color: filterPersp === p ? "#fff" : (darkMode ? "rgba(255,255,255,0.5)" : "#6b7280"),
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                }}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKPIs.map((kpi: any, i: number) => (
            <KPICard key={kpi.id || i} kpi={kpi} idx={i} darkMode={darkMode} accent={accent} onClick={() => setSelectedKPI(kpi)} />
          ))}
        </div>
      </section>

      {/* Perspectiva + OKR summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6" style={cardStyle}>
          <p className={`font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Performance por Perspectiva BSC</p>
          <div className="space-y-3">
            {perspData.map((p: any, i: number) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${darkMode ? "text-white/80" : "text-gray-700"}`}>{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}>{p.count} KPI{p.count !== 1 ? "s" : ""}</span>
                    <span className="text-sm font-bold" style={{ color: p.color }}>{p.avg}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.avg}%`, background: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6" style={cardStyle}>
          <p className={`font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>Progresso dos OKRs</p>
          <div className="space-y-3">
            {okrs.map((obj: any, i: number) => {
              const avg = obj.keyResults?.length > 0
                ? Math.round(obj.keyResults.reduce((s: number, k: any) => s + (k.percentual || 0), 0) / obj.keyResults.length)
                : 0
              const color = obj.color || OKRCOLORS[i % OKRCOLORS.length]
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium truncate ${darkMode ? "text-white/80" : "text-gray-700"}`} style={{ maxWidth: "72%" }}>
                      O{i + 1}: {obj.titulo?.slice(0, 30)}
                    </span>
                    <span className="text-sm font-bold flex-shrink-0 ml-2" style={{ color }}>{avg}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${avg}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* NEW: OKR Quarterly Tracker */}
      <OKRQuarterlyTracker darkMode={darkMode} accent={accent} />

      {/* OKR Cards */}
      <section>
        <p style={titleStyle}>OKRs — Objetivos e Resultados-Chave</p>
        <p style={subStyle}>Passe o mouse para ver detalhes · clique em "Ver Detalhes" para análise completa</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {okrs.map((obj: any, i: number) => (
            <OKRCard key={obj.id || i} obj={obj} idx={i} darkMode={darkMode} accent={accent} onDetail={() => setSelectedOKR(obj)} />
          ))}
        </div>
      </section>

      {/* Channel Chart */}
      <section className="rounded-2xl p-6" style={cardStyle}>
        <p style={titleStyle}>Crescimento por Canal</p>
        <p style={subStyle}>Evolução de seguidores ao longo de 2026</p>
        <ChannelChart dark={darkMode} />
      </section>

      {selectedKPI && <KPIModal kpi={selectedKPI} darkMode={darkMode} onClose={() => setSelectedKPI(null)} />}
      {selectedOKR && <OKRDetailModal obj={selectedOKR} darkMode={darkMode} onClose={() => setSelectedOKR(null)} />}
    </div>
  )
}
