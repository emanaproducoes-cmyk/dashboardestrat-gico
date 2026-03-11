import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Antes/Depois", value: 40, color: "#3b82f6" },
  { name: "Vídeos", value: 30, color: "#8b5cf6" },
  { name: "Reposts", value: 20, color: "#06b6d4" },
  { name: "Bastidores", value: 10, color: "#f59e0b" },
]

export default function ContentDistribution({ dark }: { dark?: boolean }) {
  return (
    <div className={dark ? "" : "bg-white rounded-xl border border-gray-100 p-6"}>
      <h3 className={`font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
        Distribuição de Conteúdo
      </h3>
      <p className={`text-xs mb-4 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
        Mix estratégico de tipos de conteúdo
      </p>
      <div className="flex items-center gap-6">
        <div className="w-40 h-40 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3 flex-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className={`text-sm ${dark ? 'text-white/70' : 'text-gray-600'}`}>{item.name}</span>
              </div>
              <span className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
