import React, { useState, useEffect } from "react"
import { Sparkles, Clock } from "lucide-react"
import HeaderMiniCharts from "./HeaderMiniCharts"

const stats = [
  { value: "200", label: "Meta Anual LinkedIn" },
  { value: "500", label: "Meta Anual YouTube" },
  { value: "70-105", label: "Conversão Instagram" },
  { value: "3-4", label: "Cases de Sucesso" },
]

export default function HeroHeader() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-violet-700 p-8 text-white">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-400/30 blur-3xl" />
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-blue-200" />
              <span className="text-xs font-medium text-blue-200 tracking-wider uppercase">
                Inteligência Estratégica de Marketing
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-blue-200" />
              <span className="text-xs font-medium text-blue-200 tracking-wider uppercase">
                Inteligência Estratégica de Marketing
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">AF Consultoria & Projetos</h1>
            <p className="text-sm text-blue-100 mt-1 max-w-xl">
              Centro de Inteligência de Marketing Estratégico 2026
            </p>
            <p className="text-xs text-blue-200/70 mt-1 max-w-lg hidden md:block">
              Análise em tempo real e insights estratégicos para decisões de marketing baseadas em dados. Monitore KPIs, acompanhe performance e otimize sua estratégia multicanal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
          <Clock size={14} className="text-blue-200" />
          <div className="text-right">
            <p className="text-xs text-blue-200">Última atualização</p>
            <p className="text-lg font-bold leading-tight">{time}</p>
            <p className="text-xs text-blue-200">{date}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap gap-6 md:gap-0 md:divide-x divide-white/20">
        {stats.map((s, i) => (
          <div key={i} className="md:flex-1 md:text-center px-4 first:pl-0">
            <p className="text-3xl md:text-4xl font-extrabold tracking-tight">{s.value}</p>
            <p className="text-xs text-blue-200 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <HeaderMiniCharts />
    </div>
  )
}
