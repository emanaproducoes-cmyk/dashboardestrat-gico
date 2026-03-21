import type { PageProps } from "../lib/types"
import React, { useState, useEffect } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import { Plus, CheckCircle2, Clock, AlertCircle, Star, Trash2, Pencil, Check, X, Eye } from "lucide-react"
import { useFontSettings } from "../lib/FontSettingsContext"

const STATUS = {
  concluido: { label: "Publicado", icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50" },
  em_andamento: { label: "Em preparo", icon: Clock, className: "text-blue-600 bg-blue-50" },
  pendente: { label: "Pendente", icon: AlertCircle, className: "text-amber-600 bg-amber-50" },
}

const BRAND_ICONS = [
  { icon: "🎯", label: "Especialista FNO", desc: "Referência reconhecida em financiamento FNO no Pará", color: "from-amber-400 to-orange-500" },
  { icon: "🏆", label: "Cases Reais", desc: "Resultados documentados com empresas da região", color: "from-emerald-500 to-teal-600" },
  { icon: "📡", label: "Omnichannel", desc: "Presença consistente em todos os canais digitais", color: "from-blue-500 to-indigo-600" },
  { icon: "🤝", label: "Confiança", desc: "Relacionamento de longo prazo com clientes e parceiros", color: "from-violet-500 to-purple-600" },
]

const INITIAL_CASES = [
  { id: 1, client: "Empresa A (Agro)", sector: "Agropecuária", value: "R$ 2.4M", channel: "FNO Empresarial", testimonial: false, status: "em_andamento", stars: 5 },
  { id: 2, client: "Empresa B (Industrial)", sector: "Indústria", value: "R$ 5.8M", channel: "FNO Industrial", testimonial: true, status: "pendente", stars: 5 },
  { id: 3, client: "Empresa C (Varejo)", sector: "Comércio", value: "R$ 1.2M", channel: "FNO Empresarial", testimonial: false, status: "pendente", stars: 4 },
]

const initialConversions = [
  { source: "Indicação direta", q1: 4, q2: 5, q3: 3, q4: 0 },
  { source: "LinkedIn", q1: 0, q2: 1, q3: 1, q4: 1 },
  { source: "Instagram", q1: 3, q2: 8, q3: 6, q4: 5 },
  { source: "YouTube", q1: 0, q2: 1, q3: 2, q4: 1 },
  { source: "Blog/SEO", q1: 0, q2: 0, q3: 1, q4: 1 },
  { source: "Eventos", q1: 1, q2: 1, q3: 0, q4: 0 },
]

function EditableText({ value, onChange, className = "", dark }: { value: string; onChange: (v: string) => void; className?: string; dark?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  const save = () => { onChange(draft); setEditing(false) }
  if (editing) {
    return (
      <span className="inline-flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <input autoFocus value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && save()}
          className={`bg-black/10 border border-black/20 rounded px-1 py-0.5 outline-none ${className}`} style={{ minWidth: 80 }} />
        <button onClick={save} className="p-0.5 rounded bg-black/10"><Check size={11} /></button>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 group/et cursor-pointer" onClick={() => setEditing(true)}>
      <span className={className}>{value}</span>
      <Pencil size={11} className={`opacity-0 group-hover/et:opacity-60 transition-opacity flex-shrink-0 ${dark ? 'text-white/40' : 'text-gray-400'}`} />
    </span>
  )
}

export default function ProvaSocial({ darkMode = false }: PageProps) {
  const { fontSettings } = useFontSettings()
  const [cases, setCases] = useState(INITIAL_CASES)
  const [conversions, setConversions] = useState(initialConversions)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ client: "", sector: "", value: "", channel: "", status: "pendente" })
  const [brandItems, setBrandItems] = useState(BRAND_ICONS)
  const [convModal, setConvModal] = useState<null | typeof initialConversions[0]>(null)

  const updateBrand = (i: number, field: 'label' | 'desc', val: string) => {
    setBrandItems(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: val } : b))
  }
  const updateConvSource = (i: number, val: string) => {
    setConversions(prev => prev.map((c, idx) => idx === i ? { ...c, source: val } : c))
  }
  const addCase = () => {
    if (!form.client.trim()) return
    setCases(prev => [...prev, { id: Date.now(), ...form, testimonial: false, stars: 5 }])
    setForm({ client: "", sector: "", value: "", channel: "", status: "pendente" })
    setShowForm(false)
  }
  const deleteCase = (id: number) => setCases(prev => prev.filter(c => c.id !== id))
  const toggleTestimonial = (id: number) => setCases(prev => prev.map(c => c.id === id ? { ...c, testimonial: !c.testimonial } : c))
  const setStatus = (id: number, status: string) => setCases(prev => prev.map(c => c.id === id ? { ...c, status } : c))

  const bg = "min-h-screen p-6 md:p-8 space-y-8" + (darkMode ? "" : " bg-gray-50")
  const cardBg = darkMode ? "bg-white/10 border border-white/10 rounded-2xl p-6" : "bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
  const valClass = darkMode ? "text-white" : "text-gray-900"
  const textClass = darkMode ? "text-white/60" : "text-gray-500"
  const inputClass = darkMode
    ? "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-400"
    : "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
  const rowHover = darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"

  const titleStyle = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 700,
    marginBottom: "4px",
  }
  const subStyle = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: "20px",
  }

  const totalPublicados = cases.filter(c => c.status === "concluido").length
  const emPreparo = cases.filter(c => c.status === "em_andamento").length
  const comDepo = cases.filter(c => c.testimonial).length

  return (
    <div className={bg}>
      <HeroHeader />

      <section>
        <p style={titleStyle}>Tracker de Prova Social</p>
        <p style={subStyle}>Controle e acompanhamento de cases de sucesso</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total de Cases", val: cases.length, max: 4 },
            { label: "Publicados", val: totalPublicados, max: 4 },
            { label: "Em Preparo", val: emPreparo, max: 4 },
            { label: "Com Depoimento", val: comDepo, max: 3 },
          ].map((s, i) => (
            <div key={i} className={cardBg}>
              <p className={`text-3xl font-extrabold ${valClass}`}>{s.val}<span className={`text-base ${textClass}`}>/{s.max}</span></p>
              <p className={`text-xs mt-1 ${textClass}`}>{s.label}</p>
              <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${(s.val / s.max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <p style={titleStyle}>Posicionamento de Marca</p>
        <p style={subStyle}>Os pilares de diferenciação da AF Consultoria</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {brandItems.map((b, i) => (
            <div key={i} className={`rounded-xl border p-5 transition-all ${darkMode ? 'bg-white/10 border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.color} flex items-center justify-center mb-4 text-3xl shadow-lg`}>{b.icon}</div>
              <h3 className={`font-bold text-sm mb-1 ${valClass}`}>
                <EditableText value={b.label} onChange={v => updateBrand(i, 'label', v)} className={`font-bold text-sm ${valClass}`} dark={darkMode} />
              </h3>
              <p className={`text-xs ${textClass}`}>
                <EditableText value={b.desc} onChange={v => updateBrand(i, 'desc', v)} className={`text-xs ${textClass}`} dark={darkMode} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p style={titleStyle}>Cases de Sucesso</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>Clique no status para atualizar</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus size={16} />Novo Case
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
              <button onClick={addCase} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Adicionar</button>
              <button onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>Cancelar</button>
            </div>
          </div>
        )}
        <div className={cardBg}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${textClass}`}>
                  <th className="text-left pb-3 font-medium">Cliente</th>
                  <th className="text-left pb-3 font-medium hidden sm:table-cell">Setor</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell">Valor</th>
                  <th className="text-left pb-3 font-medium">Status</th>
                  <th className="text-left pb-3 font-medium hidden sm:table-cell">Depoimento</th>
                  <th className="text-right pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {cases.map(c => {
                  const st = STATUS[c.status as keyof typeof STATUS]
                  return (
                    <tr key={c.id} className={`transition-colors ${rowHover}`}>
                      <td className="py-3 pr-3">
                        <p className={`font-semibold ${valClass}`}>{c.client}</p>
                        <div className="flex gap-0.5 mt-0.5">
                          {Array.from({ length: c.stars }).map((_, i) => <Star key={i} size={10} className="text-amber-400 fill-amber-400" />)}
                        </div>
                      </td>
                      <td className={`py-3 pr-3 hidden sm:table-cell ${textClass}`}>{c.sector}</td>
                      <td className={`py-3 pr-3 hidden md:table-cell font-medium ${valClass}`}>{c.value}</td>
                      <td className="py-3 pr-3">
                        <select value={c.status} onChange={e => setStatus(c.id, e.target.value)}
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${st.className}`}
                          style={{ appearance: 'none', WebkitAppearance: 'none' }}>
                          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td className="py-3 pr-3 hidden sm:table-cell">
                        <button onClick={() => toggleTestimonial(c.id)} className={`text-xs px-2 py-1 rounded-full transition-colors ${c.testimonial ? 'bg-emerald-100 text-emerald-700' : darkMode ? 'bg-white/10 text-white/40' : 'bg-gray-100 text-gray-400'}`}>
                          {c.testimonial ? "✓ Sim" : "Não"}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <button onClick={() => deleteCase(c.id)} className={`p-1.5 rounded-lg ${darkMode ? 'text-white/20 hover:text-red-400' : 'text-gray-300 hover:text-red-500'}`}>
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

      <section>
        <p style={titleStyle}>Conversões por Canal e Trimestre</p>
        <p style={subStyle}>Rastreamento de novas aquisições — clique em "Ver" para detalhes</p>
        <div className={cardBg}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs uppercase tracking-wider ${textClass}`}>
                  <th className="text-left pb-3 font-medium">Canal</th>
                  <th className="text-center pb-3 font-medium">Q1</th>
                  <th className="text-center pb-3 font-medium">Q2</th>
                  <th className="text-center pb-3 font-medium">Q3</th>
                  <th className="text-center pb-3 font-medium">Q4</th>
                  <th className="text-center pb-3 font-medium">Total</th>
                  <th className="text-center pb-3 font-medium">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {conversions.map((row, i) => {
                  const total = row.q1 + row.q2 + row.q3 + row.q4
                  return (
                    <tr key={i} className={`transition-colors ${rowHover}`}>
                      <td className={`py-3 font-semibold ${valClass}`}>
                        <EditableText value={row.source} onChange={v => updateConvSource(i, v)} className={`font-semibold ${valClass}`} dark={darkMode} />
                      </td>
                      {[row.q1, row.q2, row.q3, row.q4].map((v, j) => (
                        <td key={j} className="py-3 text-center">
                          <span className={`inline-block w-8 h-8 rounded-lg text-sm font-bold leading-8 ${v > 0 ? 'bg-blue-100 text-blue-700' : darkMode ? 'text-white/20' : 'text-gray-300'}`}>{v}</span>
                        </td>
                      ))}
                      <td className="py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${total > 0 ? 'bg-blue-600 text-white' : textClass}`}>{total}</span>
                      </td>
                      <td className="py-3 text-center">
                        <button onClick={() => setConvModal(row)}
                          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${darkMode ? 'bg-white/10 text-blue-300 hover:bg-white/20' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}>
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

      {convModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConvModal(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{convModal.source}</h2>
                <p className="text-sm text-gray-500 mt-0.5">Detalhamento de conversões por trimestre</p>
              </div>
              <button onClick={() => setConvModal(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {(['q1','q2','q3','q4'] as const).map((q, i) => (
                  <div key={q} className="bg-gray-50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-extrabold text-gray-900">{convModal[q]}</p>
                    <p className="text-xs text-gray-500 mt-1">Q{i+1}</p>
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-700">Total no Ano</span>
                  <span className="text-2xl font-extrabold text-blue-700">{convModal.q1 + convModal.q2 + convModal.q3 + convModal.q4}</span>
                </div>
                <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${Math.min(((convModal.q1+convModal.q2+convModal.q3+convModal.q4) / 30) * 100, 100)}%` }} />
                </div>
                <p className="text-xs text-blue-500 mt-1">vs. meta total do ano (30 conversões)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
