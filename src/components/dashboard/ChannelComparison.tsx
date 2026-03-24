import React, { useState, useEffect, useRef } from "react"
import { X, TrendingUp, Users, MousePointerClick, FileText, ArrowRight, Info } from "lucide-react"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from "recharts"
import { usePlanningData } from "../../lib/PlanningDataContext"

// ─── DADOS BASE ───────────────────────────────────
const BASE_CHANNELS = [
  {
    id: "linkedin", name: "LinkedIn", score: 92, color: "#0077b5",
    followers: "+200", engagement: "4.2%", content: "48 posts", conversions: "30",
    monthlyData: [
      { mes: "Jan", seguidores: 12, engajamento: 3.8, conversoes: 4 },
      { mes: "Fev", seguidores: 18, engajamento: 4.0, conversoes: 5 },
      { mes: "Mar", seguidores: 22, engajamento: 4.2, conversoes: 6 },
      { mes: "Abr", seguidores: 30, engajamento: 4.5, conversoes: 5 },
      { mes: "Mai", seguidores: 28, engajamento: 4.1, conversoes: 5 },
      { mes: "Jun", seguidores: 35, engajamento: 4.3, conversoes: 5 },
    ],
    radarData: [
      { metric: "Alcance", val: 90 }, { metric: "Engajamento", val: 85 },
      { metric: "Conversão", val: 78 }, { metric: "Conteúdo", val: 92 }, { metric: "Autoridade", val: 95 },
    ],
    insight: "LinkedIn é o canal com maior ROI B2B. Engajamento acima de 4% indica conteúdo altamente relevante para o público-alvo.",
  },
  {
    id: "youtube", name: "YouTube", score: 88, color: "#ff4444",
    followers: "+500", engagement: "5.8%", content: "24 posts", conversions: "56",
    monthlyData: [
      { mes: "Jan", seguidores: 40, engajamento: 5.2, conversoes: 8 },
      { mes: "Fev", seguidores: 55, engajamento: 5.5, conversoes: 9 },
      { mes: "Mar", seguidores: 70, engajamento: 5.8, conversoes: 10 },
      { mes: "Abr", seguidores: 90, engajamento: 6.0, conversoes: 11 },
      { mes: "Mai", seguidores: 110, engajamento: 5.9, conversoes: 9 },
      { mes: "Jun", seguidores: 135, engajamento: 6.1, conversoes: 9 },
    ],
    radarData: [
      { metric: "Alcance", val: 88 }, { metric: "Engajamento", val: 92 },
      { metric: "Conversão", val: 85 }, { metric: "Conteúdo", val: 75 }, { metric: "Autoridade", val: 80 },
    ],
    insight: "YouTube apresenta maior volume de conversões. Vídeos educativos sobre FNO têm alta retenção e geram leads qualificados.",
  },
  {
    id: "instagram", name: "Instagram", score: 76, color: "#e1306c",
    followers: "+87", engagement: "3.1%", content: "120 posts", conversions: "22",
    monthlyData: [
      { mes: "Jan", seguidores: 10, engajamento: 2.8, conversoes: 3 },
      { mes: "Fev", seguidores: 14, engajamento: 3.0, conversoes: 4 },
      { mes: "Mar", seguidores: 16, engajamento: 3.1, conversoes: 3 },
      { mes: "Abr", seguidores: 18, engajamento: 3.2, conversoes: 4 },
      { mes: "Mai", seguidores: 15, engajamento: 3.0, conversoes: 4 },
      { mes: "Jun", seguidores: 14, engajamento: 3.1, conversoes: 4 },
    ],
    radarData: [
      { metric: "Alcance", val: 75 }, { metric: "Engajamento", val: 65 },
      { metric: "Conversão", val: 60 }, { metric: "Conteúdo", val: 90 }, { metric: "Autoridade", val: 70 },
    ],
    insight: "Instagram gera awareness e tráfego via Stories. Oportunidade de crescimento com Reels e conteúdo em vídeo curto.",
  },
  {
    id: "blog", name: "Blog/Website", score: 71, color: "#6b7280",
    followers: "N/A", engagement: "2.8%", content: "12 posts", conversions: "45",
    monthlyData: [
      { mes: "Jan", seguidores: 0, engajamento: 2.4, conversoes: 6 },
      { mes: "Fev", seguidores: 0, engajamento: 2.6, conversoes: 7 },
      { mes: "Mar", seguidores: 0, engajamento: 2.7, conversoes: 8 },
      { mes: "Abr", seguidores: 0, engajamento: 2.9, conversoes: 8 },
      { mes: "Mai", seguidores: 0, engajamento: 2.8, conversoes: 8 },
      { mes: "Jun", seguidores: 0, engajamento: 3.0, conversoes: 8 },
    ],
    radarData: [
      { metric: "Alcance", val: 65 }, { metric: "Engajamento", val: 60 },
      { metric: "Conversão", val: 80 }, { metric: "Conteúdo", val: 70 }, { metric: "Autoridade", val: 85 },
    ],
    insight: "Blog tem alta taxa de conversão orgânica via SEO. Publicações técnicas sobre FNO atraem leads no fundo de funil.",
  },
]

// Degradê por posição (cores do app: azul→roxo→rosa→âmbar)
const SCORE_GRADIENTS = [
  "linear-gradient(90deg,#3b82f6,#8b5cf6)",
  "linear-gradient(90deg,#8b5cf6,#ec4899)",
  "linear-gradient(90deg,#ec4899,#f97316)",
  "linear-gradient(90deg,#f97316,#eab308)",
  "linear-gradient(90deg,#06b6d4,#3b82f6)",
  "linear-gradient(90deg,#22c55e,#06b6d4)",
]

// ─── BARRA ANIMADA ────────────────────────────────
function AnimatedBar({ name, score, color, gradient, dark, rank, onClick }: {
  name: string; score: number; color: string; gradient: string; dark: boolean; rank: number; onClick: () => void
}) {
  const [width, setWidth] = useState(0)
  const [hov, setHov]     = useState(false)
  const ref               = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setWidth(score), 80 + rank * 60) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [score, rank])

  return (
    <div ref={ref}
      className="rounded-xl p-3 cursor-pointer transition-all duration-200"
      style={{
        background: hov ? color + "10" : (dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"),
        border: `1px solid ${hov ? color + "40" : (dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)")}`,
        transform: hov ? "translateX(4px)" : "none",
        boxShadow: hov ? `0 4px 18px ${color}18` : "none",
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
          <span className="text-xs font-semibold" style={{ color: dark ? "rgba(255,255,255,0.82)" : "#374151" }}>
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold" style={{ color }}>{score}</span>
          {hov && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
              style={{ background: color + "18", color }}>
              detalhes <ArrowRight size={8} />
            </span>
          )}
        </div>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden"
        style={{ background: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: gradient, boxShadow: hov ? `0 0 8px ${color}60` : "none" }} />
      </div>
    </div>
  )
}

// ─── DEV MODE BADGE ───────────────────────────────
function DevModeBadge({ dark }: { dark: boolean }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
        style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)" }}>
        <Info size={10} /> Editar dados
      </button>
      {show && (
        <div className="absolute right-0 top-8 z-30 rounded-xl p-3 shadow-2xl w-60"
          style={{ background: dark ? "#0a1628" : "#fff", border: "1px solid rgba(59,130,246,0.25)" }}>
          <p className="text-[10px] font-bold text-blue-400 mb-1.5 uppercase tracking-wider">Como editar scores</p>
          <div className="flex items-center gap-1.5 text-[11px] mb-2" style={{ color: dark ? "rgba(255,255,255,0.70)" : "#374151" }}>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Dev Mode</span>
            <ArrowRight size={10} className="text-blue-400" />
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Canais</span>
          </div>
          <p className="text-[10px]" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#6b7280" }}>
            Os scores são calculados automaticamente do progresso real de cada canal. Atualize os dados mensais para ver as barras se moverem.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── MAIN ─────────────────────────────────────────
export default function ChannelComparison({ dark }: { dark?: boolean }) {
  const { data: planningData } = usePlanningData()
  const [selected, setSelected] = useState<typeof BASE_CHANNELS[0] | null>(null)

  // Merge Dev Mode canais com dados base
  const canaisDevMode = planningData.canais.filter(c => c.ativo)
  const channels = BASE_CHANNELS.map(base => {
    const dev = canaisDevMode.find(c =>
      c.nome.toLowerCase().includes(base.name.toLowerCase()) ||
      base.name.toLowerCase().includes(c.nome.toLowerCase())
    )
    if (dev) {
      const lastVal = dev.dados_mensais?.[dev.dados_mensais.length - 1]?.valor || 0
      const pct = dev.meta_anual > 0 ? Math.min(Math.round((lastVal / dev.meta_anual) * 100), 100) : base.score
      return { ...base, score: pct, color: dev.cor || base.color, followers: `+${dev.meta_anual}` }
    }
    return base
  })

  // Canais extras do Dev Mode sem correspondência nos base
  const extraCanais = canaisDevMode.filter(c =>
    !BASE_CHANNELS.some(b =>
      c.nome.toLowerCase().includes(b.name.toLowerCase()) ||
      b.name.toLowerCase().includes(c.nome.toLowerCase())
    )
  ).map(c => {
    const lastVal = c.dados_mensais?.[c.dados_mensais.length - 1]?.valor || 0
    const pct = c.meta_anual > 0 ? Math.min(Math.round((lastVal / c.meta_anual) * 100), 100) : 50
    return {
      id: c.id, name: c.nome, score: pct, color: c.cor,
      followers: `+${c.meta_anual}`, engagement: "—", content: "—", conversions: "—",
      monthlyData: c.dados_mensais?.slice(0, 6).map(m => ({ mes: m.mes, seguidores: m.valor, engajamento: 0, conversoes: 0 })) || [],
      radarData: [
        { metric: "Alcance", val: pct }, { metric: "Engajamento", val: pct },
        { metric: "Conversão", val: pct }, { metric: "Conteúdo", val: pct }, { metric: "Autoridade", val: pct },
      ],
      insight: `Canal ${c.nome} — ${c.descricao || "Configure em Dev Mode → Canais"}`,
    }
  })

  const allChannels = [...channels, ...extraCanais]

  const valC  = dark ? "text-white"    : "text-gray-900"
  const subC  = dark ? "text-white/50" : "text-gray-500"
  const cardStyle: React.CSSProperties = {
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)",
    border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
  }

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-5 flex-wrap gap-2">
          <div>
            <h3 className={`font-bold text-xl ${valC}`}>Comparação de Performance dos Canais</h3>
            <p className={`text-xs mt-0.5 ${subC}`}>
              Score calculado do progresso real vs meta · clique em "Ver detalhes"
            </p>
          </div>
          <DevModeBadge dark={!!dark} />
        </div>

        {/* Score bars animadas com degradê */}
        <div className="rounded-2xl p-5 mb-5" style={cardStyle}>
          <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${subC}`}>Score Geral por Canal</p>
          <div className="space-y-2">
            {allChannels.map((ch, i) => (
              <AnimatedBar
                key={ch.id}
                name={ch.name}
                score={ch.score}
                color={ch.color}
                gradient={SCORE_GRADIENTS[i % SCORE_GRADIENTS.length]}
                dark={!!dark}
                rank={i}
                onClick={() => setSelected(ch as any)}
              />
            ))}
          </div>
          <p className={`text-center text-[10px] mt-3 ${dark ? "text-white/20" : "text-gray-300"}`}>
            Passe o mouse nas barras para ver detalhes · score = progresso vs meta anual
          </p>
        </div>

        {/* Cards dos canais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allChannels.map((ch, i) => {
            const [hov, setHov] = useState(false)
            return (
              <div key={ch.id}
                className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
                style={{
                  background: hov ? ch.color + "0e" : (dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"),
                  border: `1px solid ${hov ? ch.color + "45" : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)")}`,
                  transform: hov ? "translateY(-3px)" : "none",
                  boxShadow: hov ? `0 10px 32px ${ch.color}18` : "none",
                }}
                onMouseEnter={() => setHov(true)}
                onMouseLeave={() => setHov(false)}>

                {/* Score donut */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className={`font-bold text-sm ${valC}`}>{ch.name}</h4>
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none"
                        stroke={dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} strokeWidth="3.2" />
                      <circle cx="18" cy="18" r="15.9" fill="none"
                        stroke={ch.color} strokeWidth="3.2"
                        strokeDasharray={`${ch.score} 100`} strokeLinecap="round"
                        style={{ transition: "stroke-dasharray 0.9s ease" }} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold"
                      style={{ color: ch.color }}>{ch.score}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-1.5 mb-4">
                  {[
                    ["Seguidores",  ch.followers],
                    ["Engajamento", ch.engagement],
                    ["Conteúdo",    ch.content],
                    ["Conversões",  ch.conversions],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <span className={`text-xs ${subC}`}>{label}</span>
                      <span className={`text-xs font-semibold ${valC}`}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => setSelected(ch as any)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background: hov ? ch.color + "25" : ch.color + "12",
                    color: ch.color,
                    border: `1px solid ${ch.color}30`,
                  }}>
                  Ver detalhes <ArrowRight size={12} />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── MODAL ──────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />
          <div
            className="relative rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            style={{ background: dark ? "#0a1628" : "#ffffff" }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 sticky top-0 z-10"
              style={{
                background: dark ? "#0a1628" : "#ffffff",
                borderBottom: `1px solid ${selected.color}25`,
                backgroundImage: `linear-gradient(135deg,${selected.color}14,${selected.color}04)`,
              }}>
              <div>
                <h2 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>{selected.name}</h2>
                <p className={`text-sm mt-0.5 ${dark ? "text-white/50" : "text-gray-500"}`}>Performance detalhada — Ciclo 2026</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-full text-white font-bold text-sm"
                  style={{ background: `linear-gradient(135deg,${selected.color},${selected.color}aa)` }}>
                  Score {selected.score}
                </div>
                <button onClick={() => setSelected(null)}
                  className={`p-2 rounded-xl ${dark ? "bg-white/10 text-white" : "bg-gray-100 text-gray-600"}`}>
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Seguidores",  val: selected.followers,  icon: Users            },
                  { label: "Engajamento", val: selected.engagement, icon: TrendingUp        },
                  { label: "Conteúdo",    val: selected.content,    icon: FileText          },
                  { label: "Conversões",  val: selected.conversions,icon: MousePointerClick },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="rounded-xl p-4 text-center"
                    style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}>
                    <Icon size={18} className="mx-auto mb-2" style={{ color: selected.color }} />
                    <p className={`text-xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>{val}</p>
                    <p className={`text-xs mt-0.5 ${dark ? "text-white/45" : "text-gray-500"}`}>{label}</p>
                  </div>
                ))}
              </div>

              {/* Progresso */}
              <div className="rounded-xl p-4"
                style={{ background: selected.color + "0c", border: `1px solid ${selected.color}20` }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: selected.color }}>Progresso vs Meta</p>
                  <span className="text-lg font-extrabold" style={{ color: selected.color }}>{selected.score}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden"
                  style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${selected.score}%`, background: `linear-gradient(90deg,${selected.color}70,${selected.color})` }} />
                </div>
              </div>

              {/* Linha do tempo */}
              <div>
                <p className={`text-sm font-bold mb-3 ${dark ? "text-white/70" : "text-gray-700"}`}>
                  Evolução Mensal
                </p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selected.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.06)" : "#f0f0f0"} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.40)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.40)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.40)" : "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: dark ? "#0a1628" : "#fff", border: `1px solid ${selected.color}30`, borderRadius: 10, fontSize: 12, color: dark ? "#fff" : "#111" }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.55)" : "#6b7280" }} />
                    <Line yAxisId="left"  type="monotone" dataKey="engajamento" name="Engajamento %" stroke={selected.color} strokeWidth={2.5} dot={{ r: 4, fill: selected.color }} />
                    <Line yAxisId="right" type="monotone" dataKey="conversoes"  name="Conversões"   stroke="#22c55e"        strokeWidth={2}   dot={{ r: 4, fill: "#22c55e" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Radar */}
              <div>
                <p className={`text-sm font-bold mb-3 ${dark ? "text-white/70" : "text-gray-700"}`}>Radar de Competências</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={selected.radarData}>
                    <PolarGrid stroke={dark ? "rgba(255,255,255,0.10)" : "#e5e7eb"} />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: dark ? "rgba(255,255,255,0.55)" : "#6b7280" }} />
                    <Radar dataKey="val" stroke={selected.color} fill={selected.color} fillOpacity={0.2} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Insight */}
              <div className="rounded-xl p-4" style={{ background: selected.color + "10", borderLeft: `4px solid ${selected.color}` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: selected.color }}>💡 Insight Estratégico</p>
                <p className={`text-sm leading-relaxed ${dark ? "text-white/75" : "text-gray-700"}`}>{selected.insight}</p>
              </div>

              {/* Dev Mode path */}
              <div className="rounded-xl p-3 flex items-center gap-3"
                style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.20)" }}>
                <Info size={14} className="text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] font-bold text-blue-400 mb-0.5">Para editar os dados deste canal</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-blue-400">Dev Mode</span>
                    <ArrowRight size={9} className="text-blue-400" />
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-blue-500/20 text-blue-400">Canais</span>
                    <ArrowRight size={9} className="text-blue-400" />
                    <span className="text-[10px] text-blue-300">{selected.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
