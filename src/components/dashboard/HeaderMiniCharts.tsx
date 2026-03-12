import React, { useState } from "react"
import { AreaChart, Area, ResponsiveContainer, Tooltip, BarChart, Bar, Cell } from "recharts"
import { CheckCircle2, Clock, Circle, TrendingUp } from "lucide-react"

const acoesPorMes = [
  { mes: "Abr", acoes: 4, concluidas: 4, label: "Abril" },
  { mes: "Mai", acoes: 4, concluidas: 3, label: "Maio" },
  { mes: "Jun/Jul", acoes: 4, concluidas: 2, label: "Jun/Jul" },
  { mes: "Ago/Out", acoes: 4, concluidas: 1, label: "Ago–Out" },
  { mes: "Nov/Dez", acoes: 4, concluidas: 0, label: "Nov/Dez" },
]

const execucaoPorCanal = [
  { canal: "LinkedIn", planejado: 8, executado: 5 },
  { canal: "YouTube", planejado: 6, executado: 3 },
  { canal: "Instagram", planejado: 7, executado: 4 },
  { canal: "Blog/SEO", planejado: 4, executado: 1 },
]

const progressoCumulativo = [
  { mes: "Abr", total: 4 },
  { mes: "Mai", total: 8 },
  { mes: "Jun", total: 12 },
  { mes: "Jul", total: 13 },
  { mes: "Ago", total: 15 },
  { mes: "Set", total: 16 },
  { mes: "Out", total: 17 },
  { mes: "Nov", total: 19 },
  { mes: "Dez", total: 20 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-xs text-white shadow-xl pointer-events-none">
      <p className="font-semibold mb-1 text-white/80">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || "#fff" }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

export default function HeaderMiniCharts() {
  const totalAcoes = 20
  const concluidasGeral = acoesPorMes.reduce((a, m) => a + m.concluidas, 0)
  const pctConcluido = Math.round((concluidasGeral / totalAcoes) * 100)

  return (
    <div className="relative grid grid-cols-3 gap-3 mt-5">

      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Execução Anual</p>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/20 rounded-full px-2 py-0.5">{pctConcluido}%</span>
        </div>
        <p className="text-lg font-extrabold text-white leading-tight">{concluidasGeral}<span className="text-white/40 text-sm font-medium">/{totalAcoes} ações</span></p>
        <div className="mt-2 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={progressoCumulativo} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                name="Ações acumuladas"
                stroke="#60a5fa"
                strokeWidth={2}
                fill="url(#execGrad)"
                dot={false}
                activeDot={{ r: 3, fill: "#60a5fa", stroke: "#fff", strokeWidth: 1 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-violet-400 transition-all" style={{ width: `${pctConcluido}%` }} />
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Ações por Período</p>
          <TrendingUp size={12} className="text-blue-300" />
        </div>
        <div className="space-y-1.5">
          {acoesPorMes.map((m, i) => {
            const pct = (m.concluidas / m.acoes) * 100
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[9px] text-white/50 w-11 flex-shrink-0 font-medium">{m.mes}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: pct === 100 ? '#34d399' : pct >= 50 ? '#60a5fa' : pct > 0 ? '#a78bfa' : 'transparent'
                    }}
                  />
                </div>
                <span className="text-[9px] font-bold text-white/70 w-6 text-right flex-shrink-0">{m.concluidas}/{m.acoes}</span>
                <span className="flex-shrink-0">
                  {pct === 100
                    ? <CheckCircle2 size={10} className="text-emerald-400" />
                    : pct > 0
                      ? <Clock size={10} className="text-blue-400" />
                      : <Circle size={10} className="text-white/20" />
                  }
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl p-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Ações por Canal</p>
          <span className="text-[10px] text-white/40">planejado vs executado</span>
        </div>
        <div className="h-[72px] mt-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={execucaoPorCanal} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} barCategoryGap="20%">
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="planejado" name="Planejado" fill="rgba(255,255,255,0.15)" radius={[3,3,0,0]} />
              <Bar dataKey="executado" name="Executado" radius={[3,3,0,0]}>
                {execucaoPorCanal.map((_, i) => (
                  <Cell key={i} fill={['#60a5fa','#f87171','#a78bfa','#fbbf24'][i]} fillOpacity={0.9} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-3 mt-1 flex-wrap">
          {execucaoPorCanal.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ['#60a5fa','#f87171','#a78bfa','#fbbf24'][i] }} />
              <span className="text-[9px] text-white/50">{c.canal}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
