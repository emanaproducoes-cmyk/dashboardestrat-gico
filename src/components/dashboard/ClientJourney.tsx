import React, { useState, useEffect } from "react"
import { FileSignature, Send, CheckCircle2, Trophy, Flag, X, ArrowRight, Code2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts"
import { db } from "../../lib/firebase"
import { doc, onSnapshot } from "firebase/firestore"

export interface ClienteEtapa {
  title: string
  subtitle: string
  description: string
  iconKey: string
  color: string
  accent: string
  detail: {
    objetivo: string
    acoes: string[]
    kpis: { label: string; val: string; meta: string }[]
    barData: { mes: string; [k: string]: string | number }[]
    pieData: { name: string; value: number }[]
    insight: string
  }
}

const ICON_MAP: Record<string, React.FC<{ size?: number; className?: string }>> = {
  FileSignature, Send, CheckCircle2, Trophy, Flag
}

const DEFAULT_STEPS: ClienteEtapa[] = [
  {
    title: "Contrato", subtitle: "Fase de Recepção", iconKey: "FileSignature",
    color: "from-cyan-400 to-blue-500", accent: "#06b6d4",
    description: "Mensagem de boas-vindas e felicitações. Convite para seguir nossas redes sociais.",
    detail: {
      objetivo: "Criar conexão emocional desde o primeiro contato e ampliar audiência digital.",
      acoes: ["Mensagem personalizada de boas-vindas", "Convite para LinkedIn e YouTube", "Kit de boas-vindas digital", "E-mail de apresentação da equipe"],
      kpis: [{ label: "Taxa de abertura de e-mail", val: "68%", meta: "60%" }, { label: "Cliques nas redes sociais", val: "42%", meta: "35%" }, { label: "Novos seguidores captados", val: "18", meta: "15" }],
      barData: [{ mes: "Jan", captados: 14 }, { mes: "Fev", captados: 16 }, { mes: "Mar", captados: 18 }, { mes: "Abr", captados: 20 }, { mes: "Mai", captados: 17 }, { mes: "Jun", captados: 21 }],
      pieData: [{ name: "LinkedIn", value: 45 }, { name: "YouTube", value: 30 }, { name: "Instagram", value: 25 }],
      insight: "A fase de contrato tem o maior potencial de conversão em seguidores. Clientes recém-contratados têm 3x mais propensão a seguir nas redes."
    }
  },
  {
    title: "Protocolo", subtitle: "Projeto enviado ao Banco", iconKey: "Send",
    color: "from-blue-400 to-blue-600", accent: "#3b82f6",
    description: "Mensagem de reforço positivo. Convite para seguir nossas redes sociais.",
    detail: {
      objetivo: "Manter o cliente engajado durante o período de análise bancária e reforçar a confiança.",
      acoes: ["Atualização semanal do status", "Conteúdo educativo sobre FNO", "Webinar exclusivo para clientes", "Newsletter com cases de aprovação"],
      kpis: [{ label: "Satisfação do cliente", val: "4.8/5", meta: "4.5/5" }, { label: "Engajamento com conteúdo", val: "54%", meta: "45%" }, { label: "Redução de ansiedade (NPS)", val: "+22", meta: "+15" }],
      barData: [{ mes: "Jan", engajamento: 48 }, { mes: "Fev", engajamento: 51 }, { mes: "Mar", engajamento: 54 }, { mes: "Abr", engajamento: 56 }, { mes: "Mai", engajamento: 53 }, { mes: "Jun", engajamento: 58 }],
      pieData: [{ name: "Newsletter", value: 40 }, { name: "WhatsApp", value: 35 }, { name: "E-mail", value: 25 }],
      insight: "Clientes bem informados durante esta fase têm 40% menos cancelamentos e maior propensão a indicar novos clientes."
    }
  },
  {
    title: "Aprovação", subtitle: "Projeto aprovado", iconKey: "CheckCircle2",
    color: "from-blue-500 to-indigo-600", accent: "#6366f1",
    description: "Mensagem para celebrar e orientar implementação e próximo marco.",
    detail: {
      objetivo: "Celebrar a conquista e iniciar o processo de social proof com autorização do cliente.",
      acoes: ["Mensagem de congratulações personalizada", "Solicitação de depoimento em vídeo", "Publicação do case com autorização", "Convite para evento de celebração"],
      kpis: [{ label: "Taxa de aceite para depoimento", val: "72%", meta: "60%" }, { label: "Cases publicados", val: "3", meta: "4" }, { label: "Alcance do case publicado", val: "12K", meta: "8K" }],
      barData: [{ mes: "Jan", cases: 1 }, { mes: "Fev", cases: 1 }, { mes: "Mar", cases: 2 }, { mes: "Abr", cases: 2 }, { mes: "Mai", cases: 3 }, { mes: "Jun", cases: 3 }],
      pieData: [{ name: "Vídeo", value: 50 }, { name: "Texto", value: 30 }, { name: "Foto", value: 20 }],
      insight: "Casos aprovados são o melhor momento para captar prova social. 72% dos clientes aceitam dar depoimento quando abordados na aprovação."
    }
  },
  {
    title: "Conclusão", subtitle: "Projeto contratado", iconKey: "Trophy",
    color: "from-indigo-500 to-violet-600", accent: "#8b5cf6",
    description: "Mensagem de conquista e vitória, implementação e próximo marco.",
    detail: {
      objetivo: "Consolidar o relacionamento e identificar oportunidades de expansão do contrato.",
      acoes: ["Reunião de kickoff de implementação", "Apresentação do cronograma", "Conexão com parceiros operacionais", "Programa de fidelidade para clientes"],
      kpis: [{ label: "Taxa de expansão de contrato", val: "28%", meta: "20%" }, { label: "NPS pós-conclusão", val: "87", meta: "75" }, { label: "Indicações geradas", val: "6", meta: "4" }],
      barData: [{ mes: "Jan", indicacoes: 3 }, { mes: "Fev", indicacoes: 4 }, { mes: "Mar", indicacoes: 5 }, { mes: "Abr", indicacoes: 6 }, { mes: "Mai", indicacoes: 5 }, { mes: "Jun", indicacoes: 7 }],
      pieData: [{ name: "Indicações", value: 55 }, { name: "Expansão", value: 28 }, { name: "Renovação", value: 17 }],
      insight: "Esta fase tem o maior potencial de expansão de receita. Clientes satisfeitos indicam em média 2.3 novos clientes ao longo do relacionamento."
    }
  },
  {
    title: "Encerramento", subtitle: "Projeto concluído", iconKey: "Flag",
    color: "from-violet-500 to-purple-600", accent: "#a855f7",
    description: "Formalizar o encerramento, agradecer, convidar para social proof.",
    detail: {
      objetivo: "Transformar clientes encerrados em embaixadores da marca e gerar prova social duradoura.",
      acoes: ["Relatório final de resultados", "Vídeo de storytelling do caso", "Publicação no site 'Histórias que Transformam'", "Convite para eventos e palestras"],
      kpis: [{ label: "Taxa de social proof gerada", val: "65%", meta: "50%" }, { label: "Publicações no site", val: "2", meta: "3" }, { label: "Alcance total dos cases", val: "34K", meta: "25K" }],
      barData: [{ mes: "Jan", alcance: 18000 }, { mes: "Fev", alcance: 22000 }, { mes: "Mar", alcance: 28000 }, { mes: "Abr", alcance: 30000 }, { mes: "Mai", alcance: 32000 }, { mes: "Jun", alcance: 34000 }],
      pieData: [{ name: "Site", value: 40 }, { name: "LinkedIn", value: 35 }, { name: "YouTube", value: 25 }],
      insight: "Cases de encerramento bem produzidos geram autoridade de longo prazo. Um storytelling convincente pode atrair 5-10 novos leads qualificados por mês."
    }
  }
]

const PIE_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"]

export default function ClientJourney({ dark }: { dark?: boolean }) {
  const [steps, setSteps] = useState<ClienteEtapa[]>(DEFAULT_STEPS)
  const [selected, setSelected] = useState<ClienteEtapa | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const ref = doc(db, "planning", "main")
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        if (d.clienteJornada && Array.isArray(d.clienteJornada) && d.clienteJornada.length) {
          setSteps(d.clienteJornada)
        }
      }
    })
    return unsub
  }, [])

  const valC = dark ? "text-white" : "text-gray-900"
  const subC = dark ? "text-white/50" : "text-gray-500"

  return (
    <>
      <div>
        <div className="flex items-start justify-between mb-1">
          <div>
            <h2 className={`text-xl font-bold ${valC}`}>Gamificação do Ciclo do Cliente</h2>
            <p className={`text-sm mt-0.5 ${subC}`}>Clique em cada etapa para ver detalhes</p>
          </div>
          {/* Dev Mode badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg mt-1 flex-shrink-0"
            style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.22)" }}
            title="Para editar: Dev Mode → aba Jornada do Cliente"
          >
            <Code2 size={11} className="text-indigo-400" />
            <span className="text-[10px] text-indigo-400 font-semibold">Dev Mode → Jornada</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
          {steps.map((step, i) => {
            const Icon = ICON_MAP[step.iconKey] || FileSignature
            const isHov = hovered === i
            return (
              <div key={i} className="relative group">
                <div
                  className={`rounded-xl border p-5 transition-all duration-300 h-full flex flex-col cursor-pointer
                    ${dark ? "bg-white/10 border-white/10" : "bg-white border-gray-100"}
                    ${isHov ? (dark ? "bg-white/15 shadow-lg" : "shadow-lg") : ""}
                  `}
                  style={{
                    transform: isHov ? "translateY(-4px)" : "none",
                    borderColor: isHov ? `${step.accent}60` : undefined,
                    boxShadow: isHov ? `0 8px 24px ${step.accent}30` : undefined,
                    transition: "all 0.25s ease"
                  }}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(step)}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold ${dark ? "text-white/20" : "text-gray-300"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 className={`font-bold text-sm ${valC}`}>{step.title}</h3>
                  </div>
                  <p className="text-xs font-semibold mb-2" style={{ color: step.accent }}>{step.subtitle}</p>
                  <p className={`text-xs flex-1 ${subC}`}>{step.description}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold mt-3 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: step.accent }}>
                    Ver detalhes <ArrowRight size={11} />
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 text-gray-300 text-lg">→</div>
                )}
              </div>
            )
          })}
        </div>

        {/* Dev mode path hint */}
        <div className="flex items-center gap-2 mt-4 p-2.5 rounded-lg"
          style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.14)" }}>
          <Code2 size={12} className="text-indigo-400 flex-shrink-0" />
          <p className="text-[11px] text-indigo-400">
            Para editar etapas, textos e dados: <strong>Dev Mode → aba "Jornada do Cliente"</strong>. Dados salvos aparecem aqui em tempo real para todos os usuários.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100" style={{ background: `${selected.accent}12` }}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selected.color} flex items-center justify-center`}>
                  {React.createElement(ICON_MAP[selected.iconKey] || FileSignature, { size: 24, className: "text-white" })}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900">{selected.title}</h2>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: selected.accent }}>{selected.subtitle}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="rounded-xl p-4" style={{ background: `${selected.accent}10` }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: selected.accent }}>🎯 Objetivo da Fase</p>
                <p className="text-sm text-gray-700">{selected.detail.objetivo}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">Ações Estratégicas</p>
                <div className="grid grid-cols-2 gap-2">
                  {selected.detail.acoes.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5" style={{ background: selected.accent }}>{i + 1}</span>
                      <span className="text-xs text-gray-700">{a}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-700 mb-3">KPIs da Fase</p>
                <div className="space-y-2">
                  {selected.detail.kpis.map((k, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                      <span className="text-xs text-gray-600">{k.label}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-400">Meta: {k.meta}</span>
                        <span className="text-sm font-bold" style={{ color: selected.accent }}>{k.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">Evolução Mensal</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={selected.detail.barData} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Bar dataKey={Object.keys(selected.detail.barData[0]).find(k => k !== "mes")!} fill={selected.accent} radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">Distribuição por Canal</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={selected.detail.pieData} cx="50%" cy="50%" outerRadius={60} dataKey="value"
                        label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                        {selected.detail.pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-xl p-4 border-l-4" style={{ background: `${selected.accent}08`, borderColor: selected.accent }}>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: selected.accent }}>💡 Insight Estratégico</p>
                <p className="text-sm text-gray-700 leading-relaxed">{selected.detail.insight}</p>
              </div>

              {/* Dev Mode path inside modal */}
              <div className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.2)" }}>
                <Code2 size={13} className="text-indigo-500 flex-shrink-0" />
                <p className="text-xs text-indigo-500">
                  Edite esses dados em: <strong>Dev Mode → aba "Jornada do Cliente"</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
