import React from "react"
import { TrendingUp, ArrowUpRight } from "lucide-react"

interface KPICardProps {
  title: string
  value: string
  subtitle: string
  trend?: string
  trendLabel?: string
  darkMode?: boolean
}

export default function KPICard({ title, value, subtitle, trend, trendLabel, darkMode }: KPICardProps) {
  const cardBg = darkMode
    ? "bg-white/10 border-white/10 hover:bg-white/15"
    : "bg-white border-gray-100 hover:shadow-lg hover:border-gray-200"
  const titleColor = darkMode ? "text-white/50" : "text-gray-500"
  const valueColor = darkMode ? "text-white" : "text-gray-900"
  const subColor = darkMode ? "text-white/30" : "text-gray-400"
  const btnBg = darkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-50 group-hover:bg-blue-50"
  const btnIcon = darkMode ? "text-white/40 group-hover:text-blue-300" : "text-gray-400 group-hover:text-blue-600"

  return (
    <div className={`rounded-xl border p-5 transition-all duration-300 group ${cardBg}`}>
      <div className="flex items-start justify-between">
        <p className={`text-sm font-medium ${titleColor}`}>{title}</p>
        <button className={`p-1.5 rounded-lg transition-colors ${btnBg}`}>
          <ArrowUpRight size={14} className={btnIcon} />
        </button>
      </div>
      <p className={`text-3xl font-extrabold mt-2 tracking-tight ${valueColor}`}>{value}</p>
      <p className={`text-xs mt-1 ${subColor}`}>{subtitle}</p>
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp size={12} />
            {trend}
          </span>
          <span className={`text-xs ${subColor}`}>{trendLabel}</span>
        </div>
      )}
    </div>
  )
}
