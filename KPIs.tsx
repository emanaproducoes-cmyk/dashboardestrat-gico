import React from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts"
import { X, Award, Radio, Users, Target } from "lucide-react"

type ChartDataItem = Record<string, number | string>

interface PillarMetric {
  label: string
  value: number
  meta: number
}

interface ChartConfig {
  type: "bar" | "line" | "pie"
  data: ChartDataItem[]
}

interface PillarInfo {
  title: string
  icon: React.ComponentType<{ size?: number }>
  gradient: string
  accentColor: string
  description: string
  metrics: PillarMetric[]
  chart: ChartConfig
}

// BUG FIX: typed as Record with explicit keys for safe index access
const pillarData: Record<string, PillarInfo> = {
  autoridade: {
    title: "Autoridade Digital",
    icon: Award,
    gradient: "from-violet-600 to-purple-800",
    accentColor: "#8b5cf6",
    description: "Construção de posicionamento como referência em FNO e projetos econômicos na Amazônia.",
    metrics: [
      { label: "Blog posts publicados", value: 4, meta: 12 },
      { label: "LinkedIn articles", value: 6, meta: 24 },
      { label: "YouTube vídeos", value: 3, meta: 24 },
      { label: "Menções externas", value: 2, meta: 8 },
    ],
    chart: {
      type: "bar",
      data: [
        { month: "Mar", real: 0, meta: 3 },
        { month: "Abr", real: 1, meta: 3 },
        { month: "Mai", real: 3, meta: 3 },
        { month: "Jun", real: 6, meta: 3 },
        { month: "Jul", real: 8, meta: 3 },
        { month: "Ago", real: 10, meta: 3 },
      ]
    }
  },
  multichannel: {
    title: "Estratégia Multichannel",
    icon: Radio,
    gradient: "from-blue-600 to-cyan-700",
    accentColor: "#3b82f6",
    description: "Distribuição de conteúdo estratégico em LinkedIn, YouTube, Instagram e Blog.",
    metrics: [
      { label: "Posts LinkedIn", value: 28, meta: 96 },
      { label: "Vídeos YouTube", value: 5, meta: 24 },
      { label: "Posts Instagram", value: 42, meta: 120 },
      { label: "Posts Blog", value: 2, meta: 12 },
    ],
    chart: {
      type: "line",
      data: [
        { month: "Jan", LI: 0, YT: 0, IG: 0 },
        { month: "Fev", LI: 4, YT: 1, IG: 8 },
        { month: "Mar", LI: 8, YT: 2, IG: 18 },
        { month: "Abr", LI: 12, YT: 3, IG: 26 },
        { month: "Mai", LI: 18, YT: 4, IG: 34 },
        { month: "Jun", LI: 28, YT: 5, IG: 42 },
      ]
    }
  },
  provasSocial: {
    title: "Prova Social",
    icon: Users,
    gradient: "from-rose-600 to-pink-800",
    accentColor: "#f43f5e",
    description: "Captação e publicação de cases de sucesso para construção de credibilidade.",
    metrics: [
      { label: "Cases coletados", value: 1, meta: 4 },
      { label: "Cases publicados", value: 0, meta: 4 },
      { label: "Depoimentos em vídeo", value: 0, meta: 3 },
      { label: "Projetos documentados", value: 2, meta: 6 },
    ],
    chart: {
      type: "pie",
      data: [
        { name: "Coletados", value: 1, color: "#f43f5e" },
        { name: "Em preparo", value: 1, color: "#fb7185" },
        { name: "Pendentes", value: 2, color: "#fecdd3" },
      ]
    }
  },
  posicionamento: {
    title: "Posicionamento",
    icon: Target,
    gradient: "from-amber-500 to-orange-700",
    accentColor: "#f59e0b",
    description: "Solidificação da marca AF como especialista em FNO e consultoria estratégica.",
    metrics: [
      { label: "Compartilhamentos", value: 34, meta: 120 },
      { label: "Menções positivas", value: 12, meta: 50 },
      { label: "Novos seguidores", value: 156, meta: 700 },
      { label: "Leads gerados", value: 8, meta: 32 },
    ],
    chart: {
      type: "bar",
      data: [
        { month: "Jan", real: 0, meta: 10 },
        { month: "Fev", real: 2, meta: 10 },
        { month: "Mar", real: 5, meta: 10 },
        { month: "Abr", real: 9, meta: 10 },
        { month: "Mai", real: 12, meta: 10 },
        { month: "Jun", real: 8, meta: 10 },
      ]
    }
  }
}

// BUG FIX: typed chart sub-component props
function BarChartContent({ data, color }: { data: ChartDataItem[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
        <Bar dataKey="meta" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
        <Bar dataKey="real" fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function LineChartContent({ data }: { data: ChartDataItem[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
        <Line type="monotone" dataKey="LI" stroke="#3b82f6" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="YT" stroke="#ef4444" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="IG" stroke="#ec4899" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function PieChartContent({ data }: { data: ChartDataItem[] }) {
  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" paddingAngle={3}>
            {data.map((d, i) => <Cell key={i} fill={d.color as string} />)}
          </Pie>
          <Tooltip formatter={(v) => `${v} cases`} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color as string }} />
            <span className="text-gray-600">{d.name as string}</span>
            <span className="font-bold text-gray-900 ml-auto">{d.value as number}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface Props {
  pillar: string | null
  onClose: () => void
}

export default function PillarModal({ pillar, onClose }: Props) {
  // BUG FIX: type-safe lookup with explicit guard
  if (!pillar || !(pillar in pillarData)) return null
  const p = pillarData[pillar]
  const Icon = p.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className={`bg-gradient-to-r ${p.gradient} p-6 rounded-t-2xl text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Icon size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">{p.title}</h2>
                <p className="text-sm text-white/70 mt-0.5">Pilar Estratégico 2026</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-white/80 mt-4">{p.description}</p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-3">Métricas Chave</h3>
            <div className="grid grid-cols-2 gap-3">
              {p.metrics.map((m, i) => {
                const pct = Math.round((m.value / m.meta) * 100)
                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-extrabold text-gray-900">{m.value}</span>
                      <span className="text-xs text-gray-400">/ {m.meta}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: p.accentColor }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{pct}% da meta</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-3">Evolução Mensal</h3>
            <div className="bg-gray-50 rounded-xl p-4">
              {p.chart.type === "bar" && <BarChartContent data={p.chart.data} color={p.accentColor} />}
              {p.chart.type === "line" && <LineChartContent data={p.chart.data} />}
              {p.chart.type === "pie" && <PieChartContent data={p.chart.data} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
