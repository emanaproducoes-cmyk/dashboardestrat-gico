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
  { canal: "LinkedIn", planejado: 8, executado: 5, color: "#38bdf8" },
  { canal: "YouTube", planejado: 6, executado: 3, color: "#fb923c" },
  { canal: "Instagram", planejado: 7, executado: 4, color: "#e879f9" },
  { canal: "Blog/SEO", planejado: 4, executado: 1, color: "#facc15" },
]

const CUMULATIVO = [
  { mes: "Abr", total: 4, novas: 4 },
  { mes: "Mai", total: 8, novas: 4 },
  { mes: "Jun", total: 10, novas: 2 },
  { mes: "Jul", total: 12, novas: 2 },
  { mes: "Ago", total: 13, novas: 1 },
  { mes: "Set", total: 14, novas: 1 },
  { mes: "Out", total: 16, novas: 2 },
  { mes: "Nov", total: 18, novas: 2 },
  { mes: "Dez", total: 20, novas: 2 },
]

const StatusIcon = ({ status, size = 10 }: { status: string; size?: number }) =>
  status === 'done'
    ? <CheckCircle2 size={size} className="text-emerald-400 flex-shrink-0" />
    : status === 'in_progress'
      ? <Clock size={size} className="text-sky-300 flex-shrink-0" />
      : <Circle size={size} className="text-white/30 flex-shrink-0" />

const BarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', pointerEvents: 'none', minWidth: 130 }}>
      <p style={{ fontWeight: 700, marginBottom: 4, color: '#e2e8f0' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill || p.color || '#fff', margin: '2px 0' }}>
          {p.name}: <span style={{ fontWeight: 700 }}>{p.value}</span>
        </p>
      ))}
    </div>
  )
}

const PeriodoTooltip = ({ label, done, total, acoes }: { label: string; done: number; total: number; acoes: typeof ACOES }) => (
  <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', minWidth: 200, maxWidth: 260 }}>
    <p style={{ fontWeight: 700, marginBottom: 6, color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 4 }}>{label} — {done}/{total} concluídas</p>
    {acoes.map(a => (
      <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, margin: '4px 0' }}>
        <span style={{ color: a.status === 'done' ? '#34d399' : a.status === 'in_progress' ? '#38bdf8' : 'rgba(255,255,255,0.3)', marginTop: 1, flexShrink: 0 }}>
          {a.status === 'done' ? '✓' : a.status === 'in_progress' ? '◐' : '○'}
        </span>
        <span style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>{a.titulo}</span>
      </div>
    ))}
  </div>
)

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
  const [hoveredPeriodo, setHoveredPeriodo] = useState<number | null>(null)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const concluidas = ACOES.filter(a => a.status === 'done').length
  const emAndamento = ACOES.filter(a => a.status === 'in_progress').length
  const pct = Math.round((concluidas / ACOES.length) * 100)

  return (
    <>
      <div className="grid grid-cols-3 gap-4 mt-6 mb-2">

        {/* CARD 1 */}
        <div className="rounded-2xl p-4 cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
          onClick={() => setModal('execucao')}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Progresso das Ações</p>
            <span style={{ background: 'rgba(52,211,153,0.25)', color: '#6ee7b7', fontSize: 11, fontWeight: 800, borderRadius: 99, padding: '2px 10px', border: '1px solid rgba(52,211,153,0.4)' }}>{pct}%</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{concluidas}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>de {ACOES.length} ações concluídas</span>
          </div>
          <div className="flex items-end gap-1 mb-3" style={{ height: 48 }}>
            {CUMULATIVO.map((c, i) => {
              const done = c.total <= concluidas
              const active = !done && c.total <= concluidas + emAndamento
              const barColor = done ? '#34d399' : active ? '#38bdf8' : 'rgba(255,255,255,0.18)'
              const isHov = hoveredBar === i
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1"
                  onMouseEnter={e => { setHoveredBar(i); setTooltipPos({ x: e.clientX, y: e.clientY }) }}
                  onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHoveredBar(null)}>
                  <div style={{ width: '100%', height: `${c.novas * 10}px`, background: barColor, borderRadius: '3px 3px 0 0', transition: 'all 0.15s', transform: isHov ? 'scaleY(1.08)' : 'scaleY(1)', transformOrigin: 'bottom', boxShadow: isHov ? `0 0 8px ${barColor}` : 'none' }} />
                  <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}>{c.mes}</span>
                </div>
              )
            })}
          </div>
          <div style={{ height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: 'linear-gradient(90deg, #34d399, #38bdf8)' }} />
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 3 }}>Ver todas as ações <ChevronRight size={8} /></p>
          {hoveredBar !== null && (
            <div style={{ position: 'fixed', left: tooltipPos.x + 12, top: tooltipPos.y - 60, zIndex: 9999, pointerEvents: 'none', background: '#0f172a', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.7)' }}>
              <p style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{CUMULATIVO[hoveredBar].mes} 2026</p>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Ações no período: <span style={{ color: '#34d399', fontWeight: 700 }}>{CUMULATIVO[hoveredBar].novas}</span></p>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>Total acumulado: <span style={{ color: '#38bdf8', fontWeight: 700 }}>{CUMULATIVO[hoveredBar].total}</span></p>
            </div>
          )}
        </div>

        {/* CARD 2 */}
        <div className="rounded-2xl p-4 cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
          onClick={() => setModal('periodos')}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Calendário de Ações</p>
            <Calendar size={13} color="rgba(255,255,255,0.7)" />
          </div>
          <div className="space-y-2.5">
            {PERIODOS.map((p, i) => {
              const done = p.acoes.filter(a => a.status === 'done').length
              const inProg = p.acoes.filter(a => a.status === 'in_progress').length
              const isHov = hoveredPeriodo === i
              return (
                <div key={i} className="relative"
                  onMouseEnter={e => { setHoveredPeriodo(i); setTooltipPos({ x: e.clientX, y: e.clientY }) }}
                  onMouseMove={e => setTooltipPos({ x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setHoveredPeriodo(null)}>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 10, color: isHov ? '#fff' : 'rgba(255,255,255,0.75)', width: 44, flexShrink: 0, fontWeight: 600, transition: 'color 0.15s' }}>{p.label}</span>
                    <div style={{ flex: 1, height: 10, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', display: 'flex' }}>
                      <div style={{ height: '100%', background: '#34d399', width: `${(done / p.acoes.length) * 100}%` }} />
                      <div style={{ height: '100%', background: '#38bdf8', width: `${(inProg / p.acoes.length) * 100}%` }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', width: 28, textAlign: 'right', flexShrink: 0 }}>{done}/{p.acoes.length}</span>
                    <StatusIcon status={done === p.acoes.length ? 'done' : inProg > 0 ? 'in_progress' : 'pending'} size={11} />
                  </div>
                  {isHov && (
                    <div style={{ position: 'fixed', left: tooltipPos.x + 12, top: tooltipPos.y - 80, zIndex: 9999, pointerEvents: 'none' }}>
                      <PeriodoTooltip label={p.label} done={done} total={p.acoes.length} acoes={p.acoes} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="flex gap-3 mt-3">
            {[['#34d399','Concluída'],['#38bdf8','Em andamento'],['rgba(255,255,255,0.18)','Pendente']].map(([color, label]) => (
              <div key={label} className="flex items-center gap-1">
                <div style={{ width: 8, height: 8, borderRadius: 99, background: color }} />
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>{label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 8 }}>Ver cronograma completo <ChevronRight size={8} /></p>
        </div>

        {/* CARD 3 */}
        <div className="rounded-2xl p-4 cursor-pointer group transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
          onClick={() => setModal('canais')}>
          <div className="flex items-center justify-between mb-3">
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Ações por Canal</p>
            <BarChart2 size={13} color="rgba(255,255,255,0.7)" />
          </div>
          <div style={{ height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CANAIS} margin={{ top: 4, right: 2, bottom: 0, left: -22 }} barCategoryGap="28%">
                <XAxis dataKey="canal" tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.75)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.06)' }} />
                <Bar dataKey="planejado" name="Planejado" fill="rgba(255,255,255,0.15)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="executado" name="Executado" radius={[3, 3, 0, 0]}>
                  {CANAIS.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-2 flex-wrap mt-1">
            {CANAIS.map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <div style={{ width: 6, height: 6, borderRadius: 99, background: c.color }} />
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.65)' }}>{c.canal} {c.executado}/{c.planejado}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 6 }}>Ver detalhes por canal <ChevronRight size={8} /></p>
        </div>
      </div>

      {modal === 'execucao' && (
        <DetailModal title="📋 Plano de Ação 2026 — 20 Ações" onClose={() => setModal(null)}>
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Concluídas", val: concluidas, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)" },
              { label: "Em andamento", val: emAndamento, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.3)" },
              { label: "Pendentes", val: ACOES.length - concluidas - emAndamento, color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: 12, textAlign: 'center' }}>
                <p style={{ fontSize: 32, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {ACOES.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} className="hover:bg-white/10 transition-colors">
                <div style={{ width: 24, height: 24, borderRadius: 99, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', flexShrink: 0, marginTop: 1 }}>{a.id}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{a.titulo}</p>
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)' }}>{a.periodo}</span>
                  </div>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{a.objetivo}</p>
                  <span style={{ display: 'inline-block', fontSize: 9, background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 8px', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{a.canal}</span>
                </div>
                <StatusIcon status={a.status} size={14} />
              </div>
            ))}
          </div>
        </DetailModal>
      )}

      {modal === 'periodos' && (
        <DetailModal title="📅 Cronograma de Execução 2026" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {PERIODOS.map((p, i) => {
              const done = p.acoes.filter(a => a.status === 'done').length
              const gradients = ['#1d4ed8,#2563eb', '#7c3aed,#8b5cf6', '#0e7490,#0891b2', '#b45309,#d97706', '#be123c,#e11d48']
              return (
                <div key={i} style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ background: `linear-gradient(135deg, ${gradients[i]})`, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{p.label} de 2026</span>
                    <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '2px 10px', color: '#fff', fontWeight: 600 }}>{done}/{p.acoes.length} concluídas</span>
                  </div>
                  <div>
                    {p.acoes.map(a => (
                      <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 transition-colors">
                        <StatusIcon status={a.status} size={13} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>#{a.id} {a.titulo}</p>
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, lineHeight: 1.5 }}>{a.objetivo}</p>
                        </div>
                        <span style={{ fontSize: 9, background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 8px', color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{a.canal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </DetailModal>
      )}

      {modal === 'canais' && (
        <DetailModal title="📡 Ações por Canal de Comunicação" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {CANAIS.map((c, i) => {
              const pct = Math.round((c.executado / c.planejado) * 100)
              const acoesCanal = ACOES.filter(a => a.canal.toLowerCase().includes(c.canal.toLowerCase().split('/')[0].toLowerCase()))
              return (
                <div key={i} style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', padding: 16, background: 'rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 99, background: c.color }} />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{c.canal}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Planejado: <span style={{ color: '#fff', fontWeight: 700 }}>{c.planejado}</span></span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Executado: <span style={{ color: c.color, fontWeight: 700 }}>{c.executado}</span></span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: c.color }} />
                  </div>
                  {acoesCanal.slice(0, 5).map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 10 }}>
                      <StatusIcon status={a.status} size={10} />
                      <span style={{ color: 'rgba(255,255,255,0.65)', flex: 1 }}>{a.titulo}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)' }}>{a.periodo}</span>
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
