import type { PageProps } from "../lib/types"
import React from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import ClientJourney from "../components/dashboard/ClientJourney"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useFontSettings } from "../lib/FontSettingsContext"

const funnelData = [
  { stage: "Awareness", count: 1200, color: "#3b82f6", pct: 100 },
  { stage: "Interesse", count: 480, color: "#6366f1", pct: 40 },
  { stage: "Consideração", count: 120, color: "#8b5cf6", pct: 10 },
  { stage: "Intenção", count: 48, color: "#a855f7", pct: 4 },
  { stage: "Conversão", count: 22, color: "#ec4899", pct: 1.8 },
]

const conversionByChannel = [
  { canal: "LinkedIn", conversoes: 3, leads: 18, color: "#3b82f6" },
  { canal: "YouTube", conversoes: 4, leads: 22, color: "#ef4444" },
  { canal: "Instagram", conversoes: 22, leads: 60, color: "#ec4899" },
  { canal: "Indicações", conversoes: 12, leads: 14, color: "#10b981" },
  { canal: "Blog/SEO", conversoes: 2, leads: 8, color: "#64748b" },
]

const automationSteps = [
  { trigger: "Novo contrato assinado", action: "Envio de mensagem de boas-vindas + convite para redes", timing: "Imediato" },
  { trigger: "Projeto protocolar no banco", action: "Mensagem de reforço positivo + dica da etapa", timing: "Mesmo dia" },
  { trigger: "Projeto aprovado", action: "Mensagem de celebração + orientações de implementação", timing: "Imediato" },
  { trigger: "Projeto contratado", action: "Mensagem de conquista + próximos passos", timing: "Imediato" },
  { trigger: "Projeto concluído", action: "Agradecimento + convite para depoimento", timing: "3 dias após" },
]

export default function Funil({ darkMode = false }: PageProps) {
  const { fontSettings } = useFontSettings()

  const bg = "min-h-screen p-6 md:p-8 space-y-8" + (darkMode ? "" : " bg-gray-50")
  const cardBg = darkMode ? "bg-white/10 border border-white/10 rounded-2xl p-6" : "bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
  const textClass = darkMode ? "text-white/70" : "text-gray-600"
  const labelClass = darkMode ? "text-white/40" : "text-gray-400"
  const valClass = darkMode ? "text-white" : "text-gray-900"

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

  return (
    <div className={bg}>
      <HeroHeader />

      <section className={cardBg}>
        <ClientJourney dark={darkMode} />
      </section>

      <section>
        <p style={titleStyle}>Funil de Conversão</p>
        <p style={subStyle}>Do awareness à conversão — visão do funil completo</p>
        <div className="space-y-3">
          {funnelData.map((stage, i) => (
            <div key={i} className={`${cardBg} flex items-center gap-4`}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-white flex-shrink-0 text-sm"
                style={{ backgroundColor: stage.color }}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-bold text-sm ${valClass}`}>{stage.stage}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs ${labelClass}`}>{stage.pct}%</span>
                    <span className={`text-sm font-bold ${valClass}`}>{stage.count.toLocaleString()}</span>
                  </div>
                </div>
                <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${stage.pct}%`, backgroundColor: stage.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={cardBg}>
        <p style={titleStyle}>Conversões por Canal</p>
        <p style={subStyle}>Leads e conversões por origem em 2026</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={conversionByChannel}>
            <XAxis dataKey="canal" tick={{ fontSize: 11, fill: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: darkMode ? 'rgba(255,255,255,0.4)' : '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
            <Bar dataKey="leads" name="Leads" radius={[4, 4, 0, 0]} fill="#e2e8f0">
              {conversionByChannel.map((d, i) => <Cell key={i} fill={d.color + "40"} />)}
            </Bar>
            <Bar dataKey="conversoes" name="Conversões" radius={[4, 4, 0, 0]}>
              {conversionByChannel.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section>
        <p style={titleStyle}>Automação de Relacionamento</p>
        <p style={subStyle}>Gatilhos e ações automáticas em cada etapa da jornada</p>
        <div className="space-y-3">
          {automationSteps.map((step, i) => (
            <div key={i} className={`${cardBg} flex items-start gap-4`}>
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold mb-0.5 ${labelClass}`}>Gatilho</p>
                    <p className={`text-sm font-bold ${valClass}`}>{step.trigger}</p>
                  </div>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                    {step.timing}
                  </span>
                </div>
                <p className={`text-xs mt-2 ${textClass}`}>{step.action}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
