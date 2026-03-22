import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import { useFontSettings } from "../lib/FontSettingsContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, LineChart, Line, Area, AreaChart, PieChart, Pie, Cell,
  ComposedChart
} from "recharts"
import {
  AlertTriangle, Lightbulb, TrendingUp, CheckCircle2,
  X, Shield, DollarSign, TrendingDown, Eye, ChevronUp, ChevronDown
} from "lucide-react"

const MESES = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"]

// ─── CUSTOM TOOLTIP ──────────────────────────────
function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: darkMode ? "rgba(5,12,28,0.97)" : "rgba(255,255,255,0.99)",
      border: `1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.28)", minWidth: 160,
    }}>
      <p style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "#6b7280", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 8 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < payload.length - 1 ? 5 : 0 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "#9ca3af", fontSize: 11, flex: 1 }}>{p.name}</span>
          <span style={{ color: darkMode ? "#ffffff" : "#111827", fontSize: 12, fontWeight: 800 }}>
            {typeof p.value === "number" ? p.value.toLocaleString("pt-BR") : p.value}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── RISCO CARD ──────────────────────────────────
function RiscoCard({ risco, darkMode, accent, onClick }: { risco: any; darkMode: boolean; accent: any; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  const score = (risco.probabilidade || 1) * (risco.impacto || 1)
  const nivel = score >= 16 ? { label: "Crítico", color: "#8b5cf6" }
              : score >= 9  ? { label: "Alto",    color: "#ef4444" }
              : score >= 4  ? { label: "Médio",   color: "#f59e0b" }
              :               { label: "Baixo",   color: "#22c55e" }

  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"

  return (
    <div
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{
        background: cardBg,
        border: `1px solid ${hovered ? nivel.color + "40" : (darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)")}`,
        boxShadow: hovered ? `0 8px 28px ${nivel.color}12` : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className={`text-sm font-bold leading-tight flex-1 ${darkMode ? "text-white" : "text-gray-900"}`}>
          {risco.risco || risco.title || "Risco sem título"}
        </p>
        <span className="text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0"
          style={{ background: nivel.color + "18", color: nivel.color }}>
          {nivel.label}
        </span>
      </div>

      {(risco.descricao || risco.desc) && (
        <p className={`text-xs leading-relaxed mb-3 line-clamp-2 ${darkMode ? "text-white/45" : "text-gray-500"}`}>
          {risco.descricao || risco.desc}
        </p>
      )}

      <div className="flex items-center gap-3 mb-3">
        {[
          { label: "Prob.", val: risco.probabilidade || 1, max: 5 },
          { label: "Impacto", val: risco.impacto || 1, max: 5 },
        ].map(s => (
          <div key={s.label} className="flex-1">
            <div className="flex justify-between mb-1">
              <span className={`text-[10px] ${darkMode ? "text-white/35" : "text-gray-400"}`}>{s.label}</span>
              <span className="text-[10px] font-bold" style={{ color: nivel.color }}>{s.val}/5</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden"
              style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
              <div className="h-full rounded-full"
                style={{ width: `${(s.val / s.max) * 100}%`, background: nivel.color }} />
            </div>
          </div>
        ))}
        <div className="text-right flex-shrink-0">
          <p className="text-[10px]" style={{ color: darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af" }}>Score</p>
          <p className="text-lg font-extrabold" style={{ color: nivel.color }}>{score}</p>
        </div>
      </div>

      {(risco.mitigacao || risco.mitigation) && (
        <div className="flex items-start gap-2 rounded-xl p-2.5"
          style={{ background: nivel.color + "0a", border: `1px solid ${nivel.color}18` }}>
          <Shield size={11} className="flex-shrink-0 mt-0.5" style={{ color: nivel.color }} />
          <p className="text-[10px] leading-snug" style={{ color: darkMode ? "rgba(255,255,255,0.55)" : "#374151" }}>
            {risco.mitigacao || risco.mitigation}
          </p>
        </div>
      )}

      {risco.responsavel && (
        <p className={`text-[10px] mt-2 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
          Resp: {risco.responsavel} {risco.prazo ? `· ${risco.prazo}` : ""}
        </p>
      )}
    </div>
  )
}

// ─── RISCO MODAL ─────────────────────────────────
function RiscoModal({ risco, darkMode, onClose }: { risco: any; darkMode: boolean; onClose: () => void }) {
  const score = (risco.probabilidade || 1) * (risco.impacto || 1)
  const nivel = score >= 16 ? { label: "Crítico", color: "#8b5cf6" }
              : score >= 9  ? { label: "Alto",    color: "#ef4444" }
              : score >= 4  ? { label: "Médio",   color: "#f59e0b" }
              :               { label: "Baixo",   color: "#22c55e" }
  const bg = darkMode ? "#0a1628" : "#ffffff"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: bg }} onClick={e => e.stopPropagation()}>
        <div className="p-6" style={{ background: nivel.color + "10", borderBottom: `1px solid ${nivel.color}25` }}>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full inline-block mb-2"
                style={{ background: nivel.color + "20", color: nivel.color }}>
                {nivel.label} · Score {score}
              </span>
              <h2 className={`text-lg font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>
                {risco.risco || risco.title}
              </h2>
              {risco.categoria && (
                <p className={`text-xs mt-1 ${darkMode ? "text-white/45" : "text-gray-500"}`}>{risco.categoria}</p>
              )}
            </div>
            <button onClick={onClose}
              className={`p-2 rounded-xl ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Probabilidade", value: `${risco.probabilidade || 1}/5`, color: nivel.color },
              { label: "Impacto",       value: `${risco.impacto || 1}/5`,       color: nivel.color },
              { label: "Status",        value: risco.status || "Ativo",         color: darkMode ? "rgba(255,255,255,0.75)" : "#374151" },
              { label: "Prazo",         value: risco.prazo || "—",              color: darkMode ? "rgba(255,255,255,0.75)" : "#374151" },
            ].map(f => (
              <div key={f.label} className="rounded-xl p-3"
                style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                <p className={`text-[10px] mb-0.5 ${darkMode ? "text-white/38" : "text-gray-400"}`}>{f.label}</p>
                <p className="text-sm font-bold" style={{ color: f.color }}>{f.value}</p>
              </div>
            ))}
          </div>
          {(risco.descricao || risco.desc) && (
            <div className="rounded-xl p-4"
              style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
              <p className={`text-[10px] font-bold mb-2 ${darkMode ? "text-white/40" : "text-gray-400"}`}>DESCRIÇÃO</p>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-white/70" : "text-gray-700"}`}>
                {risco.descricao || risco.desc}
              </p>
            </div>
          )}
          {(risco.mitigacao || risco.mitigation) && (
            <div className="rounded-xl p-4"
              style={{ background: nivel.color + "0a", border: `1px solid ${nivel.color}20` }}>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={13} style={{ color: nivel.color }} />
                <p className="text-[10px] font-bold" style={{ color: nivel.color }}>PLANO DE MITIGAÇÃO</p>
              </div>
              <p className={`text-sm leading-relaxed ${darkMode ? "text-white/70" : "text-gray-700"}`}>
                {risco.mitigacao || risco.mitigation}
              </p>
            </div>
          )}
          {risco.responsavel && (
            <p className={`text-xs ${darkMode ? "text-white/30" : "text-gray-400"}`}>
              Responsável: {risco.responsavel}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── SWOT SECTION ────────────────────────────────
function SwotSection({ swot, darkMode }: { swot: any; darkMode: boolean }) {
  const quadrants = [
    { key: "forcas",        label: "Forças",        color: "#22c55e", icon: TrendingUp,   items: swot.forcas        },
    { key: "fraquezas",     label: "Fraquezas",     color: "#ef4444", icon: TrendingDown, items: swot.fraquezas     },
    { key: "oportunidades", label: "Oportunidades", color: "#3b82f6", icon: Lightbulb,    items: swot.oportunidades },
    { key: "ameacas",       label: "Ameaças",       color: "#f59e0b", icon: AlertTriangle,items: swot.ameacas       },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {quadrants.map(q => {
        const Icon = q.icon
        const items = (q.items || []).filter((i: any) => i.fator?.trim())
        return (
          <div key={q.key} className="rounded-2xl p-5"
            style={{
              background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.9)",
              border: `1px solid ${q.color}20`,
            }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: q.color + "18" }}>
                <Icon size={15} style={{ color: q.color }} />
              </div>
              <div>
                <p className="text-xs font-extrabold" style={{ color: q.color }}>{q.label}</p>
                <p className={`text-[10px] ${darkMode ? "text-white/30" : "text-gray-400"}`}>
                  {items.length} {items.length === 1 ? "item" : "itens"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {items.length > 0 ? items.map((item: any, i: number) => (
                <div key={i} className="rounded-xl p-3"
                  style={{ background: q.color + "08", border: `1px solid ${q.color}15` }}>
                  <p className={`text-xs font-semibold ${darkMode ? "text-white/80" : "text-gray-800"}`}>{item.fator}</p>
                  {item.impacto && (
                    <p className={`text-[10px] mt-0.5 ${darkMode ? "text-white/35" : "text-gray-400"}`}>{item.impacto}</p>
                  )}
                </div>
              )) : (
                <p className={`text-xs text-center py-3 ${darkMode ? "text-white/20" : "text-gray-300"}`}>
                  Cadastre em Dev Mode → SWOT
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── ORCAMENTO CHARTS ────────────────────────────
function OrcamentoSection({ orcamento, darkMode, accent }: { orcamento: any; darkMode: boolean; accent: any }) {
  const [tab, setTab] = useState<"mensal" | "trimestral" | "pizza">("mensal")

  const receitas = orcamento.receitas || []
  const despesas = orcamento.despesas || []

  // Totais mensais
  const mensalData = MESES.map((mes, mi) => {
    const rec = receitas.reduce((s: number, r: any) => s + (r.meses?.[mi] || 0), 0)
    const desp = despesas.reduce((s: number, d: any) => s + (d.meses?.[mi] || 0), 0)
    return { mes, Receita: rec, Despesa: desp, Resultado: rec - desp }
  })

  // Trimestral
  const trimData = [
    { q: "Q1", Receita: mensalData.slice(0,3).reduce((s,m) => s + m.Receita,0),  Despesa: mensalData.slice(0,3).reduce((s,m) => s + m.Despesa,0)  },
    { q: "Q2", Receita: mensalData.slice(3,6).reduce((s,m) => s + m.Receita,0),  Despesa: mensalData.slice(3,6).reduce((s,m) => s + m.Despesa,0)  },
    { q: "Q3", Receita: mensalData.slice(6,9).reduce((s,m) => s + m.Receita,0),  Despesa: mensalData.slice(6,9).reduce((s,m) => s + m.Despesa,0)  },
    { q: "Q4", Receita: mensalData.slice(9,12).reduce((s,m) => s + m.Receita,0), Despesa: mensalData.slice(9,12).reduce((s,m) => s + m.Despesa,0) },
  ].map(q => ({ ...q, Resultado: q.Receita - q.Despesa }))

  const totalRec  = mensalData.reduce((s, m) => s + m.Receita, 0)
  const totalDesp = mensalData.reduce((s, m) => s + m.Despesa, 0)
  const totalRes  = totalRec - totalDesp

  // Pizza — despesas por categoria
  const COLORS = ["#3b82f6","#8b5cf6","#f59e0b","#22c55e","#ec4899","#ef4444","#06b6d4"]
  const pizzaData = despesas
    .map((d: any, i: number) => ({
      name: d.categoria,
      value: d.meses?.reduce((s: number, v: number) => s + v, 0) || 0,
      color: COLORS[i % COLORS.length],
    }))
    .filter((d: any) => d.value > 0)

  const hasData = totalRec > 0 || totalDesp > 0

  const fmt = (v: number) =>
    v >= 1_000_000 ? `R$ ${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000   ? `R$ ${(v / 1_000).toFixed(0)}k`
    : `R$ ${v.toLocaleString("pt-BR")}`

  const gridStyle = {
    background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
  }
  const axisProps = { fontSize: 11, fill: darkMode ? "rgba(255,255,255,0.38)" : "#9ca3af" }
  const gridStroke = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"

  if (!hasData) {
    return (
      <div className="rounded-2xl p-10 text-center"
        style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
        <DollarSign size={32} className="mx-auto mb-3 opacity-25" style={{ color: accent.from }} />
        <p className={`font-semibold text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>
          Sem dados financeiros cadastrados
        </p>
        <p className={`text-xs mt-1 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
          Acesse Dev Mode → Orçamento para inserir receitas e despesas
        </p>
      </div>
    )
  }

  const TABS = [
    { id: "mensal",      label: "Mensal"      },
    { id: "trimestral",  label: "Trimestral"  },
    { id: "pizza",       label: "Despesas"    },
  ]

  return (
    <div className="space-y-5">
      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Receita Total",  value: fmt(totalRec),  color: "#22c55e", icon: TrendingUp   },
          { label: "Despesa Total",  value: fmt(totalDesp), color: "#ef4444", icon: TrendingDown },
          { label: "Resultado",      value: fmt(totalRes),  color: totalRes >= 0 ? "#22c55e" : "#ef4444", icon: DollarSign },
        ].map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className="rounded-2xl p-4 flex items-center gap-3" style={gridStyle}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: s.color + "18" }}>
                <Icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-lg font-extrabold leading-none" style={{ color: s.color }}>{s.value}</p>
                <p className={`text-[10px] mt-0.5 ${darkMode ? "text-white/38" : "text-gray-400"}`}>{s.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-5" style={gridStyle}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>
            Análise Financeira 2026
          </p>
          <div className="flex gap-1.5">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: tab === t.id ? (accent.css || "#3b82f6") : (darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"),
                  color: tab === t.id ? "#fff" : (darkMode ? "rgba(255,255,255,0.5)" : "#6b7280"),
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}`,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {tab === "mensal" && (
          <ResponsiveContainer width="100%" height={260}>
            <ComposedChart data={mensalData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="mes" tick={axisProps} axisLine={false} tickLine={false} />
              <YAxis tick={axisProps} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : String(v)} />
              <Tooltip content={(p: any) => <CustomTooltip {...p} darkMode={darkMode} />} />
              <Bar dataKey="Receita"  fill="#22c55e" radius={[4,4,0,0]} opacity={0.85} />
              <Bar dataKey="Despesa"  fill="#ef4444" radius={[4,4,0,0]} opacity={0.75} />
              <Line type="monotone" dataKey="Resultado" stroke={accent.from || "#3b82f6"} strokeWidth={2.5}
                dot={false} activeDot={{ r: 5, fill: accent.from || "#3b82f6" }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}

        {tab === "trimestral" && (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={trimData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="q" tick={axisProps} axisLine={false} tickLine={false} />
              <YAxis tick={axisProps} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${v/1000}k` : String(v)} />
              <Tooltip content={(p: any) => <CustomTooltip {...p} darkMode={darkMode} />} />
              <Bar dataKey="Receita"   fill="#22c55e" radius={[5,5,0,0]} />
              <Bar dataKey="Despesa"   fill="#ef4444" radius={[5,5,0,0]} />
              <Bar dataKey="Resultado" fill={accent.from || "#3b82f6"} radius={[5,5,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {tab === "pizza" && (
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie data={pizzaData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  dataKey="value" paddingAngle={3}>
                  {pizzaData.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={(p: any) => <CustomTooltip {...p} darkMode={darkMode} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {pizzaData.map((d: any, i: number) => {
                const pct = totalDesp > 0 ? Math.round((d.value / totalDesp) * 100) : 0
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className={`text-xs ${darkMode ? "text-white/70" : "text-gray-700"}`}>{d.name}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: d.color }}>{pct}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden"
                      style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: d.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Tabela receitas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "Receitas por Categoria",  items: receitas,  color: "#22c55e" },
          { title: "Despesas por Categoria",  items: despesas,  color: "#ef4444" },
        ].map(sec => (
          <div key={sec.title} className="rounded-2xl p-5" style={gridStyle}>
            <p className={`font-bold text-sm mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{sec.title}</p>
            <div className="space-y-3">
              {sec.items.map((item: any, i: number) => {
                const total = (item.meses || []).reduce((s: number, v: number) => s + v, 0)
                const max = Math.max(...sec.items.map((it: any) => (it.meses || []).reduce((s: number, v: number) => s + v, 0)), 1)
                const pct = Math.round((total / max) * 100)
                return (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-xs ${darkMode ? "text-white/70" : "text-gray-700"}`}>{item.categoria}</span>
                      <span className="text-xs font-bold" style={{ color: sec.color }}>{fmt(total)}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: sec.color }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────
export default function Insights({ darkMode = false, accentGradient }: PageProps) {
  const { fontSettings } = useFontSettings()
  const { data: planningData } = usePlanningData()
  const [selectedRisco, setSelectedRisco] = useState<any | null>(null)
  const [filterNivel, setFilterNivel] = useState("Todos")

  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }

  const titleStyle = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#fff" : "#111827",
    fontWeight: 800, marginBottom: 4,
  }
  const subStyle = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: 20,
  }

  // Riscos do Dev Mode
  const devRiscos = planningData.riscos.filter(r => r.risco?.trim())

  const calcNivel = (r: any) => {
    const s = (r.probabilidade || 1) * (r.impacto || 1)
    return s >= 16 ? "Crítico" : s >= 9 ? "Alto" : s >= 4 ? "Médio" : "Baixo"
  }

  const niveisOpts = ["Todos", "Crítico", "Alto", "Médio", "Baixo"]
  const riscosFiltrados = devRiscos.filter(r =>
    filterNivel === "Todos" || calcNivel(r) === filterNivel
  )

  const criticos  = devRiscos.filter(r => calcNivel(r) === "Crítico").length
  const altos     = devRiscos.filter(r => calcNivel(r) === "Alto").length
  const medios    = devRiscos.filter(r => calcNivel(r) === "Médio").length
  const baixos    = devRiscos.filter(r => calcNivel(r) === "Baixo").length

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      <HeroHeader accentGradient={accentGradient} />

      {/* ── ORÇAMENTO ─────────────────────────────── */}
      <section>
        <p style={titleStyle}>Análise Financeira</p>
        <p style={subStyle}>Receitas, despesas e resultado — dados de Dev Mode → Orçamento</p>
        <OrcamentoSection orcamento={planningData.orcamento} darkMode={darkMode} accent={accent} />
      </section>

      {/* ── SWOT ──────────────────────────────────── */}
      <section>
        <p style={titleStyle}>Análise SWOT</p>
        <p style={subStyle}>Forças, Fraquezas, Oportunidades e Ameaças — Dev Mode → SWOT</p>
        <SwotSection swot={planningData.swot} darkMode={darkMode} />
      </section>

      {/* ── RISCOS ────────────────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p style={titleStyle}>Matriz de Riscos</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>
              {devRiscos.length > 0
                ? `${devRiscos.length} risco(s) · Dev Mode → Riscos`
                : "Cadastre riscos em Dev Mode → Riscos"}
            </p>
          </div>
          {devRiscos.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {niveisOpts.map(n => {
                const colors: Record<string,string> = { Crítico:"#8b5cf6",Alto:"#ef4444",Médio:"#f59e0b",Baixo:"#22c55e" }
                const c = colors[n] || (accent.from || "#3b82f6")
                return (
                  <button key={n} onClick={() => setFilterNivel(n)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: filterNivel === n ? (n === "Todos" ? accent.css : c + "25") : (darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                      color: filterNivel === n ? (n === "Todos" ? "#fff" : c) : (darkMode ? "rgba(255,255,255,0.5)" : "#6b7280"),
                      border: `1px solid ${filterNivel === n && n !== "Todos" ? c + "40" : (darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)")}`,
                    }}>
                    {n}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {devRiscos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              { label: "Críticos", value: criticos, color: "#8b5cf6" },
              { label: "Altos",    value: altos,    color: "#ef4444" },
              { label: "Médios",   value: medios,   color: "#f59e0b" },
              { label: "Baixos",   value: baixos,   color: "#22c55e" },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 text-center"
                style={{
                  background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
                  border: `1px solid ${s.color}20`,
                }}>
                <p className="text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className={`text-xs mt-1 ${darkMode ? "text-white/40" : "text-gray-500"}`}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {devRiscos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {riscosFiltrados.map((risco, i) => (
              <RiscoCard
                key={risco.id || i}
                risco={risco}
                darkMode={darkMode}
                accent={accent}
                onClick={() => setSelectedRisco(risco)}
              />
            ))}
            {riscosFiltrados.length === 0 && (
              <div className="col-span-full text-center py-8 rounded-2xl"
                style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                <p className={`text-sm ${darkMode ? "text-white/35" : "text-gray-400"}`}>
                  Nenhum risco com este nível.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center"
            style={{ background: darkMode ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
            <AlertTriangle size={32} className="mx-auto mb-3 opacity-25" style={{ color: accent.from }} />
            <p className={`font-semibold text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>
              Nenhum risco cadastrado ainda
            </p>
            <p className={`text-xs mt-1 ${darkMode ? "text-white/25" : "text-gray-300"}`}>
              Acesse Dev Mode → Riscos para adicionar
            </p>
          </div>
        )}
      </section>

      {selectedRisco && (
        <RiscoModal risco={selectedRisco} darkMode={darkMode} onClose={() => setSelectedRisco(null)} />
      )}
    </div>
  )
}
