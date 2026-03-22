import React, { useState } from "react"
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar
} from "recharts"
import { X, Eye } from "lucide-react"
import { usePlanningData, Canal } from "../../lib/PlanningDataContext"

interface Props { dark?: boolean }

function DonutRing({ pct, color, size = 48 }: { pct: number; color: string; size?: number }) {
  const r = 20
  const circ = 2 * Math.PI * r
  const dash = (Math.min(pct, 100) / 100) * circ
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dasharray 0.8s ease" }} />
      <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>
        {pct}%
      </text>
    </svg>
  )
}

function MiniSparkline({ dados, color }: { dados: { mes: string; valor: number }[]; color: string }) {
  return (
    <ResponsiveContainer width="100%" height={32}>
      <ComposedChart data={dados.slice(-6)} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <Area type="monotone" dataKey="valor" stroke={color} fill={color + "18"} strokeWidth={1.5} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label, dark }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: dark ? "rgba(5,12,28,0.97)" : "rgba(255,255,255,0.99)",
      border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
      borderRadius: 12,
      padding: "10px 14px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.28)",
      minWidth: 160,
    }}>
      <p style={{
        color: dark ? "rgba(255,255,255,0.45)" : "#6b7280",
        fontSize: 10, fontWeight: 700,
        textTransform: "uppercase" as const,
        letterSpacing: "0.07em", marginBottom: 8
      }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < payload.length - 1 ? 5 : 0 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: p.color || p.stroke, flexShrink: 0 }} />
          <span style={{ color: dark ? "rgba(255,255,255,0.5)" : "#9ca3af", fontSize: 11, flex: 1 }}>{p.name}</span>
          <span style={{ color: dark ? "#ffffff" : "#111827", fontSize: 12, fontWeight: 800 }}>
            {p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChannelCard({ canal, dark, active, onToggle, onDetail }: {
  canal: Canal; dark: boolean; active: boolean; onToggle: () => void; onDetail: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const lastVal = canal.dados_mensais[canal.dados_mensais.length - 1]?.valor || 0
  const pct = canal.meta_anual > 0 ? Math.min(Math.round((lastVal / canal.meta_anual) * 100), 100) : 0

  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const inactiveBg = dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"

  return (
    <div
      className="rounded-2xl p-4 transition-all duration-250 flex-1 min-w-0"
      style={{
        background: active ? cardBg : inactiveBg,
        border: `1px solid ${active ? canal.cor + "45" : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)")}`,
        opacity: active ? 1 : 0.45,
        boxShadow: hovered && active ? `0 8px 28px ${canal.cor}18, 0 0 0 1px ${canal.cor}30` : "none",
        transform: hovered && active ? "translateY(-2px)" : "none",
        cursor: "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onToggle}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
            style={{ background: canal.cor }}>
            {canal.icone}
          </div>
          <div>
            <p className={`text-xs font-bold ${dark ? "text-white" : "text-gray-900"}`}>{canal.nome}</p>
            <p className={`text-[10px] ${dark ? "text-white/35" : "text-gray-400"}`}>{canal.tipo}</p>
          </div>
        </div>
        <DonutRing pct={pct} color={canal.cor} size={48} />
      </div>

      <div className="mb-2">
        <p className="text-xl font-extrabold" style={{ color: canal.cor }}>
          {lastVal.toLocaleString("pt-BR")}
          <span className="text-xs font-normal ml-1" style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>
            / {canal.meta_anual.toLocaleString("pt-BR")}
          </span>
        </p>
        <p className={`text-[10px] mt-0.5 ${dark ? "text-white/30" : "text-gray-400"}`}>
          Meta: {canal.meta_anual.toLocaleString("pt-BR")} {canal.unidade}
        </p>
      </div>

      <MiniSparkline dados={canal.dados_mensais} color={canal.cor} />

      <div className="mt-2 h-1 rounded-full overflow-hidden"
        style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: canal.cor }} />
      </div>

      <div
        className="mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
        style={{
          background: hovered ? canal.cor + "20" : "transparent",
          color: canal.cor,
          border: `1px solid ${hovered ? canal.cor + "40" : "transparent"}`
        }}
        onClick={e => { e.stopPropagation(); onDetail() }}
      >
        <Eye size={11} />
        Ver Detalhes
      </div>
    </div>
  )
}

function DetailModal({ canal, dark, onClose }: { canal: Canal; dark: boolean; onClose: () => void }) {
  const bg = dark ? "#0a1628" : "#ffffff"
  const lastVal = canal.dados_mensais[canal.dados_mensais.length - 1]?.valor || 0
  const pct = canal.meta_anual > 0 ? Math.min(Math.round((lastVal / canal.meta_anual) * 100), 100) : 0
  const total = canal.dados_mensais.reduce((s, m) => s + m.valor, 0)

  const quarterlyData = [
    { q: "Q1", valor: canal.dados_mensais.slice(0, 3).reduce((s, m) => s + m.valor, 0) },
    { q: "Q2", valor: canal.dados_mensais.slice(3, 6).reduce((s, m) => s + m.valor, 0) },
    { q: "Q3", valor: canal.dados_mensais.slice(6, 9).reduce((s, m) => s + m.valor, 0) },
    { q: "Q4", valor: canal.dados_mensais.slice(9, 12).reduce((s, m) => s + m.valor, 0) },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bg, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sticky top-0 z-10" style={{ background: bg, borderBottom: `1px solid ${canal.cor}25` }}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm"
                style={{ background: canal.cor }}>
                {canal.icone}
              </div>
              <div>
                <h2 className={`text-xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>{canal.nome}</h2>
                <p className={`text-xs mt-0.5 ${dark ? "text-white/45" : "text-gray-500"}`}>
                  {canal.tipo} · {canal.descricao}
                </p>
              </div>
            </div>
            <button onClick={onClose}
              className={`p-2 rounded-xl ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Último mês", value: lastVal.toLocaleString("pt-BR"), unit: canal.unidade, color: canal.cor },
              { label: "Total acumulado", value: total.toLocaleString("pt-BR"), unit: canal.unidade, color: dark ? "rgba(255,255,255,0.75)" : "#374151" },
              { label: "Progresso", value: `${pct}%`, unit: "", color: canal.cor },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-1 ${dark ? "text-white/38" : "text-gray-400"}`}>{s.label}</p>
                <p className="text-lg font-extrabold" style={{ color: s.color }}>
                  {s.value} <span className="text-xs font-normal">{s.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1.5"
              style={{ color: dark ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>
              <span>0</span>
              <span className="font-bold" style={{ color: canal.cor }}>{pct}% da meta anual</span>
              <span>{canal.meta_anual.toLocaleString("pt-BR")} {canal.unidade}</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden"
              style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full"
                style={{ width: `${pct}%`, background: `linear-gradient(90deg,${canal.cor}80,${canal.cor})` }} />
            </div>
          </div>

          {/* Evolução mensal */}
          <div>
            <p className={`text-xs font-bold mb-3 ${dark ? "text-white/55" : "text-gray-600"}`}>
              Evolução Mensal — {canal.unidade}
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={canal.dados_mensais} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3"
                  stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
                <XAxis dataKey="mes"
                  tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }}
                  axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={(p: any) => <CustomTooltip {...p} dark={dark} />} />
                {canal.meta_anual > 0 && (
                  <ReferenceLine y={canal.meta_anual} stroke={canal.cor}
                    strokeDasharray="5 4" strokeOpacity={0.4}
                    label={{ value: `Meta: ${canal.meta_anual}`, position: "right", fontSize: 10, fill: canal.cor }} />
                )}
                <Area type="monotone" dataKey="valor" name={canal.nome}
                  stroke={canal.cor} fill={canal.cor + "18"} strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: dark ? "#0a1628" : "#fff", fill: canal.cor }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown trimestral */}
          <div>
            <p className={`text-xs font-bold mb-3 ${dark ? "text-white/55" : "text-gray-600"}`}>
              Breakdown Trimestral
            </p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={quarterlyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} barSize={40}>
                <XAxis dataKey="q"
                  tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.4)" : "#9ca3af" }}
                  axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.4)" : "#9ca3af" }}
                  axisLine={false} tickLine={false} />
                <Tooltip content={(p: any) => <CustomTooltip {...p} dark={dark} />} />
                <Bar dataKey="valor" name={canal.nome} fill={canal.cor} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela mensal */}
          <div>
            <p className={`text-xs font-bold mb-3 ${dark ? "text-white/55" : "text-gray-600"}`}>
              Dados Mensais Completos
            </p>
            <div className="grid grid-cols-6 gap-1.5">
              {canal.dados_mensais.map((m, i) => (
                <div key={i} className="rounded-lg p-2 text-center"
                  style={{ background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                  <p className={`text-[9px] font-semibold mb-1 ${dark ? "text-white/35" : "text-gray-400"}`}>{m.mes}</p>
                  <p className="text-xs font-bold" style={{ color: canal.cor }}>{m.valor.toLocaleString("pt-BR")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChannelChart({ dark = true }: Props) {
  const { data: planningData } = usePlanningData()
  const canaisAtivos = planningData.canais.filter(c => c.ativo)

  const [activeMap, setActiveMap] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(canaisAtivos.map(c => [c.id, true]))
  )
  const [detail, setDetail] = useState<Canal | null>(null)

  // Sincroniza novos canais adicionados pelo admin
  const allActive = Object.fromEntries(
    canaisAtivos.map(c => [c.id, activeMap[c.id] !== undefined ? activeMap[c.id] : true])
  )

  // Monta dados para o gráfico principal mesclando todos os canais por mês
  const chartData = canaisAtivos[0]?.dados_mensais.map((_, mi) => {
    const ponto: Record<string, any> = {
      mes: canaisAtivos[0].dados_mensais[mi].mes
    }
    canaisAtivos.forEach(c => {
      ponto[c.nome] = c.dados_mensais[mi]?.valor || 0
    })
    return ponto
  }) || []

  const cardBg = dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  if (canaisAtivos.length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center"
        style={{ background: cardBg, border: `1px dashed ${cardBorder}` }}>
        <p className={`text-sm ${dark ? "text-white/40" : "text-gray-400"}`}>
          Nenhum canal ativo. Acesse <strong>Dev Mode → Canais</strong> para adicionar.
        </p>
      </div>
    )
  }

  // Agrupa cards por tipo
  const tipos = Array.from(new Set(canaisAtivos.map(c => c.tipo)))

  return (
    <div className="space-y-5">
      {/* Cards agrupados por tipo */}
      {tipos.map(tipo => (
        <div key={tipo}>
          <p className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${dark ? "text-white/30" : "text-gray-400"}`}>
            {tipo}
          </p>
          <div className="flex gap-3 flex-wrap">
            {canaisAtivos.filter(c => c.tipo === tipo).map(canal => (
              <ChannelCard
                key={canal.id}
                canal={canal}
                dark={dark}
                active={allActive[canal.id]}
                onToggle={() => setActiveMap(prev => ({ ...prev, [canal.id]: !allActive[canal.id] }))}
                onDetail={() => setDetail(canal)}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Gráfico principal */}
      <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <p className={`font-bold text-sm ${dark ? "text-white" : "text-gray-900"}`}>
              Evolução por Canal — 2026
            </p>
            <p className={`text-[11px] mt-0.5 ${dark ? "text-white/35" : "text-gray-400"}`}>
              Clique nos cards para ocultar/exibir · "Ver Detalhes" para análise completa
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {canaisAtivos.map(c => (
              <div key={c.id}
                className="flex items-center gap-1.5 cursor-pointer transition-opacity"
                style={{ opacity: allActive[c.id] ? 1 : 0.3 }}
                onClick={() => setActiveMap(prev => ({ ...prev, [c.id]: !allActive[c.id] }))}>
                <div style={{ width: 20, height: 3, borderRadius: 2, background: c.cor }} />
                <span className={`text-[11px] font-medium ${dark ? "text-white/55" : "text-gray-500"}`}>{c.nome}</span>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3"
              stroke={dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
            <XAxis dataKey="mes"
              tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }}
              axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.38)" : "#9ca3af" }}
              axisLine={false} tickLine={false} />
            <Tooltip content={(p: any) => <CustomTooltip {...p} dark={dark} />} />

            {canaisAtivos.map(c => allActive[c.id] && (
              <Area key={c.id} type="monotone" dataKey={c.nome}
                stroke={c.cor} fill={c.cor + "14"} strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2, stroke: dark ? "#070f1f" : "#ffffff", fill: c.cor }} />
            ))}

            {canaisAtivos.map(c => allActive[c.id] && c.meta_anual > 0 && (
              <ReferenceLine key={`ref-${c.id}`} y={c.meta_anual}
                stroke={c.cor} strokeDasharray="5 4" strokeOpacity={0.28} />
            ))}
          </ComposedChart>
        </ResponsiveContainer>

        <p className={`text-center text-[10px] mt-3 ${dark ? "text-white/22" : "text-gray-300"}`}>
          Linhas tracejadas = metas anuais por canal
        </p>
      </div>

      {detail && <DetailModal canal={detail} dark={dark} onClose={() => setDetail(null)} />}
    </div>
  )
}
