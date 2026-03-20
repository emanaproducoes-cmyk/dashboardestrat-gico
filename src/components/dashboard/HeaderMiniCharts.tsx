import React, { useState, useRef, useEffect, useCallback } from "react"
import { CheckCircle2, Clock, Circle, X, ChevronRight, Calendar, BarChart2, Pencil, Check, Plus, Trash2, Save } from "lucide-react"
import { useAuth } from "../../lib/AuthContext"
import { db } from "../../lib/firebase"
import { doc, setDoc, onSnapshot } from "firebase/firestore"

type Status = 'done' | 'in_progress' | 'pending'
interface Acao { id: number; periodo: string; titulo: string; objetivo: string; canal: string; status: Status }

const FIRESTORE_DOC = doc(db, 'dashboard', 'acoes')

const ACOES_INICIAL: Acao[] = [
  { id: 1,  periodo: "Abril",   titulo: 'Lançamento LinkedIn',                    objetivo: 'Habilitar novo canal do mixchannel e iniciar crescimento orgânico qualificado.',           canal: 'LinkedIn',   status: 'done' },
  { id: 2,  periodo: "Abril",   titulo: 'Lançamento YouTube',                     objetivo: 'Humanizar a marca mostrando bastidores, rotinas e processos.',                             canal: 'YouTube',    status: 'done' },
  { id: 3,  periodo: "Abril",   titulo: 'Campanha "De Clientes a Seguidores"',    objetivo: 'Converter clientes ativos em seguidores nos canais digitais.',                             canal: 'IG/LI/YT',  status: 'done' },
  { id: 4,  periodo: "Abril",   titulo: 'Bastidores e Reposts',                   objetivo: 'Aumentar presença e autoridade humana com bastidores e antes/depois.',                    canal: 'Instagram',  status: 'done' },
  { id: 5,  periodo: "Maio",    titulo: 'Série "Métodos & Crescimento"',          objetivo: 'Educar funil topo/meio e reforçar método AF (OKR Autoridade).',                           canal: 'IG/LI',      status: 'done' },
  { id: 6,  periodo: "Maio",    titulo: 'Série "Conexão Regional"',               objetivo: 'Cumprir meta de 1 vídeo longo/mês + Shorts 2x/sem para Prova Social e Autoridade.',      canal: 'IG/LI',      status: 'done' },
  { id: 7,  periodo: "Maio",    titulo: 'Campanha "De Clientes a Seguidores"',    objetivo: 'Converter clientes em seguidores via WhatsApp e e-mail marketing.',                       canal: 'IG/LI/YT',  status: 'done' },
  { id: 8,  periodo: "Maio",    titulo: 'Gamificação "Jornada do Cliente"',       objetivo: 'Criar mensagens-chave enviadas aos clientes durante a jornada.',                          canal: 'WhatsApp',   status: 'in_progress' },
  { id: 9,  periodo: "Jun/Jul", titulo: 'Série "Métodos & Crescimento"',          objetivo: 'Publicar pílulas de conhecimento semanalmente no LinkedIn e Instagram.',                 canal: 'IG/LI',      status: 'in_progress' },
  { id: 10, periodo: "Jun/Jul", titulo: 'Série "Conexão Regional"',               objetivo: 'Subir 1 vídeo longo por mês com recortes para Shorts e Reels.',                          canal: 'YouTube',    status: 'in_progress' },
  { id: 11, periodo: "Jun/Jul", titulo: 'Campanha "De Clientes a Seguidores"',    objetivo: 'Disparos via WhatsApp e e-mail focados em retenção e comunidade.',                       canal: 'IG/LI/YT',  status: 'pending' },
  { id: 12, periodo: "Jun/Jul", titulo: 'Provas Sociais',                         objetivo: 'Captações de cases de sucesso para gerar autoridade.',                                    canal: 'Todos',      status: 'pending' },
  { id: 13, periodo: "Ago/Out", titulo: 'Blog "O Especialista"',                  objetivo: 'Conteúdos especializados para atração de empresários via SEO.',                          canal: 'Blog/Site',  status: 'pending' },
  { id: 14, periodo: "Ago/Out", titulo: 'Lançamento "Histórias que Transformam"', objetivo: 'Narrativa visual antes/depois para nova seção de cases no site.',                         canal: 'Site/Redes', status: 'pending' },
  { id: 15, periodo: "Ago/Out", titulo: 'Campanha "De Clientes a Seguidores"',    objetivo: 'Automatizar disparos no momento da entrega do protocolo.',                               canal: 'IG/LI/YT',  status: 'pending' },
  { id: 16, periodo: "Ago/Out", titulo: 'Provas Sociais',                         objetivo: 'Gravar depoimentos presenciais ou remotos com clientes selecionados.',                   canal: 'YouTube',    status: 'pending' },
  { id: 17, periodo: "Nov/Dez", titulo: 'Análise de KPIs e Resultados Anuais',    objetivo: 'Mensurar o sucesso das estratégias de 2026 e guiar o planejamento de 2027.',             canal: 'Interno',    status: 'pending' },
  { id: 18, periodo: "Nov/Dez", titulo: 'Lançamento dos Vídeos Storytelling',     objetivo: 'Consolidar a Prova Social com os 3 vídeos "Histórias que Transformam".',                canal: 'YouTube/LI', status: 'pending' },
  { id: 19, periodo: "Nov/Dez", titulo: 'Retrospectiva "Especialista AF"',        objetivo: 'Reforçar posicionamento de marca celebrando conquistas do ano.',                         canal: 'Todos',      status: 'pending' },
  { id: 20, periodo: "Nov/Dez", titulo: 'Manutenção e SEO do Blog/Site',          objetivo: 'Otimizar indexação dos conteúdos técnicos para manter a AF como referência em FNO.',    canal: 'Blog/Site',  status: 'pending' },
]

const PERIODOS_LABELS_DEFAULT = ["Abril", "Maio", "Jun/Jul", "Ago/Out", "Nov/Dez"]
const CANAIS_DEF = [
  { canal: "LinkedIn",  color: "#38bdf8" },
  { canal: "YouTube",   color: "#fb923c" },
  { canal: "Instagram", color: "#e879f9" },
  { canal: "Blog/SEO",  color: "#facc15" },
]

const cardBase: React.CSSProperties = {
  background: 'rgba(0,0,0,0.38)',
  backdropFilter: 'blur(14px)',
  borderRadius: 16,
  padding: 16,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  cursor: 'pointer',
}

async function saveToFirestore(data: {
  acoes: Acao[]
  labelProgresso: string
  labelCalendario: string
  labelCanais: string
  periodoLabels: string[]
  canaisLabels: string[]
}) {
  try {
    await setDoc(FIRESTORE_DOC, data)
  } catch (e) {
    console.error('Erro ao salvar no Firestore:', e)
  }
}

function EditableField({ value, onChange, style, multiline = false, pencilSize = 9, isAdmin = false }: {
  value: string; onChange: (v: string) => void; style?: React.CSSProperties
  multiline?: boolean; pencilSize?: number; isAdmin?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const ref = useRef<any>(null)
  useEffect(() => { setDraft(value) }, [value])
  useEffect(() => { if (editing) ref.current?.focus() }, [editing])
  const commit = () => { onChange(draft); setEditing(false) }
  const cancel = () => { setDraft(value); setEditing(false) }
  const inputStyle: React.CSSProperties = { ...style, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 6, color: '#fff', padding: '2px 6px', outline: 'none', width: '100%', fontFamily: 'inherit', resize: 'none' as const }
  if (!isAdmin) return <span style={style}>{value}</span>
  if (editing) {
    return (
      <span style={{ display: 'flex', alignItems: 'flex-start', gap: 4, flex: 1 }} onClick={e => e.stopPropagation()}>
        {multiline
          ? <textarea ref={ref} value={draft} rows={2} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commit() } if (e.key === 'Escape') cancel() }} style={inputStyle} />
          : <input ref={ref} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel() }} style={inputStyle} />
        }
        <button onClick={e => { e.stopPropagation(); commit() }} style={{ background: 'rgba(52,211,153,0.2)', border: '1px solid #34d399', borderRadius: 5, padding: '3px 6px', cursor: 'pointer', color: '#34d399', flexShrink: 0 }}>
          <Check size={11} />
        </button>
      </span>
    )
  }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1, cursor: isAdmin ? 'text' : 'default' }} onClick={e => { if (!isAdmin) return; e.stopPropagation(); setEditing(true) }}>
      <span style={style}>{value}</span>
      {isAdmin && <Pencil size={pencilSize} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }} />}
    </span>
  )
}

function EditableLabel({ value, onChange, isAdmin = false }: { value: string; onChange: (v: string) => void; isAdmin?: boolean }) {
  return <EditableField value={value} onChange={onChange} pencilSize={8} isAdmin={isAdmin}
    style={{ color: 'rgba(255,255,255,0.9)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }} />
}

const StatusIcon = ({ status, size = 10 }: { status: Status; size?: number }) =>
  status === 'done' ? <CheckCircle2 size={size} style={{ color: '#34d399', flexShrink: 0 }} />
  : status === 'in_progress' ? <Clock size={size} style={{ color: '#38bdf8', flexShrink: 0 }} />
  : <Circle size={size} style={{ color: 'rgba(255,255,255,0.25)', flexShrink: 0 }} />

function InlineTooltip({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: 'absolute', bottom: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', zIndex: 200, pointerEvents: 'none', background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#fff', boxShadow: '0 8px 24px rgba(0,0,0,0.8)', minWidth: 180, maxWidth: 260, whiteSpace: 'normal' }}>
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

function AdminBar({ onNova, onSave }: { onNova: () => void; onSave: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <button onClick={onNova} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: '#34d399', fontSize: 13, fontWeight: 700 }}>
        <Plus size={14} /> Nova Ação
      </button>
      <button onClick={onSave} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.4)', borderRadius: 8, padding: '7px 14px', cursor: 'pointer', color: '#38bdf8', fontSize: 13, fontWeight: 700 }}>
        <Save size={14} /> Salvar Tudo
      </button>
    </div>
  )
}

function AcaoRow({ a, onToggle, onEdit, onDelete, isAdmin = false }: {
  a: Acao; onToggle: () => void
  onEdit: (f: 'titulo' | 'objetivo' | 'canal' | 'periodo', v: string) => void
  onDelete: () => void; isAdmin?: boolean
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 10px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', marginBottom: 4, border: '1px solid rgba(255,255,255,0.07)' }}>
      <div onClick={e => { if (!isAdmin) return; e.stopPropagation(); onToggle() }} style={{ marginTop: 2, cursor: isAdmin ? 'pointer' : 'default', flexShrink: 0 }}>
        <StatusIcon status={a.status} size={14} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <EditableField value={a.titulo} onChange={v => onEdit('titulo', v)} isAdmin={isAdmin}
          style={{ color: a.status === 'done' ? 'rgba(255,255,255,0.4)' : '#fff', fontSize: 12, fontWeight: 600, textDecoration: a.status === 'done' ? 'line-through' : 'none' }} />
        <EditableField value={a.objetivo} onChange={v => onEdit('objetivo', v)} multiline isAdmin={isAdmin}
          style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, lineHeight: '1.5' }} />
      </div>
      <EditableField value={a.canal} onChange={v => onEdit('canal', v)} isAdmin={isAdmin}
        style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.07)', borderRadius: 6, padding: '2px 6px', whiteSpace: 'nowrap' }} />
      {isAdmin && (
        <button onClick={e => { e.stopPropagation(); onDelete() }}
          style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, padding: '3px 6px', cursor: 'pointer', color: '#f87171', flexShrink: 0 }}>
          <Trash2 size={11} />
        </button>
      )}
    </div>
  )
}

function AcaoChip({ a, onToggle, onEdit, isAdmin = false }: { a: Acao; onToggle: () => void; onEdit: (f: 'titulo', v: string) => void; isAdmin?: boolean }) {
  const color = a.status === 'done' ? '#34d399' : a.status === 'in_progress' ? '#38bdf8' : 'rgba(255,255,255,0.4)'
  const icon  = a.status === 'done' ? '✓' : a.status === 'in_progress' ? '◐' : '○'
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color, background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '3px 8px', border: '1px solid rgba(255,255,255,0.08)' }}>
      <span onClick={e => { if (!isAdmin) return; e.stopPropagation(); onToggle() }} style={{ cursor: isAdmin ? 'pointer' : 'default', flexShrink: 0 }}>{icon}</span>
      <EditableField value={a.titulo} onChange={v => onEdit('titulo', v)} pencilSize={8} isAdmin={isAdmin} style={{ color, fontSize: 10 }} />
    </span>
  )
}

function NovaAcaoForm({ onAdd, onClose }: { onAdd: (a: Omit<Acao, 'id'>) => void; onClose: () => void }) {
  const [titulo,   setTitulo]   = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [canal,    setCanal]    = useState('')
  const [periodo,  setPeriodo]  = useState(PERIODOS_LABELS_DEFAULT[0])
  const [status,   setStatus]   = useState<Status>('pending')
  const inputStyle: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 13, outline: 'none', fontFamily: 'inherit' }
  const labelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 4, display: 'block' }
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 16, marginBottom: 16, border: '1px solid rgba(52,211,153,0.2)' }}>
      <p style={{ color: '#34d399', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>+ Nova Ação</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div><label style={labelStyle}>Título *</label><input style={inputStyle} value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Nome da ação" /></div>
        <div><label style={labelStyle}>Objetivo</label><textarea style={{ ...inputStyle, resize: 'none' }} rows={2} value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="Descreva o objetivo" /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><label style={labelStyle}>Canal</label><input style={inputStyle} value={canal} onChange={e => setCanal(e.target.value)} placeholder="Ex: LinkedIn" /></div>
          <div><label style={labelStyle}>Período</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={periodo} onChange={e => setPeriodo(e.target.value)}>
              {PERIODOS_LABELS_DEFAULT.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div><label style={labelStyle}>Status inicial</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={status} onChange={e => setStatus(e.target.value as Status)}>
            <option value="pending">Pendente</option>
            <option value="in_progress">Em andamento</option>
            <option value="done">Concluída</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '8px 18px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>Cancelar</button>
          <button onClick={() => { if (!titulo.trim()) return; onAdd({ titulo, objetivo, canal, periodo, status }); onClose() }} disabled={!titulo.trim()}
            style={{ background: titulo.trim() ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${titulo.trim() ? '#34d399' : 'rgba(255,255,255,0.1)'}`, borderRadius: 8, padding: '8px 18px', cursor: titulo.trim() ? 'pointer' : 'default', color: titulo.trim() ? '#34d399' : 'rgba(255,255,255,0.3)', fontSize: 13, fontWeight: 700 }}>
            + Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}

function SavedBadge({ visible }: { visible: boolean }) {
  return (
    <span style={{ position: 'absolute', top: -10, right: 0, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: 99, padding: '2px 10px', fontSize: 9, color: '#34d399', fontWeight: 700, letterSpacing: '0.07em', opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: 'none', zIndex: 10 }}>
      ✓ salvo
    </span>
  )
}

// ─── Card com hover ───────────────────────────────────────────────────────────
function MiniCard({ border, onClick, children }: { border: string; onClick: () => void; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...cardBase,
        border,
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered ? '0 8px 32px rgba(0,0,0,0.45)' : 'none',
        zIndex: hovered ? 2 : 1,
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

export default function HeaderMiniCharts() {
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const [acoes,           setAcoes]           = useState<Acao[]>(ACOES_INICIAL)
  const [labelProgresso,  setLabelProgresso]  = useState('Progresso das Ações')
  const [labelCalendario, setLabelCalendario] = useState('Calendário de Ações')
  const [labelCanais,     setLabelCanais]     = useState('Canais de Atuação')
  const [periodoLabels,   setPeriodoLabels]   = useState<string[]>([...PERIODOS_LABELS_DEFAULT])
  const [canaisLabels,    setCanaisLabels]    = useState<string[]>(CANAIS_DEF.map(c => c.canal))

  const [modal,          setModal]          = useState<'execucao' | 'periodos' | 'canais' | null>(null)
  const [expanded,       setExpanded]       = useState<'execucao' | 'periodos' | 'canais' | null>(null)
  const [hoveredBar,     setHoveredBar]     = useState<number | null>(null)
  const [hoveredPeriodo, setHoveredPeriodo] = useState<number | null>(null)
  const [savedFlag,      setSavedFlag]      = useState(false)
  const [showNovaAcao,   setShowNovaAcao]   = useState(false)

  const flashSaved = useCallback(() => { setSavedFlag(true); setTimeout(() => setSavedFlag(false), 1800) }, [])

  useEffect(() => {
    const unsub = onSnapshot(FIRESTORE_DOC, (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        if (data.acoes)           setAcoes(data.acoes)
        if (data.labelProgresso)  setLabelProgresso(data.labelProgresso)
        if (data.labelCalendario) setLabelCalendario(data.labelCalendario)
        if (data.labelCanais)     setLabelCanais(data.labelCanais)
        if (data.periodoLabels)   setPeriodoLabels(data.periodoLabels)
        if (data.canaisLabels)    setCanaisLabels(data.canaisLabels)
      } else {
        saveToFirestore({ acoes: ACOES_INICIAL, labelProgresso: 'Progresso das Ações', labelCalendario: 'Calendário de Ações', labelCanais: 'Canais de Atuação', periodoLabels: [...PERIODOS_LABELS_DEFAULT], canaisLabels: CANAIS_DEF.map(c => c.canal) })
      }
    })
    return () => unsub()
  }, [])

  const handleSave = async () => {
    await saveToFirestore({ acoes, labelProgresso, labelCalendario, labelCanais, periodoLabels, canaisLabels })
    flashSaved()
  }

  const toggleAcao = (id: number) => {
    setAcoes(prev => { const next = prev.map(a => a.id !== id ? a : { ...a, status: (a.status === 'done' ? 'pending' : 'done') as Status }); saveToFirestore({ acoes: next, labelProgresso, labelCalendario, labelCanais, periodoLabels, canaisLabels }); flashSaved(); return next })
  }
  const editAcao = (id: number, field: 'titulo' | 'objetivo' | 'canal' | 'periodo', val: string) => {
    setAcoes(prev => { const next = prev.map(a => a.id !== id ? a : { ...a, [field]: val }); saveToFirestore({ acoes: next, labelProgresso, labelCalendario, labelCanais, periodoLabels, canaisLabels }); flashSaved(); return next })
  }
  const addAcao = (nova: Omit<Acao, 'id'>) => {
    setAcoes(prev => { const next = [...prev, { ...nova, id: Date.now() }]; saveToFirestore({ acoes: next, labelProgresso, labelCalendario, labelCanais, periodoLabels, canaisLabels }); flashSaved(); return next })
  }
  const deleteAcao = (id: number) => {
    setAcoes(prev => { const next = prev.filter(a => a.id !== id); saveToFirestore({ acoes: next, labelProgresso, labelCalendario, labelCanais, periodoLabels, canaisLabels }); flashSaved(); return next })
  }
  const editPeriodo = (i: number, v: string) => {
    setPeriodoLabels(prev => { const next = prev.map((l, idx) => idx === i ? v : l); saveToFirestore({ acoes, labelProgresso, labelCalendario, labelCanais, periodoLabels: next, canaisLabels }); flashSaved(); return next })
  }
  const editCanalLabel = (i: number, v: string) => {
    setCanaisLabels(prev => { const next = prev.map((l, idx) => idx === i ? v : l); saveToFirestore({ acoes, labelProgresso, labelCalendario, labelCanais, periodoLabels, canaisLabels: next }); flashSaved(); return next })
  }
  const handleLabelProgresso  = (v: string) => { setLabelProgresso(v);  saveToFirestore({ acoes, labelProgresso: v,  labelCalendario, labelCanais, periodoLabels, canaisLabels }); flashSaved() }
  const handleLabelCalendario = (v: string) => { setLabelCalendario(v); saveToFirestore({ acoes, labelProgresso, labelCalendario: v, labelCanais, periodoLabels, canaisLabels }); flashSaved() }
  const handleLabelCanais     = (v: string) => { setLabelCanais(v);     saveToFirestore({ acoes, labelProgresso, labelCalendario, labelCanais: v, periodoLabels, canaisLabels }); flashSaved() }

  const concluidas = acoes.filter(a => a.status === 'done').length
  const pct        = Math.round((concluidas / acoes.length) * 100)

  const barData = periodoLabels.map((label, idx) => {
    const orig = PERIODOS_LABELS_DEFAULT[idx]
    const list = acoes.filter(a => a.periodo === orig)
    return { label, orig, novas: list.length, done: list.filter(a => a.status === 'done').length }
  })

  const canaisData = CANAIS_DEF.map((c, i) => {
    const match = c.canal === 'Blog/SEO' ? 'Blog' : c.canal
    return { ...c, displayLabel: canaisLabels[i], planejado: acoes.filter(a => a.canal.includes(match)).length || 4, executado: acoes.filter(a => a.canal.includes(match) && a.status === 'done').length }
  })

  const periodos = periodoLabels.map((label, idx) => {
    const orig = PERIODOS_LABELS_DEFAULT[idx]
    return { label, orig, acoes: acoes.filter(a => a.periodo === orig), done: acoes.filter(a => a.periodo === orig && a.status === 'done').length, inProg: acoes.filter(a => a.periodo === orig && a.status === 'in_progress').length, pending: acoes.filter(a => a.periodo === orig && a.status === 'pending').length }
  })

  const handleCard = (key: 'execucao' | 'periodos' | 'canais') => { if (expanded !== key) setExpanded(key); else setModal(key) }
  const exp = (k: string) => expanded === k

  return (
    <>
      <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 20, marginBottom: 4, alignItems: 'start' }}>
        <SavedBadge visible={savedFlag} />

        {/* CARD 1 — Progresso */}
        <MiniCard border={`1px solid ${exp('execucao') ? 'rgba(52,211,153,0.5)' : 'rgba(255,255,255,0.2)'}`} onClick={() => handleCard('execucao')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <EditableLabel value={labelProgresso} onChange={handleLabelProgresso} isAdmin={isAdmin} />
            <span style={{ background: 'rgba(52,211,153,0.2)', color: '#6ee7b7', fontSize: 11, fontWeight: 800, borderRadius: 99, padding: '2px 10px', border: '1px solid rgba(52,211,153,0.35)', flexShrink: 0 }}>{pct}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: exp('execucao') ? 34 : 26, fontWeight: 900, color: '#fff', lineHeight: 1, transition: 'font-size 0.3s' }}>{concluidas}</span>
            <span style={{ fontSize: exp('execucao') ? 12 : 10, color: 'rgba(255,255,255,0.55)', transition: 'font-size 0.3s' }}>de {acoes.length} ações concluídas</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: exp('execucao') ? 8 : 4, height: exp('execucao') ? 120 : 50, marginBottom: 8, transition: 'height 0.35s ease' }}>
            {barData.map((d, i) => {
              const isHov = hoveredBar === i
              const maxH  = exp('execucao') ? 100 : 44
              const barH  = Math.max(d.novas / 5 * maxH, 8)
              const doneH = d.novas > 0 ? (d.done / d.novas) * barH : 0
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 2, position: 'relative' }}
                  onMouseEnter={e => { e.stopPropagation(); setHoveredBar(i) }} onMouseLeave={() => setHoveredBar(null)}>
                  {isHov && <InlineTooltip><p style={{ fontWeight: 700, marginBottom: 4, color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 3 }}>{d.label}</p><p style={{ color: '#34d399' }}>✓ Concluídas: <strong>{d.done}</strong></p><p style={{ color: 'rgba(255,255,255,0.5)' }}>○ Pendentes: <strong>{d.novas - d.done}</strong></p></InlineTooltip>}
                  <div style={{ width: '100%', height: barH, borderRadius: '4px 4px 0 0', overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse', filter: isHov ? 'brightness(1.25)' : 'none', transition: 'height 0.35s ease' }}>
                    <div style={{ height: doneH, background: '#34d399', transition: 'height 0.3s' }} />
                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)' }} />
                  </div>
                  <EditableField value={d.label} onChange={v => editPeriodo(i, v)} pencilSize={7} isAdmin={isAdmin} style={{ fontSize: exp('execucao') ? 9 : 7, color: 'rgba(255,255,255,0.5)', lineHeight: '1' }} />
                  {exp('execucao') && <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700 }}>{d.done}/{d.novas}</span>}
                </div>
              )
            })}
          </div>
          <div style={{ height: exp('execucao') ? 7 : 4, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', marginBottom: 8, transition: 'height 0.3s' }}>
            <div style={{ height: '100%', borderRadius: 99, width: `${pct}%`, background: 'linear-gradient(90deg, #34d399, #38bdf8)', transition: 'width 0.4s' }} />
          </div>
          <p style={{ fontSize: 9, color: exp('execucao') ? '#34d399' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 3, margin: 0 }}>
            {exp('execucao') ? 'Clique novamente para ver detalhes' : 'Clique para ampliar'}<ChevronRight size={8} />
          </p>
        </MiniCard>

        {/* CARD 2 — Calendário */}
        <MiniCard border={`1px solid ${exp('periodos') ? 'rgba(56,189,248,0.5)' : 'rgba(255,255,255,0.2)'}`} onClick={() => handleCard('periodos')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <EditableLabel value={labelCalendario} onChange={handleLabelCalendario} isAdmin={isAdmin} />
            <Calendar size={13} color="rgba(255,255,255,0.65)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: exp('periodos') ? 16 : 10, transition: 'gap 0.3s' }}>
            {periodos.map((p, i) => (
              <div key={i} style={{ position: 'relative' }} onMouseEnter={e => { e.stopPropagation(); setHoveredPeriodo(i) }} onMouseLeave={() => setHoveredPeriodo(null)}>
                {hoveredPeriodo === i && !exp('periodos') && (
                  <InlineTooltip>
                    <p style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: 5, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 3 }}>{p.label} — {p.done}/{p.acoes.length}</p>
                    {p.acoes.map(a => <div key={a.id} style={{ display: 'flex', gap: 5, margin: '3px 0' }}><span style={{ color: a.status === 'done' ? '#34d399' : a.status === 'in_progress' ? '#38bdf8' : 'rgba(255,255,255,0.3)' }}>{a.status === 'done' ? '✓' : a.status === 'in_progress' ? '◐' : '○'}</span><span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10 }}>{a.titulo}</span></div>)}
                  </InlineTooltip>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: exp('periodos') ? 54 : 44, flexShrink: 0 }}>
                    <EditableField value={p.label} onChange={v => editPeriodo(i, v)} pencilSize={8} isAdmin={isAdmin} style={{ fontSize: exp('periodos') ? 12 : 10, color: '#fff', fontWeight: 600 }} />
                  </span>
                  <div style={{ flex: 1, height: exp('periodos') ? 12 : 9, borderRadius: 99, background: 'rgba(255,255,255,0.12)', overflow: 'hidden', display: 'flex', transition: 'height 0.3s' }}>
                    <div style={{ height: '100%', width: `${p.acoes.length > 0 ? (p.done / p.acoes.length) * 100 : 0}%`, background: '#34d399', transition: 'width 0.4s' }} />
                    <div style={{ height: '100%', width: `${p.acoes.length > 0 ? (p.inProg / p.acoes.length) * 100 : 0}%`, background: '#38bdf8', transition: 'width 0.4s' }} />
                  </div>
                  <span style={{ fontSize: exp('periodos') ? 11 : 10, color: 'rgba(255,255,255,0.55)', width: 32, textAlign: 'right', flexShrink: 0 }}>{p.done}/{p.acoes.length}</span>
                </div>
                {exp('periodos') && <div style={{ marginTop: 8, paddingLeft: 62, display: 'flex', flexWrap: 'wrap', gap: 5 }}>{p.acoes.map(a => <AcaoChip key={a.id} a={a} onToggle={() => toggleAcao(a.id)} onEdit={(f, v) => editAcao(a.id, f, v)} isAdmin={isAdmin} />)}</div>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: exp('periodos') ? '#38bdf8' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 12 }}>
            {exp('periodos') ? 'Clique novamente para editar' : 'Clique para ampliar'}<ChevronRight size={8} />
          </p>
        </MiniCard>

        {/* CARD 3 — Canais */}
        <MiniCard border={`1px solid ${exp('canais') ? 'rgba(250,204,21,0.5)' : 'rgba(255,255,255,0.2)'}`} onClick={() => handleCard('canais')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <EditableLabel value={labelCanais} onChange={handleLabelCanais} isAdmin={isAdmin} />
            <BarChart2 size={13} color="rgba(255,255,255,0.65)" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: exp('canais') ? 18 : 10, transition: 'gap 0.3s' }}>
            {canaisData.map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: exp('canais') ? 7 : 4 }}>
                  <EditableField value={c.displayLabel} onChange={v => editCanalLabel(i, v)} pencilSize={8} isAdmin={isAdmin} style={{ fontSize: exp('canais') ? 13 : 10, color: c.color, fontWeight: 700 }} />
                  <span style={{ fontSize: exp('canais') ? 12 : 10, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{c.executado}/{c.planejado}</span>
                </div>
                <div style={{ height: exp('canais') ? 11 : 6, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', transition: 'height 0.3s' }}>
                  <div style={{ height: '100%', width: `${c.planejado > 0 ? (c.executado / c.planejado) * 100 : 0}%`, background: c.color, borderRadius: 99, transition: 'width 0.4s', boxShadow: `0 0 ${exp('canais') ? 10 : 6}px ${c.color}88` }} />
                </div>
                {exp('canais') && <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 5 }}>{(() => { const match = c.canal === 'Blog/SEO' ? 'Blog' : c.canal; return acoes.filter(a => a.canal.includes(match)).map(a => <AcaoChip key={a.id} a={a} onToggle={() => toggleAcao(a.id)} onEdit={(f, v) => editAcao(a.id, f, v)} isAdmin={isAdmin} />) })()}</div>}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 9, color: exp('canais') ? '#facc15' : 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 12 }}>
            {exp('canais') ? 'Clique novamente para editar' : 'Clique para ampliar'}<ChevronRight size={8} />
          </p>
        </MiniCard>
      </div>

      {/* Modal — Todas as Ações */}
      {modal === 'execucao' && (
        <Modal title="Todas as Ações" onClose={() => { setModal(null); setExpanded(null); setShowNovaAcao(false) }} wide>
          {isAdmin && <AdminBar onNova={() => setShowNovaAcao(v => !v)} onSave={handleSave} />}
          {isAdmin && showNovaAcao && <NovaAcaoForm onAdd={addAcao} onClose={() => setShowNovaAcao(false)} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {periodos.map(p => (
              <div key={p.orig}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, marginTop: 4 }}>{p.label}</p>
                {p.acoes.map(a => <AcaoRow key={a.id} a={a} onToggle={() => toggleAcao(a.id)} onEdit={(f, v) => editAcao(a.id, f, v)} onDelete={() => deleteAcao(a.id)} isAdmin={isAdmin} />)}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal — Calendário */}
      {modal === 'periodos' && (
        <Modal title="Calendário de Ações" onClose={() => { setModal(null); setExpanded(null); setShowNovaAcao(false) }}>
          {isAdmin && <AdminBar onNova={() => setShowNovaAcao(v => !v)} onSave={handleSave} />}
          {isAdmin && showNovaAcao && <NovaAcaoForm onAdd={addAcao} onClose={() => setShowNovaAcao(false)} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {periodos.map((p, i) => (
              <div key={p.orig} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 14, border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <EditableField value={p.label} onChange={v => editPeriodo(i, v)} isAdmin={isAdmin} style={{ color: '#fff', fontWeight: 700, fontSize: 13 }} />
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, flexShrink: 0 }}>{p.done} concluídas · {p.inProg} em andamento · {p.pending} pendentes</span>
                </div>
                {p.acoes.map(a => <AcaoRow key={a.id} a={a} onToggle={() => toggleAcao(a.id)} onEdit={(f, v) => editAcao(a.id, f, v)} onDelete={() => deleteAcao(a.id)} isAdmin={isAdmin} />)}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Modal — Canais */}
      {modal === 'canais' && (
        <Modal title="Canais de Atuação" onClose={() => { setModal(null); setExpanded(null); setShowNovaAcao(false) }}>
          {isAdmin && <AdminBar onNova={() => setShowNovaAcao(v => !v)} onSave={handleSave} />}
          {isAdmin && showNovaAcao && <NovaAcaoForm onAdd={addAcao} onClose={() => setShowNovaAcao(false)} />}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {canaisData.map((c, i) => {
              const match = c.canal === 'Blog/SEO' ? 'Blog' : c.canal
              return (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <EditableField value={c.displayLabel} onChange={v => editCanalLabel(i, v)} isAdmin={isAdmin} style={{ color: c.color, fontWeight: 700, fontSize: 13 }} />
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, flexShrink: 0 }}>{c.executado}/{c.planejado} ações</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden', marginBottom: 10 }}>
                    <div style={{ height: '100%', width: `${c.planejado > 0 ? (c.executado / c.planejado) * 100 : 0}%`, background: c.color, borderRadius: 99, boxShadow: `0 0 8px ${c.color}88` }} />
                  </div>
                  {acoes.filter(a => a.canal.includes(match)).map(a => <AcaoRow key={a.id} a={a} onToggle={() => toggleAcao(a.id)} onEdit={(f, v) => editAcao(a.id, f, v)} onDelete={() => deleteAcao(a.id)} isAdmin={isAdmin} />)}
                </div>
              )
            })}
          </div>
        </Modal>
      )}
    </>
  )
}
