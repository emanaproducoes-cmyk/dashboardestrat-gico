import React, { useState } from "react"
import { X, ArrowRight } from "lucide-react"

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
  const [open, setOpen] = useState(false)

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
    <>
      <div className={`rounded-xl border p-6 transition-all duration-300 cursor-pointer group ${cardBg}`} onClick={() => setOpen(true)}>
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
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700" style={{ width: `${m.progress}%` }} />
              </div>
              <p className={`text-[10px] mt-1 ${detailColor}`}>{m.detail}</p>
            </div>
          ))}
        </div>
        <div className={`flex items-center gap-1 text-xs mt-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
          Ver detalhes <ArrowRight size={12} />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg}`}>{icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{description}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-5">
              {metrics.map((m, i) => {
                const pct = m.progress
                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 text-sm">{m.label}</span>
                      <span className="text-blue-600 font-bold text-sm">{m.target}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm font-bold text-gray-700 w-10 text-right">{pct}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{m.detail}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${pct >= 50 ? 'bg-emerald-100 text-emerald-700' : pct > 0 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                        {pct >= 50 ? '✓ No prazo' : pct > 0 ? '⚡ Em andamento' : '⏳ Aguardando início'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
