import React from "react"

interface Metric {
  label: string
  target: string
  progress: number
  detail: string
}

interface OKRCardProps {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
  metrics: Metric[]
  darkMode?: boolean
}

export default function OKRCard({ icon, iconBg, title, description, metrics, darkMode }: OKRCardProps) {
  const cardBg = darkMode
    ? "bg-white/10 border-white/10 hover:bg-white/15"
    : "bg-white border-gray-100 hover:shadow-lg"
  const titleColor = darkMode ? "text-white" : "text-gray-900"
  const descColor = darkMode ? "text-white/50" : "text-gray-500"
  const labelColor = darkMode ? "text-white/60" : "text-gray-600"
  const targetColor = darkMode ? "text-blue-300" : "text-blue-600"
  const progressBg = darkMode ? "bg-white/10" : "bg-gray-100"
  const detailColor = darkMode ? "text-white/30" : "text-gray-400"

  return (
    <div className={`rounded-xl border p-6 transition-all duration-300 ${cardBg}`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${darkMode ? 'bg-white/10' : iconBg} flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-bold ${titleColor}`}>{title}</h3>
          <p className={`text-sm mt-1 ${descColor}`}>{description}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">
        {metrics.map((m, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${labelColor}`}>{m.label}</span>
              <span className={`text-xs font-bold ${targetColor}`}>{m.target}</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${progressBg}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
                style={{ width: `${m.progress}%` }}
              />
            </div>
            <p className={`text-[10px] mt-1 ${detailColor}`}>{m.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
