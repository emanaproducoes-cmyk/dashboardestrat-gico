// ChannelChart.jsx
import React from "react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"

const data = [
  { month: "Jan", Instagram: 0, LinkedIn: 0, YouTube: 0 },
  { month: "Fev", Instagram: 15, LinkedIn: 20, YouTube: 12 },
  { month: "Mar", Instagram: 35, LinkedIn: 50, YouTube: 30 },
  { month: "Abr", Instagram: 55, LinkedIn: 80, YouTube: 50 },
  { month: "Mai", Instagram: 70, LinkedIn: 120, YouTube: 80 },
  { month: "Jun", Instagram: 80, LinkedIn: 150, YouTube: 100 },
  { month: "Jul", Instagram: 87, LinkedIn: 170, YouTube: 180 },
  { month: "Ago", Instagram: 95, LinkedIn: 200, YouTube: 350 },
]

export default function ChannelChart({ dark }: { dark?: boolean }) {
  const tickColor = dark ? 'rgba(255,255,255,0.4)' : '#94a3b8'
  return (
    <div className={dark ? "" : "bg-white rounded-xl border border-gray-100 p-6"}>
      {!dark && <h3 className="font-bold text-gray-900 mb-1">Evolução de Seguidores</h3>}
      {!dark && <p className="text-xs text-gray-400 mb-6">Trajetória de crescimento multicanal ao longo do tempo</p>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradInsta" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradLinkedin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradYoutube" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tickColor }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: tickColor }} />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              fontSize: 12,
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Area type="monotone" dataKey="Instagram" stroke="#ec4899" fill="url(#gradInsta)" strokeWidth={2} />
          <Area type="monotone" dataKey="LinkedIn" stroke="#3b82f6" fill="url(#gradLinkedin)" strokeWidth={2} />
          <Area type="monotone" dataKey="YouTube" stroke="#ef4444" fill="url(#gradYoutube)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
