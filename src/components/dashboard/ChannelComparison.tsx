import React, { useState } from "react"
import { X, TrendingUp, Users, MousePointerClick, FileText, ArrowRight } from "lucide-react"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, Legend } from "recharts"

const channels = [
  {
    name: "LinkedIn", score: 92, followers: "+200", engagement: "4.2%", content: "48 posts", conversions: "30",
    color: "from-blue-500 to-blue-700", bg: "bg-blue-50", accent: "#3b82f6",
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
    insight: "LinkedIn é o canal com maior ROI B2B. O engajamento acima de 4% indica conteúdo altamente relevante para o público-alvo.",
  },
  {
    name: "YouTube", score: 88, followers: "+500", engagement: "5.8%", content: "24 posts", conversions: "56",
    color: "from-red-500 to-red-700", bg: "bg-red-50", accent: "#ef4444",
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
    insight: "YouTube apresenta o maior volume de conversões. Vídeos educativos sobre FNO têm alta taxa de retenção e geram leads qualificados.",
  },
  {
    name: "Instagram", score: 76, followers: "+87", engagement: "3.1%", content: "120 posts", conversions: "22",
    color: "from-pink-500 to-purple-600", bg: "bg-pink-50", accent: "#ec4899",
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
    insight: "Instagram gera awareness e tráfego qualificado via Stories. Oportunidade de crescimento com reels e conteúdo em vídeo curto.",
  },
  {
    name: "Blog/Website", score: 71, followers: "N/A", engagement: "2.8%", content: "12 posts", conversions: "45",
    color: "from-gray-500 to-gray-700", bg: "bg-gray-50", accent: "#6b7280",
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
    insight: "Blog tem alta taxa de conversão orgânica via SEO. Publicações técnicas sobre FNO atraem leads no fundo de funil com alta intenção de compra.",
  },
]

const compareBarData = channels.map(c => ({ name: c.name, score: c.score }))

export default function ChannelComparison({ dark }: { dark?: boolean }) {
  const [selected, setSelected] = useState<typeof channels[0] | null>(null)

  const cardBase = dark ? "bg-white/10 border-white/10" : "border-gray-100"
  const valC = dark ? "text-white" : "text-gray-900"
  const subC = dark ? "text-white/50" : "text-gray-500"

  return (
    <>
      <div>
        <h3 className={`font-bold mb-1 text-xl ${valC}`}>Comparação de Performance dos Canais</h3>
        <p className={`text-xs mb-6 ${subC}`}>Análise comparativa entre todos os canais de marketing — clique em "Ver detalhes"</p>

        <div className={`rounded-xl border p-4 mb-5 ${dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
          <p className={`text-xs font-semibold mb-3 uppercase tracking-wider ${subC}`}>Score Geral por Canal</p>
          <ResponsiveContainer width="100%" height={80}>
            <BarChart data={compareBarData} layout="vertical" margin={{ left: 0, right: 30 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: dark ? '#fff' : '#374151' }} width={90} />
              <Bar dataKey="score" radius={6} fill={dark ? '#6366f1' : '#4f46e5'} label={{ position: 'right', fontSize: 11, fill: dark ? '#fff' : '#374151' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((ch) => (
            <div key={ch.name} className={`rounded-xl p-5 border group cursor-pointer hover:scale-[1.02] transition-all duration-200 ${dark ? `bg-white/10 ${cardBase}` : `${ch.bg} border-gray-100`}`}>
              <div className="flex items-center justify-between mb-4">
                <h4 className={`font-bold ${valC}`}>{ch.name}</h4>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ch.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{ch.score}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                {[["Seguidores", ch.followers], ["Engajamento", ch.engagement], ["Conteúdo", ch.content], ["Conversões", ch.conversions]].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className={subC}>{label}</span>
                    <span className={`font-semibold ${valC}`}>{val}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelected(ch)}
                className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: ch.accent }}
              >
                Ver detalhes <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100" style={{ background: `linear-gradient(135deg, ${selected.accent}20, ${selected.accent}05)` }}>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">{selected.name}</h2>
                <p className="text-sm text-gray-500 mt-0.5">Performance detalhada — Ciclo 2026</p>
              </div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-full text-white font-bold text-sm bg-gradient-to-r ${selected.color}`}>Score {selected.score}</div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Seguidores", val: selected.followers, icon: Users },
                  { label: "Engajamento", val: selected.engagement, icon: TrendingUp },
                  { label: "Conteúdo", val: selected.content, icon: FileText },
                  { label: "Conversões", val: selected.conversions, icon: MousePointerClick },
                ].map(({ label, val, icon: Icon }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-4 text-center">
                    <Icon size={18} className="mx-auto mb-2" style={{ color: selected.accent }} />
                    <p className="text-xl font-extrabold text-gray-900">{val}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Evolução Mensal — Engajamento & Conversões</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={selected.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="engajamento" name="Engajamento %" stroke={selected.accent} strokeWidth={2} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="conversoes" name="Conversões" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Radar de Competências</p>
                <ResponsiveContainer width="100%" height={220}>
                  <RadarChart data={selected.radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                    <Radar dataKey="val" stroke={selected.accent} fill={selected.accent} fillOpacity={0.25} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl p-4 border-l-4" style={{ background: `${selected.accent}10`, borderColor: selected.accent }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: selected.accent }}>💡 Insight Estratégico</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.insight}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
