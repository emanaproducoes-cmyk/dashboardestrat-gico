import React, { useState, useEffect } from "react"
import { Save, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import { db } from "../../lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import type { ClienteEtapa } from "../dashboard/ClientJourney"

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
      insight: "A fase de contrato tem o maior potencial de conversão em seguidores."
    }
  },
  {
    title: "Protocolo", subtitle: "Projeto enviado ao Banco", iconKey: "Send",
    color: "from-blue-400 to-blue-600", accent: "#3b82f6",
    description: "Mensagem de reforço positivo. Convite para seguir nossas redes sociais.",
    detail: {
      objetivo: "Manter o cliente engajado durante o período de análise bancária.",
      acoes: ["Atualização semanal do status", "Conteúdo educativo sobre FNO", "Webinar exclusivo para clientes", "Newsletter com cases de aprovação"],
      kpis: [{ label: "Satisfação do cliente", val: "4.8/5", meta: "4.5/5" }, { label: "Engajamento com conteúdo", val: "54%", meta: "45%" }, { label: "Redução de ansiedade (NPS)", val: "+22", meta: "+15" }],
      barData: [{ mes: "Jan", engajamento: 48 }, { mes: "Fev", engajamento: 51 }, { mes: "Mar", engajamento: 54 }, { mes: "Abr", engajamento: 56 }, { mes: "Mai", engajamento: 53 }, { mes: "Jun", engajamento: 58 }],
      pieData: [{ name: "Newsletter", value: 40 }, { name: "WhatsApp", value: 35 }, { name: "E-mail", value: 25 }],
      insight: "Clientes bem informados têm 40% menos cancelamentos."
    }
  },
  {
    title: "Aprovação", subtitle: "Projeto aprovado", iconKey: "CheckCircle2",
    color: "from-blue-500 to-indigo-600", accent: "#6366f1",
    description: "Mensagem para celebrar e orientar implementação e próximo marco.",
    detail: {
      objetivo: "Celebrar a conquista e iniciar o processo de social proof.",
      acoes: ["Mensagem de congratulações personalizada", "Solicitação de depoimento em vídeo", "Publicação do case com autorização", "Convite para evento de celebração"],
      kpis: [{ label: "Taxa de aceite para depoimento", val: "72%", meta: "60%" }, { label: "Cases publicados", val: "3", meta: "4" }, { label: "Alcance do case publicado", val: "12K", meta: "8K" }],
      barData: [{ mes: "Jan", cases: 1 }, { mes: "Fev", cases: 1 }, { mes: "Mar", cases: 2 }, { mes: "Abr", cases: 2 }, { mes: "Mai", cases: 3 }, { mes: "Jun", cases: 3 }],
      pieData: [{ name: "Vídeo", value: 50 }, { name: "Texto", value: 30 }, { name: "Foto", value: 20 }],
      insight: "72% dos clientes aceitam dar depoimento quando abordados na aprovação."
    }
  },
  {
    title: "Conclusão", subtitle: "Projeto contratado", iconKey: "Trophy",
    color: "from-indigo-500 to-violet-600", accent: "#8b5cf6",
    description: "Mensagem de conquista e vitória, implementação e próximo marco.",
    detail: {
      objetivo: "Consolidar o relacionamento e identificar oportunidades de expansão.",
      acoes: ["Reunião de kickoff de implementação", "Apresentação do cronograma", "Conexão com parceiros operacionais", "Programa de fidelidade para clientes"],
      kpis: [{ label: "Taxa de expansão de contrato", val: "28%", meta: "20%" }, { label: "NPS pós-conclusão", val: "87", meta: "75" }, { label: "Indicações geradas", val: "6", meta: "4" }],
      barData: [{ mes: "Jan", indicacoes: 3 }, { mes: "Fev", indicacoes: 4 }, { mes: "Mar", indicacoes: 5 }, { mes: "Abr", indicacoes: 6 }, { mes: "Mai", indicacoes: 5 }, { mes: "Jun", indicacoes: 7 }],
      pieData: [{ name: "Indicações", value: 55 }, { name: "Expansão", value: 28 }, { name: "Renovação", value: 17 }],
      insight: "Clientes satisfeitos indicam em média 2.3 novos clientes."
    }
  },
  {
    title: "Encerramento", subtitle: "Projeto concluído", iconKey: "Flag",
    color: "from-violet-500 to-purple-600", accent: "#a855f7",
    description: "Formalizar o encerramento, agradecer, convidar para social proof.",
    detail: {
      objetivo: "Transformar clientes encerrados em embaixadores da marca.",
      acoes: ["Relatório final de resultados", "Vídeo de storytelling do caso", "Publicação no site 'Histórias que Transformam'", "Convite para eventos e palestras"],
      kpis: [{ label: "Taxa de social proof gerada", val: "65%", meta: "50%" }, { label: "Publicações no site", val: "2", meta: "3" }, { label: "Alcance total dos cases", val: "34K", meta: "25K" }],
      barData: [{ mes: "Jan", alcance: 18000 }, { mes: "Fev", alcance: 22000 }, { mes: "Mar", alcance: 28000 }, { mes: "Abr", alcance: 30000 }, { mes: "Mai", alcance: 32000 }, { mes: "Jun", alcance: 34000 }],
      pieData: [{ name: "Site", value: 40 }, { name: "LinkedIn", value: 35 }, { name: "YouTube", value: 25 }],
      insight: "Um storytelling convincente pode atrair 5-10 novos leads qualificados por mês."
    }
  }
]

const ICON_OPTIONS = ["FileSignature", "Send", "CheckCircle2", "Trophy", "Flag", "Star", "Heart", "Zap"]

export default function DevClientJourney({ dark }: { dark?: boolean }) {
  const [steps, setSteps]       = useState<ClienteEtapa[]>(DEFAULT_STEPS)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  const valC   = dark ? "text-white" : "text-gray-900"
  const subC   = dark ? "text-white/50" : "text-gray-500"
  const inp    = dark
    ? "bg-white/5 border-white/10 text-white placeholder-white/30 focus:border-indigo-400"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400"
  const cardBg = dark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"

  useEffect(() => {
    const ref = doc(db, "planning", "main")
    getDoc(ref).then(snap => {
      if (snap.exists() && snap.data().clienteJornada?.length) {
        setSteps(snap.data().clienteJornada)
      }
    })
  }, [])

  const updateStep = (i: number, field: keyof ClienteEtapa, val: string) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  const updateDetail = (i: number, field: keyof ClienteEtapa["detail"], val: string) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, detail: { ...s.detail, [field]: val } } : s))
  }

  const updateAcao = (si: number, ai: number, val: string) => {
    setSteps(prev => prev.map((s, idx) => {
      if (idx !== si) return s
      const newAcoes = [...s.detail.acoes]; newAcoes[ai] = val
      return { ...s, detail: { ...s.detail, acoes: newAcoes } }
    }))
  }

  const updateKpi = (si: number, ki: number, field: "label" | "val" | "meta", val: string) => {
    setSteps(prev => prev.map((s, idx) => {
      if (idx !== si) return s
      const newKpis = s.detail.kpis.map((k, kIdx) => kIdx === ki ? { ...k, [field]: val } : k)
      return { ...s, detail: { ...s.detail, kpis: newKpis } }
    }))
  }

  const save = async () => {
    setSaving(true)
    try {
      const ref = doc(db, "planning", "main")
      const snap = await getDoc(ref)
      const current = snap.exists() ? snap.data() : {}
      await setDoc(ref, { ...current, clienteJornada: steps })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className={`font-bold text-base ${valC}`}>Jornada do Cliente</h3>
        <p className={`text-xs mt-0.5 ${subC}`}>
          Firestore: <code className="text-indigo-400">planning/main → clienteJornada</code>
        </p>
      </div>

      {steps.map((step, i) => (
        <div key={i} className={`rounded-xl border overflow-hidden ${cardBg}`} style={{ borderLeft: `4px solid ${step.accent}` }}>
          <button
            className="w-full flex items-center justify-between p-4 text-left"
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ background: step.accent }}>{i + 1}</span>
              <div>
                <span className={`font-semibold text-sm ${valC}`}>{step.title}</span>
                <span className={`text-xs ml-2 ${subC}`}>{step.subtitle}</span>
              </div>
            </div>
            {expanded === i ? <ChevronUp size={15} className={subC} /> : <ChevronDown size={15} className={subC} />}
          </button>

          {expanded === i && (
            <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" }}>
              <div className="pt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Título</label>
                  <input className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                    value={step.title} onChange={e => updateStep(i, "title", e.target.value)} />
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Subtítulo</label>
                  <input className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                    value={step.subtitle} onChange={e => updateStep(i, "subtitle", e.target.value)} />
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Cor accent</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                      value={step.accent} onChange={e => updateStep(i, "accent", e.target.value)} />
                    <input className={`flex-1 rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                      value={step.accent} onChange={e => updateStep(i, "accent", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Ícone</label>
                  <select className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                    value={step.iconKey} onChange={e => updateStep(i, "iconKey", e.target.value)}>
                    {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Descrição do card</label>
                <textarea className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 resize-none ${inp}`}
                  rows={2} value={step.description} onChange={e => updateStep(i, "description", e.target.value)} />
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Objetivo da fase</label>
                <textarea className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 resize-none ${inp}`}
                  rows={2} value={step.detail.objetivo} onChange={e => updateDetail(i, "objetivo", e.target.value)} />
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Ações Estratégicas</label>
                <div className="mt-1 space-y-1.5">
                  {step.detail.acoes.map((a, ai) => (
                    <input key={ai} className={`w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                      value={a} onChange={e => updateAcao(i, ai, e.target.value)} />
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>KPIs</label>
                <div className="mt-1 space-y-2">
                  {step.detail.kpis.map((k, ki) => (
                    <div key={ki} className="grid grid-cols-3 gap-2">
                      <input className={`rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        placeholder="Label" value={k.label} onChange={e => updateKpi(i, ki, "label", e.target.value)} />
                      <input className={`rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        placeholder="Valor" value={k.val} onChange={e => updateKpi(i, ki, "val", e.target.value)} />
                      <input className={`rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 ${inp}`}
                        placeholder="Meta" value={k.meta} onChange={e => updateKpi(i, ki, "meta", e.target.value)} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-semibold uppercase tracking-wider ${subC}`}>Insight Estratégico</label>
                <textarea className={`mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none focus:ring-1 focus:ring-indigo-400 resize-none ${inp}`}
                  rows={2} value={step.detail.insight} onChange={e => updateDetail(i, "insight", e.target.value)} />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={save}
        disabled={saving}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all"
        style={{ background: saved ? "rgba(16,185,129,0.15)" : "rgba(99,102,241,0.15)", color: saved ? "#34d399" : "#818cf8" }}
      >
        {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
        {saving ? "Salvando..." : saved ? "✓ Salvo para todos os usuários!" : "Salvar Alterações"}
      </button>
    </div>
  )
}
