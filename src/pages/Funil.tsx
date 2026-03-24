import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import ClientJourney from "../components/dashboard/ClientJourney"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, RadialBarChart, RadialBar
} from "recharts"
import { useFontSettings } from "../lib/FontSettingsContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import {
  X, Info, ArrowRight, Code2, TrendingUp, Users, Zap, Target,
  CheckCircle2, Clock, ChevronRight, BarChart2, Activity
} from "lucide-react"

// ── Cores únicas por estágio do funil ────────────
const FUNNEL_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#ec4899"]
const AUTO_COLORS   = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"]

const DEFAULT_FUNNEL = [
  { stage: "Awareness",     count: 1200, pct: 100, desc: "Pessoas que tiveram contato com a marca AF via orgânico, mídia paga ou indicação.", meta: 2000 },
  { stage: "Interesse",     count: 480,  pct: 40,  desc: "Leads que demonstraram interesse ao engajar com conteúdo ou visitar o site.", meta: 800 },
  { stage: "Consideração",  count: 120,  pct: 10,  desc: "Potenciais clientes que solicitaram informações ou participaram de eventos.", meta: 200 },
  { stage: "Intenção",      count: 48,   pct: 4,   desc: "Leads qualificados em negociação ativa com a equipe comercial.", meta: 80 },
  { stage: "Conversão",     count: 22,   pct: 1.8, desc: "Clientes que assinaram contrato. Ticket médio: R$ 45k.", meta: 40 },
]

const DEFAULT_AUTOMATION = [
  { trigger: "Novo contrato assinado",       action: "Envio de mensagem de boas-vindas + convite para redes", timing: "Imediato",   taxa: 92, canal: "WhatsApp" },
  { trigger: "Projeto protocolar no banco",  action: "Mensagem de reforço positivo + dica da etapa",          timing: "Mesmo dia",  taxa: 88, canal: "E-mail" },
  { trigger: "Projeto aprovado",             action: "Mensagem de celebração + orientações de implementação",  timing: "Imediato",   taxa: 95, canal: "WhatsApp" },
  { trigger: "Projeto contratado",           action: "Mensagem de conquista + próximos passos",                timing: "Imediato",   taxa: 90, canal: "E-mail" },
  { trigger: "Projeto concluído",            action: "Agradecimento + convite para depoimento",                timing: "3 dias após",taxa: 74, canal: "WhatsApp" },
]

// ── DevMode Badge ─────────────────────────────────
function DevBadge({ dark, section }: { dark: boolean; section: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
        style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)" }}>
        <Code2 size={10} /> Editar dados
      </button>
      {show && (
        <div className="absolute right-0 top-8 z-40 rounded-xl p-3 shadow-2xl w-64"
          style={{ background: dark ? "#0a1628" : "#fff", border: "1px solid rgba(59,130,246,0.25)" }}>
          <p className="text-[10px] font-bold text-blue-400 mb-2 uppercase tracking-wider">Caminho Dev Mode</p>
          <div className="flex items-center gap-1.5 text-[11px] mb-2"
            style={{ color: dark ? "rgba(255,255,255,0.70)" : "#374151" }}>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Dev Mode</span>
            <ArrowRight size={10} className="text-blue-400" />
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/20 text-purple-400">{section}</span>
          </div>
          <p className="text-[10px]" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#6b7280" }}>
            Edite os dados desta seção. Salvo no Firestore — todos os usuários veem em tempo real.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Modal Detalhe Funil ───────────────────────────
function FunnelDetailModal({ stage, idx, dark, onClose }: { stage: any; idx: number; dark: boolean; onClose: () => void }) {
  const color = FUNNEL_COLORS[idx]
  const convRate = idx > 0
    ? `${((stage.count / DEFAULT_FUNNEL[idx - 1].count) * 100).toFixed(1)}% do estágio anterior`
    : "Topo do funil"

  const chartData = [
    { name: "Atual", value: stage.count, fill: color },
    { name: "Meta",  value: stage.meta,  fill: color + "30" },
  ]

  const progressPct = Math.min(Math.round((stage.count / stage.meta) * 100), 100)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: dark ? "#0a1628" : "#fff", border: `1px solid ${color}30`, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6" style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0"
                style={{ background: color }}>
                {idx + 1}
              </div>
              <div>
                <h3 className={`text-lg font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>{stage.stage}</h3>
                <p className="text-xs mt-0.5" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }}>{convRate}</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-1.5 rounded-lg ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Descrição */}
          <p className="text-sm leading-relaxed" style={{ color: dark ? "rgba(255,255,255,0.65)" : "#374151" }}>
            {stage.desc}
          </p>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Volume", value: stage.count.toLocaleString("pt-BR"), icon: Users },
              { label: "Taxa Geral", value: `${stage.pct}%`, icon: TrendingUp },
              { label: "Meta", value: stage.meta.toLocaleString("pt-BR"), icon: Target },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: color + "12", border: `1px solid ${color}25` }}>
                <Icon size={14} style={{ color }} className="mx-auto mb-1" />
                <p className="text-xs" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }}>{label}</p>
                <p className="text-base font-extrabold mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Barra de progresso vs meta */}
          <div>
            <div className="flex justify-between mb-2 text-xs">
              <span style={{ color: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }}>Progresso vs Meta</span>
              <span className="font-bold" style={{ color }}>{progressPct}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden"
              style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
            </div>
          </div>

          {/* Gráfico de barras atual vs meta */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>Atual vs Meta</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: dark ? "#0a1628" : "#fff", border: `1px solid ${color}30`, borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="value" name="Volume" radius={[6, 6, 0, 0]}>
                  {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Modal Detalhe Automação ───────────────────────
function AutomationDetailModal({ step, idx, dark, onClose }: { step: any; idx: number; dark: boolean; onClose: () => void }) {
  const color = AUTO_COLORS[idx]
  const canalData = [
    { name: "Taxa de Abertura", value: step.taxa, fill: color },
    { name: "Benchmark", value: 78, fill: color + "40" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: dark ? "#0a1628" : "#fff", border: `1px solid ${color}30`, maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6" style={{ borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0"
                style={{ background: color }}>
                {idx + 1}
              </div>
              <div>
                <h3 className={`text-base font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>{step.trigger}</h3>
                <p className="text-xs mt-0.5" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }}>
                  Canal: {step.canal} · {step.timing}
                </p>
              </div>
            </div>
            <button onClick={onClose} className={`p-1.5 rounded-lg ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Ação */}
          <div className="rounded-xl p-4" style={{ background: color + "10", border: `1px solid ${color}20` }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} style={{ color }} />
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>Ação Automática</p>
            </div>
            <p className="text-sm" style={{ color: dark ? "rgba(255,255,255,0.80)" : "#374151" }}>{step.action}</p>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Taxa Engaj.", value: `${step.taxa}%`, icon: Activity },
              { label: "Timing",     value: step.timing,      icon: Clock },
              { label: "Canal",      value: step.canal,        icon: CheckCircle2 },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl p-3 text-center"
                style={{ background: color + "12", border: `1px solid ${color}25` }}>
                <Icon size={14} style={{ color }} className="mx-auto mb-1" />
                <p className="text-[10px]" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }}>{label}</p>
                <p className="text-sm font-extrabold mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Gráfico taxa vs benchmark */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-3"
              style={{ color: dark ? "rgba(255,255,255,0.35)" : "#9ca3af" }}>Taxa de Engajamento vs Benchmark</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={canalData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: dark ? "rgba(255,255,255,0.4)" : "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.55)" : "#374151" }} axisLine={false} tickLine={false} width={110} />
                <Tooltip contentStyle={{ background: dark ? "#0a1628" : "#fff", border: `1px solid ${color}30`, borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${v}%`, ""]} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {canalData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Barra de desempenho */}
          <div>
            <div className="flex justify-between mb-2 text-xs">
              <span style={{ color: dark ? "rgba(255,255,255,0.45)" : "#9ca3af" }}>Desempenho vs Benchmark (78%)</span>
              <span className="font-bold" style={{ color: step.taxa >= 78 ? "#22c55e" : "#f59e0b" }}>
                {step.taxa >= 78 ? "✓ Acima" : "⚠ Abaixo"}
              </span>
            </div>
            <div className="h-3 rounded-full overflow-hidden"
              style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${step.taxa}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────
export default function Funil({ darkMode = false, accentGradient }: PageProps) {
  const { fontSettings } = useFontSettings()
  const { data: planning } = usePlanningData()
  const [selectedFunnel, setSelectedFunnel]   = useState<{ stage: any; idx: number } | null>(null)
  const [selectedAuto,   setSelectedAuto]     = useState<{ step: any; idx: number } | null>(null)

  // Carregar dados do Firestore ou usar defaults
  const funnelData    = (planning as any).funnelData?.length    ? (planning as any).funnelData    : DEFAULT_FUNNEL
  const automationSteps = (planning as any).automationSteps?.length ? (planning as any).automationSteps : DEFAULT_AUTOMATION

  const cardBg     = darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.95)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.06)"
  const labelClass = darkMode ? "text-white/40" : "text-gray-400"
  const valClass   = darkMode ? "text-white"    : "text-gray-900"
  const textClass  = darkMode ? "text-white/60" : "text-gray-500"

  const cardStyle: React.CSSProperties = { background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: 24 }

  const titleStyle: React.CSSProperties = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 800, marginBottom: 4,
  }
  const subStyle: React.CSSProperties = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: darkMode ? "rgba(255,255,255,0.5)" : "#6b7280",
    marginBottom: 20,
  }

  return (
    <div className={`min-h-screen p-6 md:p-8 space-y-8 ${!darkMode ? "bg-gray-50" : ""}`}>
      <HeroHeader />

      {/* ── JORNADA DO CLIENTE ───────────────────── */}
      <section style={cardStyle}>
        <ClientJourney dark={darkMode} />
      </section>

      {/* ── FUNIL DE CONVERSÃO ───────────────────── */}
      <section>
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <p style={titleStyle}>Funil de Conversão</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>Do awareness à conversão — clique em cada etapa para detalhes</p>
          </div>
          <DevBadge dark={darkMode} section="Funil" />
        </div>
        <div className="space-y-3 mt-4">
          {funnelData.map((stage: any, i: number) => {
            const color = FUNNEL_COLORS[i]
            return (
              <button
                key={i}
                onClick={() => setSelectedFunnel({ stage, idx: i })}
                className="w-full text-left rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 group"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = `0 8px 28px ${color}18`
                  e.currentTarget.style.borderColor = color + "50"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = cardBorder
                }}
              >
                {/* Número colorido único por estágio */}
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white flex-shrink-0 text-sm"
                  style={{ background: color }}>
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className={`font-bold text-sm ${valClass}`}>{stage.stage}</h3>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium" style={{ color: dark => dark ? "rgba(255,255,255,0.40)" : "#9ca3af" }}>{stage.pct}%</span>
                      <span className="text-sm font-extrabold" style={{ color }}>{stage.count.toLocaleString("pt-BR")}</span>
                    </div>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${darkMode ? "bg-white/10" : "bg-gray-100"}`}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${stage.pct}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
                  </div>
                </div>

                {/* Ver detalhes — aparece no hover */}
                <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  style={{ background: color + "20", color, border: `1px solid ${color}40` }}>
                  Ver detalhes <ChevronRight size={10} />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* ── AUTOMAÇÃO DE RELACIONAMENTO ──────────── */}
      <section>
        <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
          <div>
            <p style={titleStyle}>Automação de Relacionamento</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>Gatilhos e ações automáticas · clique para ver detalhes e métricas</p>
          </div>
          <DevBadge dark={darkMode} section="Funil" />
        </div>
        <div className="space-y-3 mt-4">
          {automationSteps.map((step: any, i: number) => {
            const color = AUTO_COLORS[i]
            return (
              <button
                key={i}
                onClick={() => setSelectedAuto({ step, idx: i })}
                className="w-full text-left rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 group"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)"
                  e.currentTarget.style.boxShadow = `0 8px 28px ${color}18`
                  e.currentTarget.style.borderColor = color + "50"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)"
                  e.currentTarget.style.boxShadow = "none"
                  e.currentTarget.style.borderColor = cardBorder
                }}
              >
                {/* Número colorido único */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-white text-xs flex-shrink-0"
                  style={{ background: color }}>
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-[10px] font-semibold mb-0.5 ${labelClass}`}>Gatilho</p>
                      <p className={`text-sm font-bold ${valClass}`}>{step.trigger}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ background: color + "20", color }}>
                        {step.timing}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)", color: darkMode ? "rgba(255,255,255,0.55)" : "#4b5563" }}>
                        {step.canal}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-2 ${textClass}`}>{step.action}</p>

                  {/* Mini barra de taxa */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden"
                      style={{ background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)" }}>
                      <div className="h-full rounded-full" style={{ width: `${step.taxa}%`, background: color }} />
                    </div>
                    <span className="text-[10px] font-bold flex-shrink-0" style={{ color }}>{step.taxa}%</span>
                  </div>
                </div>

                {/* Ver detalhes — aparece no hover */}
                <div className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 self-center"
                  style={{ background: color + "20", color, border: `1px solid ${color}40` }}>
                  Ver detalhes <ChevronRight size={10} />
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Modais */}
      {selectedFunnel && (
        <FunnelDetailModal
          stage={selectedFunnel.stage}
          idx={selectedFunnel.idx}
          dark={darkMode}
          onClose={() => setSelectedFunnel(null)}
        />
      )}
      {selectedAuto && (
        <AutomationDetailModal
          step={selectedAuto.step}
          idx={selectedAuto.idx}
          dark={darkMode}
          onClose={() => setSelectedAuto(null)}
        />
      )}
    </div>
  )
}
