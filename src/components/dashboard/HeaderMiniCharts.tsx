import React, { useState } from "react"
import { BarChart, Bar, Cell, XAxis, ResponsiveContainer, Tooltip } from "recharts"
import { CheckCircle2, Clock, Circle, X, ChevronRight, Calendar, BarChart2 } from "lucide-react"

const ACOES = [
  { id: 1, periodo: "Abril", titulo: 'Lançamento LinkedIn', objetivo: 'Habilitar novo canal do mixchannel e iniciar crescimento orgânico qualificado.', canal: 'LinkedIn', status: 'done' },
  { id: 2, periodo: "Abril", titulo: 'Lançamento YouTube', objetivo: 'Humanizar a marca mostrando bastidores, rotinas e processos.', canal: 'YouTube', status: 'done' },
  { id: 3, periodo: "Abril", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Converter clientes ativos em seguidores nos canais digitais.', canal: 'IG/LI/YT', status: 'done' },
  { id: 4, periodo: "Abril", titulo: 'Bastidores e Reposts', objetivo: 'Aumentar presença e autoridade humana com bastidores, inaugurações e antes/depois.', canal: 'Instagram', status: 'done' },
  { id: 5, periodo: "Maio", titulo: 'Série "Métodos & Crescimento"', objetivo: 'Educar funil topo/meio e reforçar método AF (OKR Autoridade).', canal: 'IG/LI', status: 'done' },
  { id: 6, periodo: "Maio", titulo: 'Série "Conexão Regional"', objetivo: 'Cumprir meta de 1 vídeo longo/mês + Shorts 2x/sem para Prova Social e Autoridade.', canal: 'IG/LI', status: 'done' },
  { id: 7, periodo: "Maio", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Converter clientes em seguidores via WhatsApp e e-mail marketing.', canal: 'IG/LI/YT', status: 'done' },
  { id: 8, periodo: "Maio", titulo: 'Gamificação "Jornada do Cliente"', objetivo: 'Criar mensagens-chave enviadas aos clientes durante o processo da jornada.', canal: 'WhatsApp', status: 'in_progress' },
  { id: 9, periodo: "Jun/Jul", titulo: 'Série "Métodos & Crescimento"', objetivo: 'Publicar pílulas de conhecimento semanalmente no LinkedIn e Instagram.', canal: 'IG/LI', status: 'in_progress' },
  { id: 10, periodo: "Jun/Jul", titulo: 'Série "Conexão Regional"', objetivo: 'Subir 1 vídeo longo por mês com recortes para Shorts e Reels.', canal: 'YouTube', status: 'in_progress' },
  { id: 11, periodo: "Jun/Jul", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Disparos via WhatsApp e e-mail focados em retenção e comunidade.', canal: 'IG/LI/YT', status: 'pending' },
  { id: 12, periodo: "Jun/Jul", titulo: 'Provas Sociais', objetivo: 'Início das captações de cases de sucesso para gerar autoridade.', canal: 'Todos', status: 'pending' },
  { id: 13, periodo: "Ago/Out", titulo: 'Blog "O Especialista"', objetivo: 'Criação de conteúdos especializados para atração de empresários via SEO.', canal: 'Blog/Site', status: 'pending' },
  { id: 14, periodo: "Ago/Out", titulo: 'Lançamento "Histórias que Transformam"', objetivo: 'Narrativa visual antes/depois para nova seção de cases no site.', canal: 'Site/Redes', status: 'pending' },
  { id: 15, periodo: "Ago/Out", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Automatizar disparos de mensagens no momento da entrega do protocolo.', canal: 'IG/LI/YT', status: 'pending' },
  { id: 16, periodo: "Ago/Out", titulo: 'Provas Sociais', objetivo: 'Gravar depoimentos presenciais ou remotos com clientes selecionados.', canal: 'YouTube', status: 'pending' },
  { id: 17, periodo: "Nov/Dez", titulo: 'Análise de KPIs e Resultados Anuais', objetivo: 'Mensurar o sucesso das estratégias de 2026 e guiar o planejamento de 2027.', canal: 'Interno', status: 'pending' },
  { id: 18, periodo: "Nov/Dez", titulo: 'Lançamento dos Vídeos Storytelling', objetivo: 'Consolidar a Prova Social com os 3 vídeos "Histórias que Transformam".', canal: 'YouTube/LI', status: 'pending' },
  { id: 19, periodo: "Nov/Dez", titulo: 'Retrospectiva "Especialista AF"', objetivo: 'Reforçar posicionamento de marca celebrando conquistas do ano.', canal: 'Todos', status: 'pending' },
  { id: 20, periodo: "Nov/Dez", titulo: 'Manutenção e SEO do Blog/Site', objetivo: 'Otimizar indexação dos conteúdos técnicos para manter a AF como referência em FNO.', canal: 'Blog/Site', status: 'pending' },
]

const PERIODOS = [
  { label: "Abril", acoes: ACOES.filter(a => a.periodo === "Abril") },
  { label: "Maio", acoes: ACOES.filter(a => a.periodo === "Maio") },
  { label: "Jun/Jul", acoes: ACOES.filter(a => a.periodo === "Jun/Jul") },
  { label: "Ago/Out", acoes: ACOES.filter(a => a.periodo === "Ago/Out") },
  { label: "Nov/Dez", acoes: ACOES.filter(a => a.periodo === "Nov/Dez") },
]

const CANAIS = [
  { canal: "LinkedIn", planejado: 8, executado: 5, color: "#60a5fa" },
  { canal: "YouTube", planejado: 6, executado: 3, color: "#f87171" },
  { canal: "Instagram", planejado: 7, executado: 4, color: "#a78bfa" },
  { canal: "Blog/SEO", planejado: 4, executado: 1, color: "#fbbf24" },
]

const CUMULATIVO = [
  { mes: "Abr", total: 4 }, { mes: "Mai", total: 8 }, { mes: "Jun", total: 10 },
  { mes: "Jul", total: 12 }, { mes: "Ago", total: 13 }, { mes: "Set", total: 14 },
  { mes: "Out", total: 16 }, { mes: "Nov", total: 18 }, { mes: "Dez", total: 20 },
]

const StatusIcon = ({ status, size = 10 }: { status: string; size?: number }) =>
  status === 'done' ? <CheckCircle2 size={size} className="text-emerald-400 flex-shrink-0" />
  : status === 'in_progress' ? <Clock size={size} className="text-blue-400 flex-shrink-0" />
  : <Circle size={size} className="text-white/20 flex-shrink-0" />

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900/95 border border-white/20 rounded-lg px-3 py-2 text-xs text-white shadow-xl pointer-events-none">
      <p className="font-bold mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || p.fill || '#fff' }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

function DetailModal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold text-base">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function HeaderMiniCharts() {
  const [modal, setModal] = useState<'execucao' | 'periodos' | 'canais' | null>(null)
  const concluidas = ACOES.filter(a => a.status === 'done').length
  const emAndamento = ACOES.filter(a => a.status === 'in_progress').length
  const pct = Math.round((concluidas / ACOES.length) * 100)

  return (
    <>
      <div className="grid grid-cols-3 gap-3 mt-5">

        {/* CARD 1 — Progresso */}
        <div className="bg-white/10 border border-white/15 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-white/[0.16] hover:scale-[1.02] hover:border-white/30 group" onClick={() => setModal('execucao')}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Progresso das Ações</p>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/20 rounded-full px-2 py-0.5">{pct}%</span>
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <p className="text-2xl font-extrabold text-white leading-none">{concluidas}</p>
            <p className="text-white/40 text-[10px]">de {ACOES.length} ações concluídas</p>
          </div>
          <div className="flex items-end gap-1 mb-2 h-10">
            {CUMULATIVO.map((c, i) => {
              const prev = i === 0 ? 0 : CUMULATIVO[i - 1].total
              const novas = c.total - prev
              const done = c.total <= concluidas
              const active = !done && c.total <= concluidas + emAndamento
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5 justify-end">
                  <div className="w-full rounded-t-sm" style={{
                    height: `${novas * 10}px`,
                    background: done ? '#34d399' : active ? '#60a5fa' : 'rgba(255,255,255,0.12)'
                  }} />
                  <span className="text-[7px] text-white/35">{c.mes}</span>
                </div>
              )
            })}
          </div>
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-blue-400" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[9px] text-white/30 mt-1.5 group-hover:text-white/50 flex items-center gap-0.5 transition-colors">Ver todas as ações <ChevronRight size={8} /></p>
        </div>

        {/* CARD 2 — Calendário */}
        <div className="bg-white/10 border border-white/15 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-white/[0.16] hover:scale-[1.02] hover:border-white/30 group" onClick={() => setModal('periodos')}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Calendário de Ações</p>
            <Calendar size={11} className="text-blue-300" />
          </div>
          <div className="space-y-1.5">
            {PERIODOS.map((p, i) => {
              const done = p.acoes.filter(a => a.status === 'done').length
              const inProg = p.acoes.filter(a => a.status === 'in_progress').length
              return (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[9px] text-white/60 w-12 flex-shrink-0 font-semibold">{p.label}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden flex">
                    <div className="h-full bg-emerald-400/80" style={{ width: `${(done / p.acoes.length) * 100}%` }} />
                    <div className="h-full bg-blue-400/70" style={{ width: `${(inProg / p.acoes.length) * 100}%` }} />
                  </div>
                  <span className="text-[9px] font-bold text-white/70 w-7 text-right flex-shrink-0">{done}/{p.acoes.length}</span>
                  <StatusIcon status={done === p.acoes.length ? 'done' : inProg > 0 ? 'in_progress' : 'pending'} />
                </div>
              )
            })}
          </div>
          <p className="text-[9px] text-white/30 mt-2 group-hover:text-white/50 flex items-center gap-0.5 transition-colors">Ver cronograma completo <ChevronRight size={8} /></p>
        </div>

        {/* CARD 3 — Canais */}
        <div className="bg-white/10 border border-white/15 rounded-xl p-3 cursor-pointer transition-all duration-200 hover:bg-white/[0.16] hover:scale-[1.02] hover:border-white/30 group" onClick={() => setModal('canais')}>
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Ações por Canal</p>
            <BarChart2 size={11} className="text-violet-300" />
          </div>
          <div className="h-[76px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CANAIS} margin={{ top: 2, right: 0, bottom: 0, left: -25 }} barCategoryGap="25%">
                <XAxis dataKey="canal" tick={{ fontSize: 7, fill: 'rgba(255,255,255,0.45)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="planejado" name="Planejado" fill="rgba(255,255,255,0.12)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="executado" name="Executado" radius={[2, 2, 0, 0]}>
                  {CANAIS.map((c, i) => <Cell key={i} fill={c.color} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 flex-wrap mt-0.5">
            {CANAIS.map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: c.color }} />
                <span className="text-[8px] text-white/45">{c.canal} {c.executado}/{c.planejado}</span>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-white/30 mt-1 group-hover:text-white/50 flex items-center gap-0.5 transition-colors">Ver detalhes por canal <ChevronRight size={8} /></p>
        </div>
      </div>

      {/* MODAL 1 — Execução */}
      {modal === 'execucao' && (
        <DetailModal title="📋 Plano de Ação 2026 — 20 Ações" onClose={() => setModal(null)}>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Concluídas", val: concluidas, color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" },
              { label: "Em andamento", val: emAndamento, color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/20" },
              { label: "Pendentes", val: ACOES.length - concluidas - emAndamento, color: "text-white/50", bg: "bg-white/5 border-white/10" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} border rounded-xl p-3 text-center`}>
                <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
                <p className="text-[10px] text-white/50 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {ACOES.map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white/40 bg-white/10 flex-shrink-0 mt-0.5">{a.id}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-xs font-semibold text-white">{a.titulo}</p>
                    <span className="text-[9px] text-white/30">{a.periodo}</span>
                  </div>
                  <p className="text-[10px] text-white/50 leading-relaxed">{a.objetivo}</p>
                  <span className="inline-block text-[9px] bg-white/10 rounded px-1.5 py-0.5 text-white/40 mt-1">{a.canal}</span>
                </div>
                <StatusIcon status={a.status} size={14} />
              </div>
            ))}
          </div>
        </DetailModal>
      )}

      {/* MODAL 2 — Calendário */}
      {modal === 'periodos' && (
        <DetailModal title="📅 Cronograma de Execução 2026" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {PERIODOS.map((p, i) => {
              const done = p.acoes.filter(a => a.status === 'done').length
              const gradients = ['from-blue-600 to-blue-800', 'from-violet-600 to-violet-800', 'from-cyan-600 to-cyan-800', 'from-amber-600 to-orange-700', 'from-rose-600 to-rose-800']
              return (
                <div key={i} className="rounded-xl border border-white/10 overflow-hidden">
                  <div className={`bg-gradient-to-r ${gradients[i]} px-4 py-2.5 flex items-center justify-between`}>
                    <span className="font-bold text-white text-sm">{p.label} de 2026</span>
                    <span className="text-[10px] bg-white/20 rounded-full px-2 py-0.5 text-white font-semibold">{done}/{p.acoes.length} concluídas</span>
                  </div>
                  <div className="divide-y divide-white/5">
                    {p.acoes.map(a => (
                      <div key={a.id} className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors">
                        <StatusIcon status={a.status} size={13} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white">#{a.id} {a.titulo}</p>
                          <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">{a.objetivo}</p>
                        </div>
                        <span className="text-[9px] bg-white/10 rounded px-1.5 py-0.5 text-white/40 flex-shrink-0">{a.canal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </DetailModal>
      )}

      {/* MODAL 3 — Canais */}
      {modal === 'canais' && (
        <DetailModal title="📡 Ações por Canal de Comunicação" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {CANAIS.map((c, i) => {
              const pct = Math.round((c.executado / c.planejado) * 100)
              const acoesCanal = ACOES.filter(a =>
                a.canal.toLowerCase().includes(c.canal.toLowerCase().split('/')[0].toLowerCase())
              )
              return (
                <div key={i} className="rounded-xl border border-white/10 p-4 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: c.color }} />
                      <span className="font-bold text-white">{c.canal}</span>
                    </div>
                    <div className="flex gap-3 text-[11px]">
                      <span className="text-white/40">Planejado: <span className="text-white font-bold">{c.planejado}</span></span>
                      <span className="text-white/40">Executado: <span style={{ color: c.color }} className="font-bold">{c.executado}</span></span>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: c.color }} />
                  </div>
                  {acoesCanal.slice(0, 5).map(a => (
                    <div key={a.id} className="flex items-center gap-2 py-1 text-[10px]">
                      <StatusIcon status={a.status} size={10} />
                      <span className="text-white/60 flex-1">{a.titulo}</span>
                      <span className="text-white/30">{a.periodo}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </DetailModal>
      )}
    </>
  )
}
