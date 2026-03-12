import React, { useState } from "react"
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { CheckCircle2, Clock, Circle, X, ChevronRight, Calendar, BarChart2, Check } from "lucide-react"

type Status = 'done' | 'in_progress' | 'pending'
interface Acao { id: number; periodo: string; titulo: string; objetivo: string; canal: string; status: Status }

const ACOES_INICIAL: Acao[] = [
  { id: 1, periodo: "Abril", titulo: 'Lançamento LinkedIn', objetivo: 'Habilitar novo canal do mixchannel e iniciar crescimento orgânico qualificado.', canal: 'LinkedIn', status: 'done' },
  { id: 2, periodo: "Abril", titulo: 'Lançamento YouTube', objetivo: 'Humanizar a marca mostrando bastidores, rotinas e processos.', canal: 'YouTube', status: 'done' },
  { id: 3, periodo: "Abril", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Converter clientes ativos em seguidores nos canais digitais.', canal: 'IG/LI/YT', status: 'done' },
  { id: 4, periodo: "Abril", titulo: 'Bastidores e Reposts', objetivo: 'Aumentar presença e autoridade humana com bastidores e antes/depois.', canal: 'Instagram', status: 'done' },
  { id: 5, periodo: "Maio", titulo: 'Série "Métodos & Crescimento"', objetivo: 'Educar funil topo/meio e reforçar método AF (OKR Autoridade).', canal: 'IG/LI', status: 'done' },
  { id: 6, periodo: "Maio", titulo: 'Série "Conexão Regional"', objetivo: 'Cumprir meta de 1 vídeo longo/mês + Shorts 2x/sem para Prova Social e Autoridade.', canal: 'IG/LI', status: 'done' },
  { id: 7, periodo: "Maio", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Converter clientes em seguidores via WhatsApp e e-mail marketing.', canal: 'IG/LI/YT', status: 'done' },
  { id: 8, periodo: "Maio", titulo: 'Gamificação "Jornada do Cliente"', objetivo: 'Criar mensagens-chave enviadas aos clientes durante a jornada.', canal: 'WhatsApp', status: 'in_progress' },
  { id: 9, periodo: "Jun/Jul", titulo: 'Série "Métodos & Crescimento"', objetivo: 'Publicar pílulas de conhecimento semanalmente no LinkedIn e Instagram.', canal: 'IG/LI', status: 'in_progress' },
  { id: 10, periodo: "Jun/Jul", titulo: 'Série "Conexão Regional"', objetivo: 'Subir 1 vídeo longo por mês com recortes para Shorts e Reels.', canal: 'YouTube', status: 'in_progress' },
  { id: 11, periodo: "Jun/Jul", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Disparos via WhatsApp e e-mail focados em retenção e comunidade.', canal: 'IG/LI/YT', status: 'pending' },
  { id: 12, periodo: "Jun/Jul", titulo: 'Provas Sociais', objetivo: 'Captações de cases de sucesso para gerar autoridade.', canal: 'Todos', status: 'pending' },
  { id: 13, periodo: "Ago/Out", titulo: 'Blog "O Especialista"', objetivo: 'Conteúdos especializados para atração de empresários via SEO.', canal: 'Blog/Site', status: 'pending' },
  { id: 14, periodo: "Ago/Out", titulo: 'Lançamento "Histórias que Transformam"', objetivo: 'Narrativa visual antes/depois para nova seção de cases no site.', canal: 'Site/Redes', status: 'pending' },
  { id: 15, periodo: "Ago/Out", titulo: 'Campanha "De Clientes a Seguidores"', objetivo: 'Automatizar disparos no momento da entrega do protocolo.', canal: 'IG/LI/YT', status: 'pending' },
  { id: 16, periodo: "Ago/Out", titulo: 'Provas Sociais', objetivo: 'Gravar depoimentos presenciais ou remotos com clientes selecionados.', canal: 'YouTube', status: 'pending' },
  { id: 17, periodo: "Nov/Dez", titulo: 'Análise de KPIs e Resultados Anuais', objetivo: 'Mensurar o sucesso das estratégias de 2026 e guiar o planejamento de 2027.', canal: 'Interno', status: 'pending' },
  { id: 18, periodo: "Nov/Dez", titulo: 'Lançamento dos Vídeos Storytelling', objetivo: 'Consolidar a Prova Social com os 3 vídeos "Histórias que Transformam".', canal: 'YouTube/LI', status: 'pending' },
  { id: 19, periodo: "Nov/Dez", titulo: 'Retrospectiva "Especialista AF"', objetivo: 'Reforçar posicionamento de marca celebrando conquistas do ano.', canal: 'Todos', status: 'pending' },
  { id: 20, periodo: "Nov/Dez", titulo: 'Manutenção e SEO do Blog/Site', objetivo: 'Otimizar indexação dos conteúdos técnicos para manter a AF como referência em FNO.', canal: 'Blog/Site', status: 'pending' },
]

const PERIODOS_LABELS = ["Abril", "Maio", "Jun/Jul", "Ago/Out", "Nov/Dez"]
const CANAIS_DEF = [
  { canal: "LinkedIn", color: "#38bdf8" },
  { canal: "YouTube", color: "#fb923c" },
  { canal: "Instagram", color: "#e879f9" },
  { canal: "Blog/SEO", color: "#facc15" },
]

const cardStyle: React.CSSProperties = { background: 'rgba(0,0,0,0.38)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(14px)', borderRadius: 16, padding: 16, cursor: 'pointer', transition: 'transform 0.15s, border-color 0.15s' }
const labelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const }

const StatusIcon = ({ status, size = 10 }: { status: Status; size?: number }) =>
  status === 'done' ? <CheckCircle2 size={size} style={{ color: '#34d399', flexShrink: 0 }} />
  : status === 'in_progress' ? <Clock size={size} style={{ color: '#38bdf8', flexShrink: 0 }} />
  : <Circle size={size} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />

const DarkTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 12px', fontSize: 11, color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.8)', pointerEvents: 'none' }}>
      <p style={{ fontWeight: 700, marginBottom: 4, color: '#e2e8f0' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill === 'rgba(255,255,255,0.15)' ? '#94a3b8' : (p.fill || '#fff'), margin: '2px 0' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

function InlineTooltip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', zIndex: 100, pointerEvents: 'none', background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.8)', minWidth: 180, maxWidth: 260, whiteSpace: 'normal' }}>
      {children}
    </div>
  )
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} />
      <div style={{ position: 'relative', background: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 20, padding: 28, width: '100%', maxWidth: wide ? 860 : 680, maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 16, margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function HeaderMiniCharts() {
  const [acoes, setAcoes] = useState<Acao[]>(ACOES_INICIAL)
  const [modal, setModal] = useState<'execucao' | 'periodos' | 'canais' | null>(null)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [hoveredPeriodo, setHoveredPeriodo] = useState<number | null>(null)

  const concluidas = acoes.filter(a => a.status === 'done').length
  const emAndamento = acoes.filter(a => a.status === 'in_progress').length
  const pct = Math.round((concluidas / acoes.length) * 100)

  const toggleAcao = (id: number) => {
    setAcoes(prev => prev.map(a => {
      if (a.id !== id) return a
      const next: Status = a.status === 'done' ? 'pending' : 'done'
      return { ...a, status: next }
    }))
  }

  const barData = PERIODOS_LABELS.map(label => {
    const periodoAcoes = acoes.filter(a => a.periodo === label)
    const done = periodoAcoes.filter(a => a.status === 'done').length
    return { label, novas: periodoAcoes.length, done, pending: periodoAcoes.length - done }
  })

  const canaisData = CANAIS_DEF.map(c => {
    const match = c.canal === 'Blog/SEO' ? 'Blog' : c.canal
    const total = acoes.filter(a => a.canal.includes(match)).length
    const feito = acoes.filter(a => a.canal.includes(match) && a.status === 'done').length
    return { ...c, planejado: total || 4, executado: feito }
  })

  const periodos = PERIODOS_LABELS.map(label => ({
    label,
    acoes: acoes.filter(a => a.periodo === label),
    done: acoes.filter(a => a.periodo === label && a.status === 'done').length,
    inProg: acoes.filter(a => a.periodo === label && a.status === 'in_progress').length,
    pending: acoes.filter(a => a.periodo === label && a.status === 'pending').length,
  }))

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 20, marginBottom: 4 }}>

        {/* CARD 1 */}
        <div style={cardStyle} className="hover:border-white/40 hover:scale-[1.015]" onClick={() => setModal('execucao')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={labelStyle}>Progresso das Ações</p>
            <span style={{ background: 'rgba(52,211,153,0.2)', color: '#6ee7b7', fontSize: 11, fontWeight: 800, borderRadius: 99, padding: '2px 10px', border: '1px solid rgba(52,211,153,0.35)' }}>{pct}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{concluidas}</span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>de {acoes.length} ações concluídas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 50, marginBottom: 8 }}>
            {barData.map((d, i) => {
              const isHov = hoveredBar === i
              const barH = Math.max(d.novas * 9, 8)
              const doneH = d.novas > 0 ? (d.done / d.novas) * barH : 0
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2, position: 'relative' }}
                  onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)}>
                  {isHov && (
                    <InlineTooltip>
                      <p style={{ fontWeight: 700, marginBottom: 4, color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 3 }}>{d.label}</p>
                      <p style={{ color: '#34d399' }}>✓ Concluídas: <strong>{d.done}</strong></p>
                      <p style={{ color: 'rgba(255,255,255,0.5)' }}>○ Pendentes: <strong>{d.novas - d.done}</strong></p>
                    </InlineTooltip>
                  )}
                  <div style={{ width: '100%', height: barH, borderRadius: '3px 3px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse', transition: 'all 0.2s', filter: isHov ? 'brightness(1.2)' : 'none' }}>
                    <div style={{ height: doneH, background: '#34d399', transition: 'height 0.3s' }} />
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)' }} />
                  </div>
                  <span style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', lineHeight: 1 }}>{d.label.substring(0,3)}</span>
                </div>
              )
            })}
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: 'linear-gradient(90deg, #34d399, #38bdf8)', transition: 'width 0.4s' }} />
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 2 }}>Ver e editar todas as ações <ChevronRight size={8} /></p>
        </div>

        {/* CARD 2 */}
        <div style={cardStyle} className="hover:border-white/40 hover:scale-[1.015]" onClick={() => setModal('periodos')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={labelStyle}>Calendário de Ações</p>
            <Calendar size={13} color="rgba(255,255,255,0.65)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {periodos.map((p, i) => (
              <div key={i} style={{ position: 'relative' }}
                onMouseEnter={() => setHoveredPeriodo(i)} onMouseLeave={() => setHoveredPeriodo(null)}>
                {hoveredPeriodo === i && (
                  <InlineTooltip>
                    <p style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 5, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 3 }}>{p.label} — {p.done}/{p.acoes.length}</p>
                    {p.acoes.map(a => (
                      <div key={a.id} style={{ display: 'flex', gap: 5, margin: '3px 0', alignItems: 'flex-start' }}>
                        <span style={{ color: a.status === 'done' ? '#34d399' : a.status === 'in_progress' ? '#38bdf8' : 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
                          {a.status === 'done' ? '✓' : a.status === 'in_progress' ? '◐' : '○'}
                        </span>
                        <span style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.4, fontSize: 10 }}>{a.titulo}</span>
                      </div>
                    ))}
                  </InlineTooltip>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.8)', width: 44, flexShrink: 0, fontWeight: 600 }}>{p.label}</span>
                  <div style={{ flex: 1, height: 9, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', display: 'flex' }}>
                    <div style={{ height: '100%', background: '#34d399', width: `${(p.done / p.acoes.length) * 100}%`, transition: 'width 0.4s' }} />
                    <div style={{ height: '100%', background: '#38bdf8', width: `${(p.inProg / p.acoes.length) * 100}%`, transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#fff', width: 26, textAlign: 'right', flexShrink: 0 }}>{p.done}/{p.acoes.length}</span>
                  <StatusIcon status={p.done === p.acoes.length ? 'done' : p.inProg > 0 ? 'in_progress' : 'pending'} size={11} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            {[['#34d399','Concluída'],['#38bdf8','Em andamento'],['rgba(255,255,255,0.18)','Pendente']].map(([c, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: 99, background: c }} />
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.55)' }}>{l}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>Ver cronograma completo <ChevronRight size={8} /></p>
        </div>

        {/* CARD 3 */}
        <div style={cardStyle} className="hover:border-white/40 hover:scale-[1.015]" onClick={() => setModal('canais')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={labelStyle}>Ações por Canal</p>
            <BarChart2 size={13} color="rgba(255,255,255,0.65)" />
          </div>
          <div style={{ height: 90 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={canaisData} margin={{ top: 2, right: 2, bottom: 0, left: -24 }} barCategoryGap="28%">
                <XAxis dataKey="canal" tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.7)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="planejado" name="Planejado" fill="rgba(255,255,255,0.15)" radius={[3, 3, 0, 0]} />
                <Bar dataKey="executado" name="Executado" radius={[3, 3, 0, 0]}>
                  {canaisData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
            {canaisData.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: 99, background: c.color }} />
                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.6)' }}>{c.canal} {c.executado}/{c.planejado}</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 2, marginTop: 6 }}>Ver detalhes por canal <ChevronRight size={8} /></p>
        </div>
      </div>

      {/* MODAL 1 — com checkboxes */}
      {modal === 'execucao' && (
        <Modal title="📋 Plano de Ação 2026 — Marque as ações concluídas" onClose={() => setModal(null)} wide>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            {[
              { label: "Concluídas", val: concluidas, color: "#34d399", bg: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.3)" },
              { label: "Em andamento", val: emAndamento, color: "#38bdf8", bg: "rgba(56,189,248,0.1)", border: "rgba(56,189,248,0.3)" },
              { label: "Pendentes", val: acoes.length - concluidas - emAndamento, color: "rgba(255,255,255,0.45)", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)" },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: 34, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Progresso geral 2026</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#34d399' }}>{pct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: 'linear-gradient(90deg, #34d399, #38bdf8)', transition: 'width 0.4s' }} />
            </div>
          </div>
          {PERIODOS_LABELS.map(periodo => {
            const acosPeriodo = acoes.filter(a => a.periodo === periodo)
            const donePeriodo = acosPeriodo.filter(a => a.status === 'done').length
            return (
              <div key={periodo} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 }}>{periodo}</h4>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{donePeriodo}/{acosPeriodo.length} concluídas</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {acosPeriodo.map(a => {
                    const isDone = a.status === 'done'
                    return (
                      <div key={a.id}
                        style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 14px', borderRadius: 12, background: isDone ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isDone ? 'rgba(52,211,153,0.25)' : 'rgba(255,255,255,0.08)'}`, cursor: 'pointer', transition: 'all 0.2s' }}
                        onClick={() => toggleAcao(a.id)}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${isDone ? '#34d399' : 'rgba(255,255,255,0.25)'}`, background: isDone ? 'rgba(52,211,153,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>
                          {isDone && <Check size={12} color="#34d399" />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: isDone ? 'rgba(255,255,255,0.5)' : '#fff', textDecoration: isDone ? 'line-through' : 'none', marginBottom: 3 }}>#{a.id} {a.titulo}</p>
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{a.objetivo}</p>
                          <span style={{ display: 'inline-block', fontSize: 9, background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '2px 8px', color: 'rgba(255,255,255,0.4)', marginTop: 5 }}>{a.canal}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </Modal>
      )}

      {/* MODAL 2 — Cronograma */}
      {modal === 'periodos' && (
        <Modal title="📅 Cronograma de Execução 2026" onClose={() => setModal(null)} wide>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px 16px 8px', marginBottom: 20, height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodos} margin={{ top: 4, right: 16, bottom: 0, left: -8 }} barCategoryGap="30%">
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="done" name="Concluídas" fill="#34d399" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="pending" name="Pendentes" fill="rgba(255,255,255,0.15)" radius={[4, 4, 0, 0]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {periodos.map((p, i) => {
              const gradients = ['#1e40af,#3b82f6','#6d28d9,#8b5cf6','#0e7490,#06b6d4','#92400e,#f59e0b','#9f1239,#f43f5e']
              return (
                <div key={i} style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ background: `linear-gradient(135deg, ${gradients[i]})`, padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>{p.label} de 2026</span>
                    <span style={{ fontSize: 11, background: 'rgba(255,255,255,0.2)', borderRadius: 99, padding: '3px 12px', color: '#fff', fontWeight: 600 }}>{p.done}/{p.acoes.length} concluídas</span>
                  </div>
                  {p.acoes.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }} className="hover:bg-white/5 transition-colors">
                      <StatusIcon status={a.status} size={14} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 3 }}>#{a.id} {a.titulo}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{a.objetivo}</p>
                      </div>
                      <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 10px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{a.canal}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {/* MODAL 3 — Canais */}
      {modal === 'canais' && (
        <Modal title="📡 Ações por Canal de Comunicação" onClose={() => setModal(null)} wide>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '16px 16px 8px', marginBottom: 20, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={canaisData} margin={{ top: 4, right: 16, bottom: 0, left: -8 }} barCategoryGap="30%">
                <XAxis dataKey="canal" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.75)', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="planejado" name="Planejado" fill="rgba(255,255,255,0.12)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="executado" name="Executado" radius={[4, 4, 0, 0]}>
                  {canaisData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {canaisData.map((c, i) => {
              const p2 = Math.round((c.executado / Math.max(c.planejado, 1)) * 100)
              const acoesCanal = acoes.filter(a => a.canal.includes(c.canal.split('/')[0]))
              return (
                <div key={i} style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', padding: 18, background: 'rgba(255,255,255,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 14, height: 14, borderRadius: 99, background: c.color }} />
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: 16 }}>{c.canal}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Planejado: <span style={{ color: '#fff', fontWeight: 700 }}>{c.planejado}</span></span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Executado: <span style={{ color: c.color, fontWeight: 700 }}>{c.executado}</span></span>
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}><span style={{ color: c.color, fontWeight: 700 }}>{p2}%</span> concluído</span>
                    </div>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ height: '100%', borderRadius: 99, width: `${p2}%`, background: c.color, transition: 'width 0.4s' }} />
                  </div>
                  {acoesCanal.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 12 }}>
                      <StatusIcon status={a.status} size={12} />
                      <span style={{ color: 'rgba(255,255,255,0.7)', flex: 1 }}>{a.titulo}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{a.periodo}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </Modal>
      )}
    </>
  )
}
```




