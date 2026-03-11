import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import { Plus, CheckCircle2, Clock, AlertCircle, Star, Trash2 } from "lucide-react"

const STATUS = {
  concluido: { label: "Publicado", icon: CheckCircle2, className: "text-emerald-600 bg-emerald-50" },
  em_andamento: { label: "Em preparo", icon: Clock, className: "text-blue-600 bg-blue-50" },
  pendente: { label: "Pendente", icon: AlertCircle, className: "text-amber-600 bg-amber-50" },
}

const INITIAL_CASES = [
  { id: 1, client: "Empresa A (Agro)", sector: "Agropecuária", value: "R$ 2.4M", channel: "FNO Empresarial", testimonial: false, status: "em_andamento", stars: 5 },
  { id: 2, client: "Empresa B (Industrial)", sector: "Indústria", value: "R$ 5.8M", channel: "FNO Industrial", testimonial: true, status: "pendente", stars: 5 },
  { id: 3, client: "Empresa C (Varejo)", sector: "Comércio", value: "R$ 1.2M", channel: "FNO Empresarial", testimonial: false, status: "pendente", stars: 4 },
]

const clientConversions = [
  { source: "Indicação direta", q1: 4, q2: 5, q3: 3, q4: 0 },
  { source: "LinkedIn", q1: 0, q2: 1, q3: 1, q4: 1 },
  { source: "Instagram", q1: 3, q2: 8, q3: 6, q4: 5 },
  { source: "YouTube", q1: 0, q2: 1, q3: 2, q4: 1 },
  { source: "Blog/SEO", q1: 0, q2: 0, q3: 1, q4: 1 },
  { source: "Eventos", q1: 1, q2: 1, q3: 0, q4: 0 },
]

export default function ProvaSocial({ darkMode = false }: PageProps) {
  const [cases, setCases] = useState(INITIAL_CASES)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ client: "", sector: "", value: "", channel: "", status: "pendente" })

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
  const titleClass = darkMode ? "text-white font-bold text-xl" : "text-gray-900 font-bold text-xl"
  const subClass = darkMode ? "text-white/50 text-sm" : "text-gray-500 text-sm"
  const cardBg = darkMode ? "bg-white/10 border border-white/10 rounded-2xl p-6" : "bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
  const valClass = darkMode ? "text-white" : "text-gray-900"
  const textClass = darkMode ? "text-white/60" : "text-gray-500"
  const inputClass = darkMode
    ? "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-blue-400"
    : "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm outline-none focus:border-blue-400"
  const rowHover = darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"

  const totalPublicados = cases.filter(c => c.status === "concluido").length
  const emPreparo = cases.filter(c => c.status === "em_andamento").length
  const comDepo = cases.filter(c => c.testimonial).length

  return (
    <div className={bg}>
      <HeroHeader />

      {/* Summary stats */}
      <section>
        <h2 className={`${titleClass} mb-1`}>Tracker de Prova Social</h2>
        <p className={`${subClass} mb-5`}>Controle e acompanhamento de cases de sucesso</p>
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

      {/* Cases table */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`${titleClass} mb-0.5`}>Cases de Sucesso</h2>
            <p className={subClass}>Clique no status para atualizar</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            Novo Case
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
              <button onClick={addCase} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">Adicionar</button>
              <button onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Cancelar</button>
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
                  const st = STATUS[c.status]
                  const StatusIcon = st.icon
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
                        <select
                          value={c.status}
                          onChange={e => setStatus(c.id, e.target.value)}
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${st.className}`}
                          style={{ appearance: 'none', WebkitAppearance: 'none' }}
                        >
                          {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                        </select>
                      </td>
                      <td className="py-3 pr-3 hidden sm:table-cell">
                        <button onClick={() => toggleTestimonial(c.id)} className={`text-xs px-2 py-1 rounded-full transition-colors ${c.testimonial ? 'bg-emerald-100 text-emerald-700' : darkMode ? 'bg-white/10 text-white/40 hover:bg-white/20' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                          {c.testimonial ? "✓ Sim" : "Não"}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <button onClick={() => deleteCase(c.id)} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-white/20 hover:text-red-400 hover:bg-red-400/10' : 'text-gray-300 hover:text-red-500 hover:bg-red-50'}`}>
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

      {/* Conversion table */}
      <section>
        <h2 className={`${titleClass} mb-1`}>Conversões por Canal e Trimestre</h2>
        <p className={`${subClass} mb-5`}>Rastreamento de novas aquisições de clientes</p>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {clientConversions.map((row, i) => {
                  const total = row.q1 + row.q2 + row.q3 + row.q4
                  return (
                    <tr key={i} className={`transition-colors ${rowHover}`}>
                      <td className={`py-3 font-semibold ${valClass}`}>{row.source}</td>
                      {[row.q1, row.q2, row.q3, row.q4].map((v, j) => (
                        <td key={j} className="py-3 text-center">
                          <span className={`inline-block w-8 h-8 rounded-lg text-sm font-bold leading-8 ${v > 0 ? 'bg-blue-100 text-blue-700' : darkMode ? 'text-white/20' : 'text-gray-300'}`}>
                            {v}
                          </span>
                        </td>
                      ))}
                      <td className="py-3 text-center">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${total > 0 ? 'bg-blue-600 text-white' : textClass}`}>
                          {total}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
