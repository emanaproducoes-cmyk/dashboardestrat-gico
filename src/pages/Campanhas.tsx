import React, { useState } from "react"
import { useAuth } from "../lib/AuthContext"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import {
  TrendingUp, TrendingDown, DollarSign, MousePointerClick,
  Eye, Target, Zap, Pencil, Check, X,
  BarChart2, Activity, ArrowUpRight, ArrowDownRight, RefreshCw
} from "lucide-react"
import type { PageProps } from "../lib/types"

const ADMIN_EMAIL = "emanaproducoes@gmail.com"

interface KPI { label: string; value: string; delta: string; up: boolean; color: string; icon: React.ReactNode }
interface CampRow { id: string; nome: string; canal: string; investido: number; resultados: number; custo: number; impressoes: number; cliques: number; cpc: number; cpm: number }

const INITIAL_KPIS: KPI[] = [
  { label: "Investimento Total", value: "R$ 2.870,09", delta: "+759.4%", up: true,  color: "#3b82f6", icon: <DollarSign size={18}/> },
  { label: "Resultados",         value: "1.661",       delta: "+3.222%", up: true,  color: "#10b981", icon: <Target size={18}/> },
  { label: "Custo/Resultado",    value: "R$ 1,73",     delta: "-74.1%",  up: false, color: "#f59e0b", icon: <Zap size={18}/> },
  { label: "Link Clicks",        value: "8.293",       delta: "+1.312%", up: true,  color: "#8b5cf6", icon: <MousePointerClick size={18}/> },
  { label: "Impressões",         value: "350.706",     delta: "+553.4%", up: true,  color: "#06b6d4", icon: <Eye size={18}/> },
  { label: "CPC Médio",          value: "R$ 0,19",     delta: "+31.5%",  up: false, color: "#ef4444", icon: <Activity size={18}/> },
]

const EVOLUCAO = [
  { mes: "Jan", LinkedIn: 0,    YouTube: 0,   Instagram: 0,    Blog: 0   },
  { mes: "Fev", LinkedIn: 120,  YouTube: 80,  Instagram: 200,  Blog: 40  },
  { mes: "Mar", LinkedIn: 180,  YouTube: 120, Instagram: 350,  Blog: 60  },
  { mes: "Abr", LinkedIn: 280,  YouTube: 200, Instagram: 520,  Blog: 90  },
  { mes: "Mai", LinkedIn: 420,  YouTube: 310, Instagram: 780,  Blog: 130 },
  { mes: "Jun", LinkedIn: 580,  YouTube: 440, Instagram: 1100, Blog: 180 },
  { mes: "Jul", LinkedIn: 720,  YouTube: 580, Instagram: 1380, Blog: 220 },
  { mes: "Ago", LinkedIn: 890,  YouTube: 700, Instagram: 1650, Blog: 270 },
  { mes: "Set", LinkedIn: 1050, YouTube: 840, Instagram: 1900, Blog: 310 },
  { mes: "Out", LinkedIn: 1200, YouTube: 980, Instagram: 2150, Blog: 360 },
  { mes: "Nov", LinkedIn: 1380, YouTube: 1100,Instagram: 2400, Blog: 400 },
  { mes: "Dez", LinkedIn: 1500, YouTube: 1200,Instagram: 2600, Blog: 450 },
]

const INVESTIMENTO_CANAL = [
  { canal: "LinkedIn",  planejado: 8, executado: 5, meta: 1500, atual: 1200, cor: "#0077b5" },
  { canal: "YouTube",   planejado: 6, executado: 3, meta: 500,  atual: 310,  cor: "#ff0000" },
  { canal: "Instagram", planejado: 7, executado: 4, meta: 2600, atual: 1650, cor: "#e1306c" },
  { canal: "Blog/SEO",  planejado: 4, executado: 1, meta: 450,  atual: 180,  cor: "#f59e0b" },
]

const FUNIL = [
  { etapa: "Impressões",  valor: 350706, cor: "#3b82f6", pct: 100  },
  { etapa: "Cliques",     valor: 15068,  cor: "#8b5cf6", pct: 4.3  },
  { etapa: "Link Clicks", valor: 8293,   cor: "#06b6d4", pct: 2.4  },
  { etapa: "Resultados",  valor: 1661,   cor: "#10b981", pct: 0.47 },
  { etapa: "Conversões",  valor: 284,    cor: "#f59e0b", pct: 0.08 },
]

const CAMPANHAS_INICIAL: CampRow[] = [
  { id: "321",  nome: "[GG] [CADASTRO] [VENDA] - Fazenda",     canal: "Instagram", investido: 612.59,  resultados: 83,   custo: 7.38,   impressoes: 68422,  cliques: 1421, cpc: 0.38, cpm: 8.95  },
  { id: "323",  nome: "[GG] [CADASTRO] [VENDA] - Casa",        canal: "Instagram", investido: 665.79,  resultados: 63,   custo: 10.57,  impressoes: 35593,  cliques: 757,  cpc: 0.88, cpm: 18.71 },
  { id: "322",  nome: "[GG] [CADASTRO] [VENDA] - Apartamento", canal: "Instagram", investido: 665.92,  resultados: 58,   custo: 11.47,  impressoes: 35218,  cliques: 550,  cpc: 1.21, cpm: 18.9  },
  { id: "322b", nome: "[GG] [CADASTRO] [VENDA] - LANÇAMENTO",  canal: "LinkedIn",  investido: 159.11,  resultados: 23,   custo: 6.92,   impressoes: 14910,  cliques: 86,   cpc: 1.85, cpm: 10.67 },
  { id: "326",  nome: "[GG] [CADASTRO] [VENDA] - CATALOGO",    canal: "Instagram", investido: 374.58,  resultados: 1,    custo: 374.58, impressoes: 44538,  cliques: 3784, cpc: 0.1,  cpm: 8.41  },
  { id: "mkt",  nome: "MARKETING - Crescimento Instagram",      canal: "Instagram", investido: 184.98,  resultados: 262,  custo: 0.71,   impressoes: 28532,  cliques: 262,  cpc: 0.71, cpm: 6.48  },
  { id: "327",  nome: "[GG] [CADASTRO] [VENDA] - Vários Apt.", canal: "Instagram", investido: 17.55,   resultados: 1,    custo: 17.55,  impressoes: 2362,   cliques: 22,   cpc: 0.8,  cpm: 7.43  },
  { id: "324",  nome: "Venda GO",                               canal: "YouTube",   investido: 20.4,    resultados: 0,    custo: 0,      impressoes: 1778,   cliques: 41,   cpc: 0.5,  cpm: 11.47 },
  { id: "325",  nome: "[GG] [CADASTRO] [VENDA] - Fazendas",    canal: "LinkedIn",  investido: 169.57,  resultados: 1170, custo: 0.14,   impressoes: 119353, cliques: 1170, cpc: 0.14, cpm: 1.42  },
]

const ENGAJAMENTO_SEMANAL = [
  { dia: "Seg", impressoes: 48000, cliques: 2100, conversoes: 240 },
  { dia: "Ter", impressoes: 52000, cliques: 2400, conversoes: 280 },
  { dia: "Qua", impressoes: 61000, cliques: 2900, conversoes: 320 },
  { dia: "Qui", impressoes: 55000, cliques: 2600, conversoes: 295 },
  { dia: "Sex", impressoes: 67000, cliques: 3100, conversoes: 355 },
  { dia: "Sáb", impressoes: 43000, cliques: 1900, conversoes: 210 },
  { dia: "Dom", impressoes: 38000, cliques: 1700, conversoes: 185 },
]

const PIE_CANAIS = [
  { name: "Instagram", value: 42, color: "#e1306c" },
  { name: "LinkedIn",  value: 28, color: "#0077b5" },
  { name: "YouTube",   value: 18, color: "#ff0000" },
  { name: "Blog/SEO",  value: 12, color: "#f59e0b" },
]

const canalColors: Record<string, string> = {
  Instagram: "#e1306c",
  LinkedIn:  "#0077b5",
  YouTube:   "#ff0000",
  "Blog/SEO":"#f59e0b",
}

function EditText({ value, onChange, isAdmin, className = "" }: {
  value: string; onChange: (v: string) => void; isAdmin: boolean; className?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const save = () => { onChange(draft); setEditing(false) }
  const cancel = () => { setDraft(value); setEditing(false) }

  if (!isAdmin) return <span className={className}>{value}</span>
  if (editing) {
    return (
      <span className="inline-flex items-center gap-1" onClick={e => e.stopPropagation()}>
        <input autoFocus value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel() }}
          className="bg-white/10 border border-white/30 rounded px-2 py-0.5 outline-none text-white"
          style={{ fontSize: 'inherit', fontWeight: 'inherit', minWidth: 80 }} />
        <button onClick={save}   className="p-0.5 bg-green-500/30 rounded"><Check size={10} color="#4ade80" /></button>
        <button onClick={cancel} className="p-0.5 bg-red-500/20 rounded"><X    size={10} color="#f87171" /></button>
      </span>
    )
  }
  return (
    <span className={`${className} inline-flex items-center gap-1 group/et cursor-text`} onClick={() => setEditing(true)}>
      {value}
      <Pencil size={9} className="opacity-0 group-hover/et:opacity-60 flex-shrink-0 text-white/50 transition-opacity" />
    </span>
  )
}

function KpiCard({ kpi, isAdmin, onUpdate }: { kpi: KPI; isAdmin: boolean; onUpdate: (k: Partial<KPI>) => void }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(20,30,55,0.98))', border: `1px solid ${kpi.color}30` }}>
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{ background: `radial-gradient(circle at 80% 20%, ${kpi.color}, transparent 60%)` }} />
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${kpi.color}20`, color: kpi.color }}>
          {kpi.icon}
        </div>
        <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${kpi.up ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
          {kpi.up ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
          <EditText value={kpi.delta} onChange={v => onUpdate({ delta: v })} isAdmin={isAdmin} className="text-xs font-bold" />
        </span>
      </div>
      <div>
        <p className="text-white/50 text-xs mb-1">
          <EditText value={kpi.label} onChange={v => onUpdate({ label: v })} isAdmin={isAdmin} className="text-white/50 text-xs" />
        </p>
        <p className="text-3xl font-extrabold text-white leading-tight">
          <EditText value={kpi.value} onChange={v => onUpdate({ value: v })} isAdmin={isAdmin} className="text-3xl font-extrabold text-white" />
        </p>
      </div>
      <div className="h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${kpi.color}, transparent)` }} />
    </div>
  )
}

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 14px', fontSize: 11, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.8)' }}>
      <p style={{ fontWeight: 700, marginBottom: 6, color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 4 }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill, margin: '3px 0' }}>
          {p.name}: <strong>{typeof p.value === 'number' && p.value > 1000 ? p.value.toLocaleString('pt-BR') : p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(10,15,35,0.95), rgba(15,20,45,0.98))', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="mb-5">
        <h3 className="text-white font-bold text-base">{title}</h3>
        {subtitle && <p className="text-white/40 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Campanhas({ darkMode = true }: PageProps) {
  const { user } = useAuth()
  const isAdmin = (user as any)?.email === ADMIN_EMAIL || (user as any)?.isAdmin === true

  const [kpis, setKpis]           = useState<KPI[]>(INITIAL_KPIS)
  const [campanhas, setCampanhas] = useState<CampRow[]>(CAMPANHAS_INICIAL)
  const [pageTitle, setPageTitle]       = useState("Central de Campanhas")
  const [pageSubtitle, setPageSubtitle] = useState("Performance & Inteligência de Marketing AF 2026")
  const [sortField, setSortField] = useState<keyof CampRow>('investido')
  const [sortDir, setSortDir]     = useState<'asc' | 'desc'>('desc')
  const [selectedCanal, setSelectedCanal] = useState<string | null>(null)

  const updateKpi  = (i: number, patch: Partial<KPI>) =>
    setKpis(prev => prev.map((k, idx) => idx === i ? { ...k, ...patch } : k))

  const updateCamp = (id: string, field: keyof CampRow, val: string | number) =>
    setCampanhas(prev => prev.map(c => c.id !== id ? c : { ...c, [field]: val }))

  const sorted = [...campanhas]
    .filter(c => !selectedCanal || c.canal === selectedCanal)
    .sort((a, b) => {
      const va = a[sortField], vb = b[sortField]
      if (typeof va === 'number' && typeof vb === 'number')
        return sortDir === 'desc' ? vb - va : va - vb
      return sortDir === 'desc'
        ? String(vb).localeCompare(String(va))
        : String(va).localeCompare(String(vb))
    })

  const handleSort = (f: keyof CampRow) => {
    if (sortField === f) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortField(f); setSortDir('desc') }
  }

  const totalInvestido  = campanhas.reduce((s, c) => s + c.investido,  0)
  const totalResultados = campanhas.reduce((s, c) => s + c.resultados, 0)
  const canaisUnicos    = [...new Set(campanhas.map(c => c.canal))]

  return (
    <div className="min-h-screen p-6 md:p-8 space-y-6" style={{ color: '#fff' }}>

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={18} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold uppercase tracking-widest">Dashboard Operacional</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">
            <EditText value={pageTitle} onChange={setPageTitle} isAdmin={isAdmin} className="text-3xl font-extrabold text-white" />
          </h1>
          <p className="text-white/40 text-sm mt-1">
            <EditText value={pageSubtitle} onChange={setPageSubtitle} isAdmin={isAdmin} className="text-white/40 text-sm" />
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/30 text-xs mt-1">
          <RefreshCw size={12} />
          <span>Atualizado em tempo real</span>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k, i) => (
          <KpiCard key={i} kpi={k} isAdmin={isAdmin} onUpdate={p => updateKpi(i, p)} />
        ))}
      </div>

      {/* GRÁFICO EVOLUÇÃO */}
      <Section title="Evolução de Seguidores por Canal" subtitle="Crescimento projetado 2026 — Planejamento Estratégico AF">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={EVOLUCAO} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <defs>
                {[['li','#0077b5'],['yt','#ff0000'],['ig','#e1306c'],['bl','#f59e0b']].map(([id, color]) => (
                  <linearGradient key={id} id={`grad_${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }} />
              <Area type="monotone" dataKey="LinkedIn"  stroke="#0077b5" fill="url(#grad_li)" strokeWidth={2} name="LinkedIn"  />
              <Area type="monotone" dataKey="YouTube"   stroke="#ff0000" fill="url(#grad_yt)" strokeWidth={2} name="YouTube"   />
              <Area type="monotone" dataKey="Instagram" stroke="#e1306c" fill="url(#grad_ig)" strokeWidth={2} name="Instagram" />
              <Area type="monotone" dataKey="Blog"      stroke="#f59e0b" fill="url(#grad_bl)" strokeWidth={2} name="Blog/SEO"  />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Section title="Funil de Conversão" subtitle="Do alcance à conversão">
          <div className="space-y-3">
            {FUNIL.map((f, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{f.etapa}</span>
                  <span className="font-bold" style={{ color: f.cor }}>{f.valor.toLocaleString('pt-BR')}</span>
                </div>
                <div className="h-7 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
                    style={{ width: `${f.pct}%`, background: `linear-gradient(90deg, ${f.cor}cc, ${f.cor}66)`, minWidth: f.pct > 0 ? 60 : 0 }}>
                    <span className="text-white text-[10px] font-bold">{f.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Distribuição por Canal" subtitle="% de ações executadas">
          <div className="flex items-center gap-4 h-52">
            <ResponsiveContainer width={180} height="100%">
              <PieChart>
                <Pie data={PIE_CANAIS} cx="50%" cy="50%" outerRadius={75} innerRadius={45} dataKey="value" paddingAngle={3}>
                  {PIE_CANAIS.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {PIE_CANAIS.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-white/60 text-xs flex-1">{d.name}</span>
                  <span className="text-white font-bold text-xs">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Engajamento Semanal" subtitle="Impressões, cliques e conversões">
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENGAJAMENTO_SEMANAL} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barCategoryGap="30%">
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="impressoes" name="Impressões" fill="#3b82f6" radius={[3,3,0,0]} opacity={0.7} />
                <Bar dataKey="cliques"    name="Cliques"    fill="#8b5cf6" radius={[3,3,0,0]} />
                <Bar dataKey="conversoes" name="Conversões" fill="#10b981" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      {/* METAS POR CANAL */}
      <Section title="Metas de Crescimento por Canal" subtitle="Ações planejadas vs executadas — Planejamento AF 2026">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {INVESTIMENTO_CANAL.map((c, i) => {
            const pct     = Math.round((c.executado / c.planejado) * 100)
            const pctMeta = Math.round((c.atual / c.meta) * 100)
            return (
              <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${c.cor}30` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: c.cor }} />
                  <span className="font-bold text-sm" style={{ color: c.cor }}>{c.canal}</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/50">Ações</span>
                    <span className="text-white font-bold">{c.executado}/{c.planejado}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: c.cor }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/50">Seguidores</span>
                    <span className="text-white font-bold">{c.atual.toLocaleString('pt-BR')}/{c.meta.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pctMeta}%`, background: `${c.cor}99` }} />
                  </div>
                </div>
                <p className="text-center text-xs font-bold mt-3" style={{ color: c.cor }}>{pctMeta}% da meta</p>
              </div>
            )
          })}
        </div>
      </Section>

      {/* TABELA */}
      <Section title="Detalhamento de Campanhas" subtitle="Clique no cabeçalho para ordenar — lápis para editar (admin)">
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => setSelectedCanal(null)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${!selectedCanal ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
            Todos
          </button>
          {canaisUnicos.map(c => (
            <button key={c} onClick={() => setSelectedCanal(selectedCanal === c ? null : c)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{ background: selectedCanal === c ? canalColors[c] : `${canalColors[c]}30`, color: selectedCanal === c ? '#fff' : canalColors[c] }}>
              {c}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                {([
                  ['nome',       'Campanha',      'text-left' ],
                  ['canal',      'Canal',         'text-left' ],
                  ['investido',  'Investido',     'text-right'],
                  ['resultados', 'Resultados',    'text-right'],
                  ['custo',      'Custo/Result.', 'text-right'],
                  ['impressoes', 'Impressões',    'text-right'],
                  ['cliques',    'Cliques',       'text-right'],
                  ['cpc',        'CPC',           'text-right'],
                  ['cpm',        'CPM',           'text-right'],
                ] as [keyof CampRow, string, string][]).map(([f, label, align]) => (
                  <th key={f} onClick={() => handleSort(f)}
                    className={`px-4 py-3 font-semibold text-white/50 cursor-pointer hover:text-white transition-colors select-none ${align}`}>
                    <span className={`flex items-center gap-1 ${align === 'text-right' ? 'justify-end' : ''}`}>
                      {label}
                      {sortField === f && <span className="text-blue-400">{sortDir === 'desc' ? '↓' : '↑'}</span>}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((c, i) => (
                <tr key={c.id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}
                  className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3 text-white/80 max-w-[220px] truncate">
                    <EditText value={c.nome} onChange={v => updateCamp(c.id, 'nome', v)} isAdmin={isAdmin} className="text-white/80" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: `${canalColors[c.canal] || '#888'}25`, color: canalColors[c.canal] || '#aaa' }}>
                      {c.canal}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white">R$ {c.investido.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right font-bold"
                    style={{ color: c.resultados > 100 ? '#10b981' : c.resultados > 10 ? '#f59e0b' : '#ef4444' }}>
                    {c.resultados}
                  </td>
                  <td className="px-4 py-3 text-right text-white/60">R$ {c.custo.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-white/60">{c.impressoes.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right text-white/60">{c.cliques.toLocaleString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right text-white/60">R$ {c.cpc.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-white/60">R$ {c.cpm.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>
                <td className="px-4 py-3 font-bold text-white" colSpan={2}>TOTAL GERAL</td>
                <td className="px-4 py-3 text-right font-extrabold text-blue-400">R$ {totalInvestido.toFixed(2)}</td>
                <td className="px-4 py-3 text-right font-extrabold text-emerald-400">{totalResultados.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3 text-right text-white/50">R$ {totalResultados > 0 ? (totalInvestido / totalResultados).toFixed(2) : '0.00'}</td>
                <td className="px-4 py-3 text-right text-white/50">{campanhas.reduce((s, c) => s + c.impressoes, 0).toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3 text-right text-white/50">{campanhas.reduce((s, c) => s + c.cliques, 0).toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3 text-right text-white/50" colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Section>

      {/* ROW FINAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Performance Semanal" subtitle="Alcance vs Cliques vs Conversões">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ENGAJAMENTO_SEMANAL} margin={{ top: 4, right: 16, bottom: 0, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="dia" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9,  fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Line type="monotone" dataKey="impressoes" name="Impressões" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="cliques"    name="Cliques"    stroke="#8b5cf6" strokeWidth={2}   dot={false} />
                <Line type="monotone" dataKey="conversoes" name="Conversões" stroke="#10b981" strokeWidth={2}   dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="OKRs de Alcance 2026" subtitle="Metas estratégicas do planejamento">
          <div className="space-y-4">
            {[
              { label: "Seguidores LinkedIn (+200/ano)",   atual: 120, meta: 200, cor: "#0077b5" },
              { label: "Inscritos YouTube (+500/ano)",     atual: 58,  meta: 500, cor: "#ff0000" },
              { label: "Conversão Instagram (70-105/ano)", atual: 42,  meta: 105, cor: "#e1306c" },
              { label: "Cases de Sucesso (3-4 cases)",     atual: 1,   meta: 4,   cor: "#f59e0b" },
              { label: "Engajamento LinkedIn (2.5-5.5%)",  atual: 3.2, meta: 5.5, cor: "#06b6d4" },
              { label: "Engajamento YouTube (3-6.8%)",     atual: 2.1, meta: 6.8, cor: "#a78bfa" },
            ].map((okr, i) => {
              const pct = Math.min(100, Math.round((okr.atual / okr.meta) * 100))
              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-white/60">{okr.label}</span>
                    <span className="font-bold" style={{ color: okr.cor }}>{pct}%</span>
                  </div>
                  <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${okr.cor}, ${okr.cor}88)`, boxShadow: `0 0 8px ${okr.cor}60` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Section>
      </div>
    </div>
  )
}
