import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import { Plus, CheckCircle2, Clock, AlertCircle, Star, Trash2, Eye, X, Users, Award, Target, TrendingUp } from "lucide-react"
import { useFontSettings } from "../lib/FontSettingsContext"
import { usePlanningData } from "../lib/PlanningDataContext"

const STATUS = {
  concluido:    { label: "Publicado",  color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  em_andamento: { label: "Em preparo", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  pendente:     { label: "Pendente",   color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
}

const NIVEL_COLORS: Record<string, string> = {
  "Júnior":      "#6b7280",
  "Pleno":       "#3b82f6",
  "Sênior":      "#8b5cf6",
  "Especialista":"#ec4899",
  "Gestor":      "#f59e0b",
  "Diretor":     "#22c55e",
  "C-Level":     "#ef4444",
}

const STATUS_EQUIPE: Record<string, { color: string; bg: string }> = {
  "Ativo":    { color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
  "Inativo":  { color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  "Férias":   { color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  "Afastado": { color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
}

const INITIAL_CASES = [
  { id: 1, client: "Empresa A (Agro)",      sector: "Agropecuária", value: "R$ 2.4M", channel: "FNO Empresarial", testimonial: false, status: "em_andamento", stars: 5 },
  { id: 2, client: "Empresa B (Industrial)", sector: "Indústria",    value: "R$ 5.8M", channel: "FNO Industrial",  testimonial: true,  status: "pendente",     stars: 5 },
  { id: 3, client: "Empresa C (Varejo)",    sector: "Comércio",     value: "R$ 1.2M", channel: "FNO Empresarial", testimonial: false, status: "pendente",     stars: 4 },
]

const INITIAL_CONVERSIONS = [
  { source: "Indicação direta", q1: 4, q2: 5, q3: 3, q4: 0 },
  { source: "LinkedIn",         q1: 0, q2: 1, q3: 1, q4: 1 },
  { source: "Instagram",        q1: 3, q2: 8, q3: 6, q4: 5 },
  { source: "YouTube",          q1: 0, q2: 1, q3: 2, q4: 1 },
  { source: "Blog/SEO",         q1: 0, q2: 0, q3: 1, q4: 1 },
  { source: "Eventos",          q1: 1, q2: 1, q3: 0, q4: 0 },
]

function CustomTooltip({ active, payload, label, darkMode }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: darkMode ? "rgba(5,12,28,0.97)" : "rgba(255,255,255,0.99)",
      border: `1px solid ${darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
      borderRadius: 12, padding: "10px 14px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.28)", minWidth: 140,
    }}>
      <p style={{ color: darkMode ? "rgba(255,255,255,0.45)" : "#6b7280", fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 8 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: i < payload.length - 1 ? 5 : 0 }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: p.color || p.fill, flexShrink: 0 }} />
          <span style={{ color: darkMode ? "rgba(255,255,255,0.5)" : "#9ca3af", fontSize: 11, flex: 1 }}>{p.name}:</span>
          <span style={{ color: darkMode ? "#ffffff" : "#111827", fontSize: 12, fontWeight: 800 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

function MemberCard({ membro, darkMode, accent }: { membro: any; darkMode: boolean; accent: any }) {
  const [hovered, setHovered] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const nivelColor = NIVEL_COLORS[membro.nivel] || "#6b7280"
  const statusStyle = STATUS_EQUIPE[membro.status] || STATUS_EQUIPE["Ativo"]
  const initials = membro.nome.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "?"

  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"

  return (
    <>
      <div
        className="rounded-2xl p-5 transition-all duration-250 cursor-pointer"
        style={{
          background: cardBg,
          border: `1px solid ${hovered ? nivelColor + "40" : cardBorder}`,
          boxShadow: hovered ? `0 8px 28px ${nivelColor}14, 0 0 0 1px ${nivelColor}25` : "none",
          transform: hovered ? "translateY(-2px)" : "none",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setShowDetail(true)}
      >
        {/* Avatar + status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${nivelColor}cc, ${nivelColor})` }}>
              {initials}
            </div>
            <div>
              <p className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>{membro.nome}</p>
              <p className={`text-xs mt-0.5 ${darkMode ? "text-white/45" : "text-gray-500"}`}>{membro.cargo}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-full"
            style={{ background: statusStyle.bg, color: statusStyle.color }}>
            {membro.status}
          </span>
        </div>

        {/* Área + nível */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-semibold px-2 py-1 rounded-lg"
            style={{ background: nivelColor + "18", color: nivelColor }}>
            {membro.nivel}
          </span>
          <span className={`text-[10px] ${darkMode ? "text-white/35" : "text-gray-400"}`}>{membro.area}</span>
        </div>

        {/* OKR + KPI */}
        <div className="space-y-1.5">
          {membro.okrPrincipal && (
            <div className="flex items-start gap-2">
              <Target size={11} className="flex-shrink-0 mt-0.5" style={{ color: accent.from || "#3b82f6" }} />
              <p className={`text-[11px] leading-tight truncate ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                {membro.okrPrincipal}
              </p>
            </div>
          )}
          {membro.kpiResponsavel && (
            <div className="flex items-start gap-2">
              <TrendingUp size={11} className="flex-shrink-0 mt-0.5" style={{ color: "#22c55e" }} />
              <p className={`text-[11px] leading-tight truncate ${darkMode ? "text-white/50" : "text-gray-500"}`}>
                {membro.kpiResponsavel}
              </p>
            </div>
          )}
        </div>

        {/* Ver detalhes hint */}
        <div className="mt-3 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
          style={{
            background: hovered ? nivelColor + "18" : "transparent",
            color: nivelColor,
            border: `1px solid ${hovered ? nivelColor + "35" : "transparent"}`
          }}>
          <Eye size={11} />
          Ver Perfil
        </div>
      </div>

      {/* Member detail modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
          <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
          <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: darkMode ? "#0a1628" : "#ffffff" }}
            onClick={e => e.stopPropagation()}>

            <div className="p-6" style={{ background: `linear-gradient(135deg,${nivelColor}18,${nivelColor}05)`, borderBottom: `1px solid ${nivelColor}25` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                    style={{ background: `linear-gradient(135deg,${nivelColor}cc,${nivelColor})` }}>
                    {initials}
                  </div>
                  <div>
                    <h2 className={`text-xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>{membro.nome}</h2>
                    <p className={`text-sm mt-0.5 ${darkMode ? "text-white/50" : "text-gray-500"}`}>{membro.cargo}</p>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ background: nivelColor + "20", color: nivelColor }}>{membro.nivel}</span>
                  </div>
                </div>
                <button onClick={() => setShowDetail(false)}
                  className={`p-2 rounded-xl ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Área", value: membro.area || "—" },
                  { label: "Status", value: membro.status },
                  { label: "E-mail", value: membro.email || "—" },
                  { label: "Nível", value: membro.nivel },
                ].map(f => (
                  <div key={f.label} className="rounded-xl p-3"
                    style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                    <p className={`text-[10px] mb-0.5 ${darkMode ? "text-white/38" : "text-gray-400"}`}>{f.label}</p>
                    <p className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>{f.value}</p>
                  </div>
                ))}
              </div>

              {membro.okrPrincipal && (
                <div className="rounded-xl p-4"
                  style={{ background: (accent.from || "#3b82f6") + "10", border: `1px solid ${accent.from || "#3b82f6"}25` }}>
                  <div className="flex items-center gap-2 mb-1">
                    <Target size={13} style={{ color: accent.from || "#3b82f6" }} />
                    <span className="text-xs font-bold" style={{ color: accent.from || "#3b82f6" }}>OKR Principal</span>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-white/75" : "text-gray-700"}`}>{membro.okrPrincipal}</p>
                </div>
              )}

              {membro.kpiResponsavel && (
                <div className="rounded-xl p-4"
                  style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={13} className="text-green-500" />
                    <span className="text-xs font-bold text-green-500">KPI Responsável</span>
                  </div>
                  <p className={`text-sm ${darkMode ? "text-white/75" : "text-gray-700"}`}>{membro.kpiResponsavel}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function ProvaSocial({ darkMode = false, accentGradient }: PageProps) {
  const { fontSettings } = useFontSettings()
  const { data: planningData } = usePlanningData()
  const [cases, setCases] = useState(INITIAL_CASES)
  const [conversions] = useState(INITIAL_CONVERSIONS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ client: "", sector: "", value: "", channel: "", status: "pendente" })
  const [convModal, setConvModal] = useState<null | typeof INITIAL_CONVERSIONS[0]>(null)
  const [filterNivel, setFilterNivel] = useState("Todos")
  const [filterStatus, setFilterStatus] = useState("Todos")

  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }

  // Equipe do Dev Mode — filtra apenas membros com nome preenchido
  const equipe = planningData.equipe.filter(m => m.nome.trim())
  const niveis = ["Todos", ...Array.from(new Set(equipe.map(m => m.nivel)))]
  const statusOpts = ["Todos", ...Array.from(new Set(equipe.map(m => m.status)))]
  const equipeFiltrada = equipe.filter(m => {
    const okNivel = filterNivel === "Todos" || m.nivel === filterNivel
    const okStatus = filterStatus === "Todos" || m.status === filterStatus
    return okNivel && okStatus
  })

  const cardBg = darkMode
    ? "rounded-2xl p-6 bg-white/4 border border-white/8"
    : "rounded-2xl p-6 bg-white border border-black/6 shadow-sm"

  const valClass = darkMode ? "text-white" : "text-gray-900"
  const textClass = darkMode ? "text-white/50" : "text-gray-500"
  const inputClass = darkMode
    ? "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none"
    : "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none"
  const rowHover = darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"

  const titleStyle = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 800, marginBottom: 4,
  }
  const subStyle = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: 20,
  }

  const totalPublicados = cases.filter(c => c.status === "concluido").length
  const emPreparo = cases.filter(c => c.status === "em_andamento").length
  const comDepo = cases.filter(c => c.testimonial).length

  const addCase = () => {
    if (!form.client.trim()) return
    setCases(prev => [...prev, { id: Date.now(), ...form, testimonial: false, stars: 5 }])
    setForm({ client: "", sector: "", value: "", channel: "", status: "pendente" })
    setShowForm(false)
  }
  const deleteCase = (id: number) => setCases(prev => prev.filter(c => c.id !== id))
  const toggleTestimonial = (id: number) => setCases(prev => prev.map(c => c.id === id ? { ...c, testimonial: !c.testimonial } : c))
  const setStatus = (id: number, status: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c))

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-8">
      <HeroHeader accentGradient={accentGradient} />

      {/* ── EQUIPE DO DEV MODE ─────────────────────── */}
      <section>
        <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
          <div>
            <p style={titleStyle}>Equipe</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>
              {equipe.length > 0
                ? `${equipe.length} membro(s) · editável em Dev Mode → Equipe`
                : "Cadastre membros em Dev Mode → Equipe"}
            </p>
          </div>
          {equipe.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {niveis.map(n => (
                <button key={n} onClick={() => setFilterNivel(n)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filterNivel === n ? (accent.css || "#3b82f6") : (darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                    color: filterNivel === n ? "#fff" : (darkMode ? "rgba(255,255,255,0.5)" : "#6b7280"),
                    border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                  }}>
                  {n}
                </button>
              ))}
            </div>
          )}
        </div>

        {equipe.length > 0 ? (
          <>
            {/* Stats da equipe */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { label: "Total", value: equipe.length, icon: Users, color: accent.from || "#3b82f6" },
                { label: "Ativos", value: equipe.filter(m => m.status === "Ativo").length, icon: CheckCircle2, color: "#22c55e" },
                { label: "Níveis distintos", value: new Set(equipe.map(m => m.nivel)).size, icon: Award, color: "#f59e0b" },
                { label: "Áreas distintas", value: new Set(equipe.map(m => m.area).filter(Boolean)).size, icon: Target, color: "#8b5cf6" },
              ].map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={i} className="rounded-2xl p-4 flex items-center gap-3"
                    style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)", border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: s.color + "20" }}>
                      <Icon size={16} style={{ color: s.color }} />
                    </div>
                    <div>
                      <p className="text-xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                      <p className={`text-xs ${darkMode ? "text-white/40" : "text-gray-500"}`}>{s.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cards da equipe */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {equipeFiltrada.map((membro, i) => (
                <MemberCard key={membro.id || i} membro={membro} darkMode={darkMode} accent={accent} />
              ))}
              {equipeFiltrada.length === 0 && (
                <div className={`col-span-full text-center py-8 rounded-2xl ${textClass}`}
                  style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <p className="text-sm">Nenhum membro encontrado com os filtros selecionados.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="rounded-2xl p-10 text-center"
            style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `1px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
            <Users size={32} className="mx-auto mb-3 opacity-25" style={{ color: accent.from }} />
            <p className={`font-semibold text-sm ${darkMode ? "text-white/40" : "text-gray-400"}`}>Nenhum membro cadastrado ainda</p>
            <p className={`text-xs mt-1 ${darkMode ? "text-white/25" : "text-gray-300"}`}>Acesse Dev Mode → Equipe para adicionar membros</p>
          </div>
        )}
      </section>

      {/* ── TRACKER DE PROVA SOCIAL ────────────────── */}
      <section>
        <p style={titleStyle}>Tracker de Prova Social</p>
        <p style={subStyle}>Controle e acompanhamento de cases de sucesso</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total de Cases",    val: cases.length,       max: 4, color: accent.from || "#3b82f6" },
            { label: "Publicados",        val: totalPublicados,    max: 4, color: "#22c55e" },
            { label: "Em Preparo",        val: emPreparo,          max: 4, color: "#3b82f6" },
            { label: "Com Depoimento",    val: comDepo,            max: 3, color: "#f59e0b" },
          ].map((s, i) => (
            <div key={i} className={cardBg}>
              <p className="text-3xl font-extrabold" style={{ color: s.color }}>
                {s.val}<span className={`text-base font-normal ml-1 ${textClass}`}>/{s.max}</span>
              </p>
              <p className={`text-xs mt-1 ${textClass}`}>{s.label}</p>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden"
                style={{ background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${(s.val / s.max) * 100}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CASES DE SUCESSO ──────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p style={titleStyle}>Cases de Sucesso</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>Clique no status para atualizar</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl text-white font-medium"
            style={{ background: accent.css }}>
            <Plus size={15} /> Novo Case
          </button>
        </div>

        {showForm && (
          <div className={`${cardBg} mb-4`}>
            <h3 className={`font-bold mb-4 ${valClass}`}>Adicionar Case</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input className={inputClass} placeholder="Nome do cliente" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} />
              <input className={inputClass} placeholder="Setor" value={form.sector} onChange={e => setForm(f => ({ ...f, sector: e.target.value }))} />
              <input className={inputClass} placeholder="Valor aprovado" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} />
              <input className={inputClass} placeholder="Canal de crédito" value={form.channel} onChange={e => setForm(f => ({ ...f, channel: e.target.value }))} />
              <select className={inputClass} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="pendente">Pendente</option>
                <option value="em_andamento">Em preparo</option>
                <option value="concluido">Publicado</option>
              </select>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={addCase}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white"
                style={{ background: accent.css }}>Adicionar</button>
              <button onClick={() => setShowForm(false)}
                className={`px-4 py-2 rounded-xl text-sm ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>Cancelar</button>
            </div>
          </div>
        )}

        <div className={cardBg}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-wider border-b ${darkMode ? "border-white/08 text-white/40" : "border-gray-100 text-gray-400"}`}>
                  <th className="text-left pb-3 font-semibold">Cliente</th>
                  <th className="text-left pb-3 font-semibold hidden sm:table-cell">Setor</th>
                  <th className="text-left pb-3 font-semibold hidden md:table-cell">Valor</th>
                  <th className="text-left pb-3 font-semibold">Status</th>
                  <th className="text-left pb-3 font-semibold hidden sm:table-cell">Depoimento</th>
                  <th className="text-right pb-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c, ci) => {
                  const st = STATUS[c.status as keyof typeof STATUS]
                  return (
                    <tr key={c.id}
                      className={`transition-colors ${rowHover}`}
                      style={{ borderTop: ci > 0 ? `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none" }}>
                      <td className="py-3 pr-3">
                        <p className={`font-semibold ${valClass}`}>{c.client}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: c.stars }).map((_, i) => (
                            <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </td>
                      <td className={`py-3 pr-3 hidden sm:table-cell ${textClass}`}>{c.sector}</td>
                      <td className={`py-3 pr-3 hidden md:table-cell font-medium ${valClass}`}>{c.value}</td>
                      <td className="py-3 pr-3">
                        <select value={c.status} onChange={e => setStatus(c.id, e.target.value)}
                          className="text-xs font-bold px-2.5 py-1 rounded-full cursor-pointer outline-none border-0"
                          style={{ background: st.bg, color: st.color, appearance: "none" }}>
                          {Object.entries(STATUS).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 pr-3 hidden sm:table-cell">
                        <button onClick={() => toggleTestimonial(c.id)}
                          className="text-xs px-2 py-1 rounded-full transition-colors font-medium"
                          style={{
                            background: c.testimonial ? "rgba(34,197,94,0.12)" : (darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                            color: c.testimonial ? "#22c55e" : (darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af"),
                          }}>
                          {c.testimonial ? "✓ Sim" : "Não"}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <button onClick={() => deleteCase(c.id)}
                          className={`p-1.5 rounded-lg transition-colors ${darkMode ? "text-white/20 hover:text-red-400" : "text-gray-300 hover:text-red-500"}`}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CONVERSÕES POR CANAL ──────────────────── */}
      <section>
        <p style={titleStyle}>Conversões por Canal e Trimestre</p>
        <p style={subStyle}>Rastreamento de novas aquisições — clique em "Ver" para detalhes</p>
        <div className={cardBg}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-wider border-b ${darkMode ? "border-white/08 text-white/40" : "border-gray-100 text-gray-400"}`}>
                  <th className="text-left pb-3 font-semibold">Canal</th>
                  {["Q1","Q2","Q3","Q4"].map(q => (
                    <th key={q} className="text-center pb-3 font-semibold">{q}</th>
                  ))}
                  <th className="text-center pb-3 font-semibold">Total</th>
                  <th className="text-center pb-3 font-semibold">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((row, i) => {
                  const total = row.q1 + row.q2 + row.q3 + row.q4
                  return (
                    <tr key={i} className={`transition-colors ${rowHover}`}
                      style={{ borderTop: i > 0 ? `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none" }}>
                      <td className={`py-3 font-semibold ${valClass}`}>{row.source}</td>
                      {[row.q1, row.q2, row.q3, row.q4].map((v, j) => (
                        <td key={j} className="py-3 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold"
                            style={{
                              background: v > 0 ? (accent.from || "#3b82f6") + "18" : (darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                              color: v > 0 ? (accent.from || "#3b82f6") : (darkMode ? "rgba(255,255,255,0.2)" : "#d1d5db"),
                            }}>
                            {v}
                          </span>
                        </td>
                      ))}
                      <td className="py-3 text-center">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: total > 0 ? (accent.css || "#3b82f6") : (darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"),
                            color: total > 0 ? "#fff" : (darkMode ? "rgba(255,255,255,0.3)" : "#9ca3af"),
                          }}>
                          {total}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button onClick={() => setConvModal(row)}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-colors font-medium"
                          style={{
                            background: darkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                            color: accent.from || "#3b82f6",
                          }}>
                          <Eye size={12} /> Ver
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── MODAL CONVERSÃO ───────────────────────── */}
      {convModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConvModal(null)}>
          <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
          <div className="relative rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            style={{ background: darkMode ? "#0a1628" : "#ffffff" }}
            onClick={e => e.stopPropagation()}>
            <div className="p-6" style={{ borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-lg font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}>{convModal.source}</h2>
                  <p className={`text-sm mt-0.5 ${textClass}`}>Conversões por trimestre</p>
                </div>
                <button onClick={() => setConvModal(null)}
                  className={`p-2 rounded-xl ${darkMode ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {(["q1","q2","q3","q4"] as const).map((q, i) => (
                  <div key={q} className="rounded-xl p-3 text-center"
                    style={{ background: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                    <p className="text-2xl font-extrabold" style={{ color: accent.from || "#3b82f6" }}>{convModal[q]}</p>
                    <p className={`text-xs mt-1 ${textClass}`}>Q{i + 1}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-4"
                style={{ background: (accent.from || "#3b82f6") + "12", border: `1px solid ${(accent.from || "#3b82f6")}25` }}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold" style={{ color: accent.from || "#3b82f6" }}>Total no Ano</span>
                  <span className="text-2xl font-extrabold" style={{ color: accent.from || "#3b82f6" }}>
                    {convModal.q1 + convModal.q2 + convModal.q3 + convModal.q4}
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden"
                  style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(((convModal.q1 + convModal.q2 + convModal.q3 + convModal.q4) / 30) * 100, 100)}%`,
                      background: accent.css || "#3b82f6"
                    }} />
                </div>
                <p className="text-xs mt-1" style={{ color: (accent.from || "#3b82f6") + "99" }}>
                  vs. meta total do ano (30 conversões)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
