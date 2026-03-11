import React from "react"
import { X } from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"

type ChartDataItem = Record<string, number | string>

interface KPI {
  label: string
  value: string
  delta?: string
}

interface ChartConfig {
  type: "area" | "bar" | "pie" | "gantt"
  data: ChartDataItem[]
  colors?: string[]
}

interface Section {
  title: string
  subtitle?: string
  description?: string
  icon?: React.ReactNode
  gradient?: string
  kpis?: KPI[]
  chart?: ChartConfig
  chartTitle?: string
  bullets?: string[]
  bulletsTitle?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  section: Section
}

export default function SectionDetailModal({ isOpen, onClose, section }: Props) {
  if (!isOpen || !section) return null

  const renderChart = () => {
    if (!section.chart) return null
    const { type, data, colors = ["#3b82f6", "#8b5cf6", "#ec4899"] } = section.chart

    if (type === "area") {
      const keys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== "month" && k !== "label") : []
      return (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data}>
            <defs>
              {keys.map((k, i) => (
                <linearGradient key={k} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[i % colors.length]} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={colors[i % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            {keys.map((k, i) => (
              <Area
                key={k} type="monotone" dataKey={k}
                stroke={colors[i % colors.length]}
                fill={`url(#grad${i})`} strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      )
    }

    if (type === "bar") {
      const keys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== "month" && k !== "label") : []
      const xKey = data[0]?.month !== undefined ? "month" : "label"
      return (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
            {keys.map((k, i) => (
              <Bar key={k} dataKey={k} fill={colors[i % colors.length]} radius={[4, 4, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )
    }

    if (type === "pie") {
      return (
        <div className="flex items-center gap-6 flex-wrap">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                {data.map((d, i) => <Cell key={i} fill={(d.color as string) || colors[i % colors.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 flex-1 min-w-[120px]">
            {data.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: (d.color as string) || colors[i % colors.length] }} />
                  <span className="text-gray-600 text-xs">{d.name as string}</span>
                </div>
                <span className="font-bold text-gray-900 text-xs">{d.value as number}{d.unit as string || ""}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (type === "gantt") {
      return (
        <div className="space-y-2">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-28 flex-shrink-0 truncate">{item.label as string}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 relative overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{
                    marginLeft: `${(item.start as number) || 0}%`,
                    width: `${(item.width as number) || 50}%`,
                    backgroundColor: colors[i % colors.length]
                  }}
                >
                  <span className="text-white text-[9px] font-bold">{item.status as string}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {section.icon && (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: section.gradient || "linear-gradient(135deg,#3b82f6,#8b5cf6)" }}
              >
                {section.icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
              {section.subtitle && <p className="text-sm text-gray-500 mt-0.5">{section.subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {section.description && (
            <p className="text-sm text-gray-600 leading-relaxed">{section.description}</p>
          )}

          {section.kpis && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {section.kpis.map((kpi, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
                  {kpi.delta && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      {kpi.delta}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {section.chart && (
            <div>
              {section.chartTitle && <h3 className="font-bold text-gray-900 mb-3">{section.chartTitle}</h3>}
              <div className="bg-gray-50 rounded-xl p-4">
                {renderChart()}
              </div>
            </div>
          )}

          {section.bullets && (
            <div>
              {section.bulletsTitle && <h3 className="font-bold text-gray-900 mb-3">{section.bulletsTitle}</h3>}
              <ul className="space-y-2">
                {section.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
