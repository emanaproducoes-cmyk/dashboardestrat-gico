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
import { TrendingUp, TrendingDown, Minus, ChevronRight, X, Target, BarChart2, Zap } from "lucide-react"

const PERSP_COLORS: Record<string, string> = {
  "Financeira": "#22c55e",
  "Clientes": "#3b82f6",
  "Processos Internos": "#f59e0b",
  "Aprendizado & Crescimento": "#8b5cf6",
  "Inovação": "#ec4899",
}

function MiniSparkline({ color, darkMode }: { color: string; darkMode: boolean }) {
  const data = Array.from({ length: 8 }, (_, i) => ({
    v: Math.round(20 + Math.random() * 60 + i * 5)
  }))
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function KPIMetricCard({ kpi, darkMode, accent, onClick }: {
  kpi: any, darkMode: boolean, accent: any, onClick: () => void
}) {
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const color = PERSP_COLORS[kpi.perspectiva] || accent?.from || "#3b82f6"

  const baselineNum = parseFloat(kpi.baseline) || 0
  const metaNum = parseFloat(kpi.meta) || 100
  const progress = metaNum > 0 ? Math.min(Math.round((baselineNum / metaNum) * 100), 100) : 0

  return (
    <div
      onClick={onClick}
      className="rounded-2xl p-5 cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: color + "20", color }}>
              {kpi.perspectiva}
            </span>
          </div>
          <p className={`text-sm font-semibold leading-tight truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {kpi.indicador || "KPI sem nome"}
          </p>
          <p className={`text-xs mt-0.5 truncate ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>
            {kpi.formula || kpi.frequencia}
          </p>
        </div>
        <ChevronRight size={14} className={`flex-shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 ${darkMode ? 'text-white/20' : 'text-gray-300'}`} />
      </div>

      {/* Values */}
      <div className="flex items-end gap-3 mb-3">
        <div>
          <p className={`text-[10px] mb-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Atual</p>
          <p className="text-2xl font-extrabold" style={{ color }}>
            {kpi.baseline || "—"}
            {kpi.unidade && <span className="text-sm font-normal ml-1">{kpi.unidade}</span>}
          </p>
        </div>
        <div className={`text-xs mb-1 ${darkMode ? 'text-white/30' : 'text-gray-300'}`}>→</div>
        <div>
          <p className={`text-[10px] mb-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Meta</p>
          <p className={`text-lg font-bold ${darkMode ? 'text-white/60' : 'text-gray-500'}`}>
            {kpi.meta || "—"}
            {kpi.unidade && <span className="text-sm font-normal ml-1">{kpi.unidade}</span>}
          </p>
        </div>
        <div className="flex-1" />
        <div className="text-right">
          <p className={`text-[10px] mb-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>Progresso</p>
          <p className="text-lg font-extrabold" style={{ color }}>{progress}%</p>
        </div>
      </div>

      {/* Sparkline */}
      <MiniSparkline color={color} darkMode={darkMode} />

      {/* Progress bar */}
      <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-[10px] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>{kpi.responsavel || "Sem responsável"}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${darkMode ? 'bg-white/05 text-white/40' : 'bg-gray-100 text-gray-400'}`}>{kpi.status}</span>
      </div>
    </div>
  )
}

function OKRProgressCard({ obj, idx, darkMode, accent }: { obj: any, idx: number, darkMode: boolean, accent: any }) {
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const colors = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ec4899"]
  const color = colors[idx % colors.length]

  const avgProgress = obj.keyResults?.length > 0
    ? Math.round(obj.keyResults.reduce((sum: number, kr: any) => sum + (kr.percentual || 0), 0) / obj.keyResults.length)
    : 0

  return (
    <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
          style={{ background: color }}>
          O{idx + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {obj.titulo || "Objetivo sem título"}
          </p>
          <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{obj.pilar}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-2xl font-extrabold" style={{ color }}>{avgProgress}%</p>
          <p className={`text-[10px] ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>concluído</p>
        </div>
      </div>

      {/* Circular progress */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3"
              strokeDasharray={`${avgProgress} 100`} strokeLinecap="round" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{avgProgress}%</span>
        </div>
        <div className="flex-1 space-y-1.5">
          {obj.keyResults?.slice(0, 3).map((kr: any, ki: number) => (
            <div key={ki}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-[10px] truncate ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>
                  KR{ki + 1} {kr.descricao?.slice(0, 25) || ""}
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

function KPIDetailModal({ kpi, darkMode, onClose }: { kpi: any, darkMode: boolean, onClose: () => void }) {
  const color = PERSP_COLORS[kpi.perspectiva] || "#3b82f6"
  const baselineNum = parseFloat(kpi.baseline) || 0
  const metaNum = parseFloat(kpi.meta) || 100
  const progress = metaNum > 0 ? Math.min(Math.round((baselineNum / metaNum) * 100), 100) : 0

  const chartData = [
    { name: "Atual", value: baselineNum, fill: color },
    { name: "Meta", value: metaNum, fill: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: darkMode ? "#0a1628" : "#fff" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6" style={{ background: `linear-gradient(135deg, ${color}20, ${color}05)`, borderBottom: `1px solid ${color}20` }}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full mb-2 inline-block"
                style={{ background: color + "20", color }}>
                {kpi.perspectiva}
              </span>
              <h2 className={`text-xl font-extrabold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {kpi.indicador || "KPI"}
              </h2>
              <p className={`text-sm mt-1 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>{kpi.formula}</p>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Big number */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Baseline atual", value: `${kpi.baseline || "—"}${kpi.unidade ? ` ${kpi.unidade}` : ""}`, color },
              { label: "Meta", value: `${kpi.meta || "—"}${kpi.unidade ? ` ${kpi.unidade}` : ""}`, color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280" },
              { label: "Progresso", value: `${progress}%`, color },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-1 ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{s.label}</p>
                <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Progress visual */}
          <div>
            <div className="flex justify-between text-xs mb-2" style={{ color: darkMode ? "rgba(255,255,255,0.4)" : "#9ca3af" }}>
              <span>0</span>
              <span>{progress}% atingido</span>
              <span>{kpi.meta}{kpi.unidade}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }} />
            </div>
          </div>

          {/* Bar chart */}
          <div>
            <p className={`text-xs font-semibold mb-3 ${darkMode ? 'text-white/50' : 'text-gray-500'}`}>Comparativo Atual vs Meta</p>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={chartData} barSize={48}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: darkMode ? 'rgba(255,255,255,0.4)' : '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12, background: darkMode ? '#1e293b' : '#fff', border: 'none' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Meta info */}
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
  const { fontSettings } = useFontSettings()
  const { data: planningData } = usePlanningData()
  const [selectedKPI, setSelectedKPI] = useState<any | null>(null)
  const [filterPersp, setFilterPersp] = useState("Todas")

  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }
  const bg = darkMode ? "min-h-screen p-6 md:p-8 space-y-8" : "min-h-screen p-6 md:p-8 space-y-8"
  const sectionBg = darkMode ? "rounded-2xl bg-white/4 border border-white/08 p-6" : "rounded-2xl bg-white/80 border border-black/06 p-6 shadow-sm"

  const titleStyle = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 700,
    marginBottom: "4px",
  }
  const subStyle = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: "20px",
  }

  const kpis = planningData.kpis.filter(k => k.indicador)
  const objetivos = planningData.objetivos.filter(o => o.titulo)
  const perspectivas = ["Todas", ...Array.from(new Set(kpis.map(k => k.perspectiva)))]

  const filteredKPIs = filterPersp === "Todas" ? kpis : kpis.filter(k => k.perspectiva === filterPersp)

  // Radar data from OKRs
  const radarData = objetivos.slice(0, 6).map(obj => ({
    subject: obj.titulo?.slice(0, 20) || "OKR",
    A: obj.keyResults?.length > 0
      ? Math.round(obj.keyResults.reduce((s: number, kr: any) => s + (kr.percentual || 0), 0) / obj.keyResults.length)
      : 0,
  }))

  // Summary stats
  const avgProgress = kpis.length > 0
    ? Math.round(kpis.reduce((sum, k) => {
        const b = parseFloat(k.baseline) || 0
        const m = parseFloat(k.meta) || 100
        return sum + Math.min((b / m) * 100, 100)
      }, 0) / kpis.length)
    : 0

  const onTrack = kpis.filter(k => {
    const b = parseFloat(k.baseline) || 0
    const m = parseFloat(k.meta) || 100
    return m > 0 && (b / m) >= 0.5
  }).length

  const perspData = Array.from(new Set(kpis.map(k => k.perspectiva))).map(p => ({
    name: p.length > 12 ? p.slice(0, 12) + "…" : p,
    count: kpis.filter(k => k.perspectiva === p).length,
    avg: kpis.filter(k => k.perspectiva === p).length > 0
      ? Math.round(kpis.filter(k => k.perspectiva === p).reduce((s, k) => {
          const b = parseFloat(k.baseline) || 0
          const m = parseFloat(k.meta) || 100
          return s + Math.min((b / m) * 100, 100)
        }, 0) / kpis.filter(k => k.perspectiva === p).length)
      : 0,
    color: PERSP_COLORS[p] || "#6b7280"
  }))

  const hasKPIs = kpis.length > 0
  const hasOKRs = objetivos.length > 0

  return (
    <div className={bg}>
      <HeroHeader accentGradient={accentGradient} />

      {/* Summary strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "KPIs Cadastrados", value: kpis.length, icon: BarChart2, color: accent.from || "#3b82f6" },
          { label: "Progresso Médio", value: `${avgProgress}%`, icon: TrendingUp, color: "#22c55e" },
          { label: "No Caminho Certo", value: onTrack, icon: Target, color: "#f59e0b" },
          { label: "OKRs Ativos", value: objetivos.length, icon: Zap, color: "#8b5cf6" },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
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

      {/* KPIs Section */}
      <section>
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p style={titleStyle}>Indicadores-Chave de Performance</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>
              {hasKPIs ? `${kpis.length} KPIs cadastrados no Dev Mode` : "Adicione KPIs no Dev Mode para visualizá-los aqui"}
            </p>
          </div>
          {hasKPIs && (
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
          )}
        </div>

        {hasKPIs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredKPIs.map((kpi, i) => (
              <KPIMetricCard key={i} kpi={kpi} darkMode={darkMode} accent={accent} onClick={() => setSelectedKPI(kpi)} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}` }}>
            <BarChart2 size={32} className="mx-auto mb-3 opacity-30" style={{ color: accent.from }} />
            <p className={`font-semibold ${darkMode ? 'text-white/50' : 'text-gray-400'}`}>Nenhum KPI cadastrado ainda</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-white/30' : 'text-gray-300'}`}>Acesse Dev Mode → KPIs para adicionar seus indicadores</p>
          </div>
        )}
      </section>

      {/* Perspectiva overview + Radar */}
      {hasKPIs && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Por perspectiva */}
          <div className={sectionBg}>
            <p className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Performance por Perspectiva</p>
            <div className="space-y-3">
              {perspData.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>{p.name}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${darkMode ? 'text-white/40' : 'text-gray-400'}`}>{p.count} KPI{p.count !== 1 ? 's' : ''}</span>
                      <span className="text-sm font-bold" style={{ color: p.color }}>{p.avg}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${p.avg}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Radar de OKRs */}
          {hasOKRs && radarData.length >= 3 && (
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
      )}

      {/* OKRs Section */}
      {hasOKRs && (
        <section>
          <p style={titleStyle}>OKRs — Objetivos e Resultados-Chave</p>
          <p style={subStyle}>Progresso em relação às metas estratégicas</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {objetivos.map((obj, i) => (
              <OKRProgressCard key={i} obj={obj} idx={i} darkMode={darkMode} accent={accent} />
            ))}
          </div>
        </section>
      )}

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
        <KPIDetailModal kpi={selectedKPI} darkMode={darkMode} onClose={() => setSelectedKPI(null)} />
      )}
    </div>
  )
}
