import React, { useState, useRef, useEffect } from "react"
import { useAuth } from "../../lib/AuthContext"
import { getUserItem, setUserItem } from "../../lib/auth"
import { Sparkles, Clock, Pencil, Check, Camera } from "lucide-react"
import type { GradientOption } from "../../lib/types"

interface EditableFieldProps {
  value: string
  onChange: (v: string) => void
  className?: string
  multiline?: boolean
}

function EditableField({ value, onChange, className = '', multiline }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  const save = () => { onChange(draft); setEditing(false) }
  if (editing) {
    const sharedProps = {
      autoFocus: true,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !multiline) save() },
      className: `bg-white/20 border border-white/40 rounded px-2 py-1 text-white outline-none min-w-[120px] ${className}`,
    }
    return (
      <span className="inline-flex items-center gap-1">
        {multiline
          ? <textarea {...sharedProps} className={`${sharedProps.className} resize-none min-w-[200px]`} rows={2} />
          : <input {...sharedProps} />
        }
        <button onClick={save} className="p-1 bg-white/30 rounded hover:bg-white/50"><Check size={12} className="text-white" /></button>
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 group cursor-pointer" onClick={() => setEditing(true)}>
      <span className={className}>{value}</span>
      <Pencil size={12} className="text-white/40 group-hover:text-white/80 opacity-0 group-hover:opacity-100 transition-all" />
    </span>
  )
}

interface StatItem { value: string; label: string }

export default function EditableHeroHeader({ accentGradient }: { accentGradient?: GradientOption }) {
  const gradientCss = accentGradient?.css || 'linear-gradient(135deg, #3B6AF5, #7B35EF)'
  const { user } = useAuth()
  const uid = user?.id ?? 'guest'
  const [photo, setPhoto] = useState<string | null>(() => {
    try { return getUserItem(uid, 'hero_photo') } catch { return null }
  })
  const [companyName, setCompanyName] = useState("AF Consultoria & Projetos")
  const [tagline, setTagline] = useState("Inteligência Estratégica de Marketing")
  const [subtitle, setSubtitle] = useState("Centro de Inteligência de Marketing Estratégico 2026")
  const [description, setDescription] = useState("Análise em tempo real e insights estratégicos para decisões de marketing baseadas em dados. Monitore KPIs, acompanhe performance e otimize sua estratégia multicanal.")
  const [stats, setStats] = useState<StatItem[]>([
    { value: "200", label: "Meta Anual LinkedIn" },
    { value: "500", label: "Meta Anual YouTube" },
    { value: "70-105", label: "Conversão Instagram" },
    { value: "3-4", label: "Cases de Sucesso" },
  ])
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [now, setNow] = useState(new Date())
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  const date = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result && typeof ev.target.result === 'string') {
        setPhoto(ev.target.result)
        try { setUserItem(uid, 'hero_photo', ev.target.result) } catch {}
      }
    }
    reader.readAsDataURL(file)
  }

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  const statAccents = ["#60a5fa", "#34d399", "#f472b6", "#fbbf24"]

  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white"
      style={{
        background: gradientCss,
        width: "1565px",
        height: "759px",
        maxWidth: "100%",
        padding: "48px 64px 36px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative flex flex-row items-center gap-6">
        <div
          className="w-36 h-36 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30 cursor-pointer relative group overflow-hidden flex-shrink-0"
          onClick={() => fileRef.current?.click()}
        >
          {photo
            ? <img src={photo} alt="AF" className="w-full h-full object-cover rounded-full" />
            : <span className="text-5xl font-black">AF</span>
          }
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera size={22} className="text-white" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

        <div className="flex-1 text-center px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} className="text-blue-200" />
            <EditableField value={tagline} onChange={setTagline} className="text-sm font-medium text-blue-200 uppercase tracking-widest" />
          </div>
          <h1 className="leading-tight mb-3">
            <EditableField value={companyName} onChange={setCompanyName} className="text-5xl font-extrabold text-white" />
          </h1>
          <div className="mb-3">
            <EditableField value={subtitle} onChange={setSubtitle} className="text-xl text-blue-100 font-light" />
          </div>
          <div className="max-w-2xl mx-auto">
            <EditableField value={description} onChange={setDescription} className="text-sm text-blue-200/80 leading-relaxed" multiline />
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20 flex-shrink-0">
          <Clock size={18} className="text-blue-200" />
          <div className="text-right">
            <p className="text-sm text-blue-200">Última atualização</p>
            <p className="text-2xl font-bold leading-tight">{time}</p>
            <p className="text-sm text-blue-200">{date}</p>
          </div>
        </div>
      </div>

      <div className="relative flex divide-x divide-white/20 border-t border-white/20 pt-6">
        {stats.map((s, i) => {
          const isHov = hoveredStat === i
          return (
            <div
              key={i}
              className="flex-1 text-center px-6 cursor-pointer select-none"
              style={{ transition: 'transform 0.2s ease', transform: isHov ? 'scale(1.1)' : 'scale(1)' }}
              onMouseEnter={() => setHoveredStat(i)}
              onMouseLeave={() => setHoveredStat(null)}
            >
              <div
                className="text-4xl font-extrabold leading-tight"
                style={{
                  color: isHov ? statAccents[i] : 'white',
                  textShadow: isHov ? `0 0 32px ${statAccents[i]}90` : 'none',
                  transition: 'color 0.2s, text-shadow 0.2s',
                }}
              >
                <EditableField value={s.value} onChange={v => updateStat(i, 'value', v)} className="font-extrabold" />
              </div>
              <p
                className="text-sm mt-1 font-medium"
                style={{
                  color: isHov ? statAccents[i] : 'rgba(255,255,255,0.75)',
                  transition: 'color 0.2s',
                }}
              >
                <EditableField value={s.label} onChange={v => updateStat(i, 'label', v)} className="text-sm font-medium" />
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
