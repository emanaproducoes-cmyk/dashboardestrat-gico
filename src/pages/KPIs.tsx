import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import OKRNightingaleChart from "../components/dashboard/OKRNightingaleChart"
import ChannelChart from "../components/dashboard/ChannelChart"
import { useFontSettings } from "../lib/FontSettingsContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid, Cell
} from "recharts"
import { TrendingUp, Target, BarChart2, Zap, X, ChevronRight, ArrowUpRight } from "lucide-react"

const PERSP_COLORS: Record<string, string> = {
  "Financeira": "#22c55e",
  "Clientes": "#3b82f6",
  "Processos Internos": "#f59e0b",
  "Aprendizado & Crescimento": "#8b5cf6",
  "Inovação": "#ec4899",
}

const DEFAULT_KPIS = [
  { id: "d1", perspectiva: "Clientes", indicador: "Meta LinkedIn Seguidores", formula: "Novos seguidores em 2026", baseline: "80", meta: "200", unidade: "", frequencia: "Mensal", responsavel: "Time Marketing", status: "Ativo", trend: "+40%" },
  { id: "d2", perspectiva: "Clientes", indicador: "Meta YouTube Inscritos", formula: "Novos inscritos em 2026", baseline: "50", meta: "500", unidade: "", frequencia: "Mensal", responsavel: "Time Marketing", status: "Ativo", trend: "+10%" },
  { id: "d3", perspectiva: "Processos Internos", indicador: "Engajamento LinkedIn", formula: "Taxa alvo de engajamento", baseline: "3.8", meta: "5.5", unidade: "%", frequencia: "Mensal", responsavel: "Time Marketing", status: "Ativo", trend: "+64%" },
  { id: "d4", perspectiva: "Processos Internos", indicador: "Engajamento YouTube", formula: "Taxa alvo de engajamento", baseline: "4.2", meta: "6.8", unidade: "%", frequencia: "Mensal", responsavel: "Time Marketing", status: "Ativo", trend: "+59%" },
  { id: "d5", perspectiva: "Clientes", indicador: "Conversões Instagram", formula: "Conversões no ano", baseline: "22", meta: "105", unidade: "", frequencia: "Mensal", responsavel: "Time Marketing", status: "Ativo", trend: "+29%" },
  { id: "d6", perspectiva: "Inovação", indicador: "Cases de Sucesso", formula: "Publicação a partir de Jul/26", baseline: "0", meta: "4", unidade: "", frequencia: "Trimestral", responsavel: "Time Conteúdo", status: "Ativo", trend: "0%" },
]

const DEFAULT_OKRS = [
  {
    id: "do1", titulo: "Crescimento de Audiência", pilar: "P1 - Crescimento & Receita",
    keyResults: [
      { id: "kr1", descricao: "LinkedIn Seguidores", baseline: "80", meta: "200", unidade: "", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 40 },
      { id: "kr2", descricao: "YouTube Inscritos", baseline: "50", meta: "500", unidade: "", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 10 },
    ]
  },
  {
    id: "do2", titulo: "Engajamento & Qualidade", pilar: "P2 - Clientes & Mercado",
    keyResults: [
      { id: "kr3", descricao: "LI Engajamento", baseline: "3.8", meta: "5.5", unidade: "%", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 64 },
      { id: "kr4", descricao: "YT Engajamento", baseline: "4.2", meta: "6.8", unidade: "%", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 59 },
    ]
  },
  {
    id: "do3", titulo: "Conversões & Prova Social", pilar: "P3 - Operações & Processos",
    keyResults: [
      { id: "kr5", descricao: "IG Conversão", baseline: "22", meta: "105", unidade: "", prazo: "Dez/26", responsavel: "Marketing", status: "Em andamento", percentual: 29 },
      { id: "kr6", descricao: "Prova Social", baseline: "0", meta: "4", unidade: "cases", prazo: "Dez/26", responsavel: "Conteúdo", status: "Não iniciado", percentual: 0 },
    ]
  },
  {
    id: "do4", titulo: "Conversão Direta por Canal", pilar: "P4 - Pessoas & Cultura",
    keyResults: [
      { id: "kr7", descricao: "LI Conversão", baseline: "3", meta: "32", unidade: "", prazo: "Dez/26", responsavel: "Vendas", status: "Em andamento", percentual: 9 },
      { id: "kr8", descricao: "YT Conversão", baseline: "4", meta: "56", unidade: "", prazo: "Dez/26", responsavel: "Vendas", status: "Em andamento", percentual: 7 },
    ]
  },
]

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

function KPICard({ kpi, idx, darkMode, accent, onClick }: { kpi: any, idx: number, darkMode: boolean, accent: any, onClick: () => void }) {
  const color = PERSP_COLORS[kpi.perspectiva] || accent?.from || "#3b82f6"
  const b = parseFloat(kpi.baseline) || 0
  const m = parseFloat(kpi.meta) || 100
  const progress = m > 0 ? Math.min(Math.round((b / m) * 100), 100) : 0
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  return (
    <div onClick={onClick} className="rounded-2xl p-5 cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5"
            style={{ background: color + "20", color }}>
            {kpi.perspectiva}
          </span>
          <p className={`text-sm font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {kpi.indicador}
          </p>
          <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
            {kpi.formula}
          </p>
        </div>
        <ArrowUpRight size={15} className={`flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity`} style={{ color }} />
      </div>

      <div className="flex items-end gap-2 mb-2">
        <div>
          <p className={`text-[10px] mb-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Atual</p>
          <p className="text-2xl font-extrabold leading-none" style={{ color }}>
            {kpi.baseline || "—"}{kpi.unidade && <span className="text-sm font-normal ml-0.5">{kpi.unidade}</span>}
          </p>
        </div>
        <span className={`text-xs mb-1 ${darkMode ? 'text-white/20' : 'text-gray-300'}`}>→</span>
        <div>
          <p className={`text-[10px] mb-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Meta</p>
          <p className={`text-lg font-bold leading-none ${darkMode ? 'text-white/50' : 'text-gray-400'}`}>
            {kpi.meta || "—"}{kpi.unidade && <span className="text-sm font-normal ml-0.5">{kpi.unidade}</span>}
          </p>
        </div>
        <div className="flex-1" />
        {kpi.trend && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full mb-1"
            style={{ background: color + "20", color }}>
            {kpi.trend}
          </span>
        )}
      </div>

      <MiniSparkline color={color} seed={idx + 1} />

      <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${progress}%`, background: `linear-gradient(90deg,${color}88,${color})` }} />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className={`text-[10px] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{kpi.responsavel}</span>
        <span className="text-[10px] font-bold" style={{ color }}>{progress}%</span>
      </div>
    </div>
  )
}

function OKRCard({ obj, idx, darkMode, accent }: { obj: any, idx: number, darkMode: boolean, accent: any }) {
  const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899"]
  const color = colors[idx % colors.length]
  const avg = obj.keyResults?.length > 0
    ? Math.round(obj.keyResults.reduce((s: number, k: any) => s + (k.percentual || 0), 0) / obj.keyResults.length)
    : 0
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  return (
    <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
          style={{ background: color }}>O{idx + 1}</div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{obj.titulo}</p>
          <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{obj.pilar}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold" style={{ color }}>{avg}%</p>
          <p className={`text-[10px] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>concluído</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
              strokeDasharray={`${avg} 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{avg}%</span>
        </div>
        <div className="flex-1 space-y-2">
          {obj.keyResults?.map((kr: any, ki: number) => (
            <div key={ki}>
              <div className="flex justify-between mb-0.5">
                <span className={`text-[10px] truncate ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  KR{ki + 1} {kr.descricao?.slice(0, 22)}
                </span>
                <span className="text-[10px] font-bold ml-2 flex-shrink-0" style={{ color }}>{kr.percentual || 0}%</span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${kr.percentual || 0}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function KPIModal({ kpi, darkMode, onClose }: { kpi: any, darkMode: boolean, onClose: () => void }) {
  const color = PERSP_COLORS[kpi.perspectiva] || "#3b82f6"
  const b = parseFloat(kpi.baseline) || 0
  const m = parseFloat(kpi.meta) || 100
  const progress = m > 0 ? Math.min(Math.round((b / m) * 100), 100) : 0

  const chartData = [
    { name: "Atual", value: b },
    { name: "Meta", value: m },
  ]

  const monthData = Array.from({ length: 6 }, (_, i) => ({
    mes: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"][i],
    real: Math.round((b / 6) * (i + 1) * (0.8 + Math.random() * 0.4)),
    meta: Math.round(m / 6),
  }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: darkMode ? "#0d1b2e" : "#fff" }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="p-6" style={{ background: `linear-gradient(135deg,${color}15,${color}05)`, borderBottom: `1px solid ${color}20` }}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full inline-block mb-2"
                style={{ background: color + "20", color }}>{kpi.perspectiva}</span>
              <h2 className={`text-xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{kpi.indicador}</h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>{kpi.formula}</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Atual", value: `${kpi.baseline || "—"}${kpi.unidade ? ` ${kpi.unidade}` : ""}`, color },
              { label: "Meta", value: `${kpi.meta || "—"}${kpi.unidade ? ` ${kpi.unidade}` : ""}`, color: darkMode ? "rgba(255,255,255,0.4)" : "#9ca3af" },
              { label: "Progresso", value: `${progress}%`, color },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-1 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{s.label}</p>
                <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
              <span>0</span>
              <span className="font-semibold" style={{ color }}>{progress}% atingido</span>
              <span>{kpi.meta}{kpi.unidade}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg,${color}88,${color})` }} />
            </div>
          </div>

          {/* Bar chart */}
          <div>
            <p className={`text-xs font-semibold mb-3 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>Evolução Mensal (Projeção)</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, background: darkMode ? '#1e293b' : '#fff', border: 'none' }} />
                <Bar dataKey="meta" name="Meta" fill={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} radius={[4, 4, 0, 0]} />
                <Bar dataKey="real" name="Real" fill={color} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Frequência", value: kpi.frequencia },
              { label: "Responsável", value: kpi.responsavel || "—" },
              { label: "Status", value: kpi.status },
              { label: "Unidade", value: kpi.unidade || "—" },
            ].map(f => (
              <div key={f.label} className="rounded-xl p-3"
                style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{f.label}</p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KPIs({ darkMode = false, accentGradient }: PageProps) {
  const { fontSettings } = usePlanningData ? usePlanningData() : { data: { kpis: [], objetivos: [] } } as any
  const planningData = usePlanningData().data
  const { fontSettings: fs } = useFontSettings()
  const [selectedKPI, setSelectedKPI] = useState<any | null>(null)
  const [filterPersp, setFilterPersp] = useState("Todas")

  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }

  // Merge: Dev Mode KPIs + defaults
  const devKPIs = planningData.kpis.filter((k: any) => k.indicador)
  const kpis = devKPIs.length > 0 ? devKPIs : DEFAULT_KPIS

  const devOKRs = planningData.objetivos.filter((o: any) => o.titulo)
  const okrs = devOKRs.length > 0 ? devOKRs : DEFAULT_OKRS

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
    return m > 0 && (b / m) >= 0.5
  }).length

  const perspData = Array.from(new Set(kpis.map((k: any) => k.perspectiva))).map((p: any) => {
    const items = kpis.filter((k: any) => k.perspectiva === p)
    return {
      name: p.length > 14 ? p.slice(0, 14) + "…" : p,
      avg: items.length > 0 ? Math.round(items.reduce((s: number, k: any) => {
        const b = parseFloat(k.baseline) || 0
        const m = parseFloat(k.meta) || 100
        return s + Math.min((b / m) * 100, 100)
      }, 0) / items.length) : 0,
      count: items.length,
      color: PERSP_COLORS[p] || "#6b7280"
    }
  })

  const radarData = okrs.slice(0, 6).map((obj: any) => ({
    subject: obj.titulo?.slice(0, 18) || "OKR",
    A: obj.keyResults?.length > 0
      ? Math.round(obj.keyResults.reduce((s: number, kr: any) => s + (kr.percentual || 0), 0) / obj.keyResults.length)
      : 0,
  }))

  const sectionBg = darkMode
    ? "rounded-2xl bg-white/4 border border-white/8 p-6"
    : "rounded-2xl bg-white/90 border border-black/6 p-6 shadow-sm"

  const titleStyle = {
    fontSize: `${fs.titulo.size}px`,
    textAlign: fs.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 700,
    marginBottom: "4px",
  }
  const subStyle = {
    fontSize: `${fs.subtitulo1.size}px`,
    textAlign: fs.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: "20px",
  }

  const isDevData = devKPIs.length > 0

  return (
    <div className={`min-h-screen p-6 md:p-8 space-y-8`}>
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
            <div key={i} className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + "20" }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-500'}`}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* KPIs */}
      <section>
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p style={titleStyle}>Indicadores-Chave de Performance</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>
              {isDevData ? `${kpis.length} KPIs do Dev Mode` : "Dados padrão — adicione seus KPIs no Dev Mode"}
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {perspectivas.map(p => (
              <button key={p} onClick={() => setFilterPersp(p)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filterPersp === p ? (accent.css || "#3b82f6") : darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                  color: filterPersp === p ? "#fff" : darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
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

      {/* Perspectiva + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={sectionBg}>
          <p className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance por Perspectiva</p>
          <div className="space-y-3">
            {perspData.map((p: any, i: number) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>{p.name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{p.count} KPI{p.count !== 1 ? 's' : ''}</span>
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

        {radarData.length >= 3 && (
          <div className={sectionBg}>
            <p className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Radar de OKRs</p>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke={darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"} />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: darkMode ? 'rgba(255,255,255,0.5)' : '#9ca3af' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                <Radar dataKey="A" stroke={accent.from || "#3b82f6"} fill={accent.from || "#3b82f6"} fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, background: darkMode ? '#1e293b' : '#fff', border: 'none' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* OKRs */}
      <section>
        <p style={titleStyle}>OKRs — Objetivos e Resultados-Chave</p>
        <p style={subStyle}>Progresso em relação às metas estratégicas</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {okrs.map((obj: any, i: number) => (
            <OKRCard key={obj.id || i} obj={obj} idx={i} darkMode={darkMode} accent={accent} />
          ))}
        </div>
      </section>

      {/* Infográfico */}
      <section>
        <p style={titleStyle}>Infográfico OKR</p>
        <p style={subStyle}>Visualização comparativa de todos os objetivos</p>
        <OKRNightingaleChart dark={darkMode} accentGradient={accentGradient} />
      </section>

      <section className={sectionBg}>
        <p style={titleStyle}>Crescimento por Canal</p>
        <p style={subStyle}>Evolução de seguidores ao longo de 2026</p>
        <ChannelChart dark={darkMode} />
      </section>

      {selectedKPI && (
        <KPIModal kpi={selectedKPI} darkMode={darkMode} onClose={() => setSelectedKPI(null)} />
      )}
    </div>
  )
}
