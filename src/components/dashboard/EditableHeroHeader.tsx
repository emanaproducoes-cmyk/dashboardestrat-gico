import React, { useState, useRef, useEffect } from "react"
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

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  const save = () => {
    onChange(draft)
    setEditing(false)
  }

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
        <button onClick={save} className="p-1 bg-white/30 rounded hover:bg-white/50 transition-colors">
          <Check size={12} className="text-white" />
        </button>
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 group cursor-pointer" onClick={() => setEditing(true)}>
      <span className={className}>{value}</span>
      <Pencil size={12} className="text-white/40 group-hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100" />
    </span>
  )
}

interface StatItem {
  value: string
  label: string
}

export default function EditableHeroHeader({ accentGradient }: { accentGradient?: GradientOption }) {
  const gradientCss = accentGradient?.css || 'linear-gradient(135deg, #3B6AF5, #7B35EF)'
  const [photo, setPhoto] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState("AF Consultoria & Projetos")
  const [tagline, setTagline] = useState("Inteligência Estratégica de Marketing")
  const [subtitle, setSubtitle] = useState("Centro de Inteligência de Marketing Estratégico 2026")
  const [description, setDescription] = useState(
    "Análise em tempo real e insights estratégicos para decisões de marketing baseadas em dados. Monitore KPIs, acompanhe performance e otimize sua estratégia multicanal."
  )
  const [stats, setStats] = useState<StatItem[]>([
    { value: "200", label: "Meta Anual LinkedIn" },
    { value: "500", label: "Meta Anual YouTube" },
    { value: "70-105", label: "Conversão Instagram" },
    { value: "3-4", label: "Cases de Sucesso" },
  ])
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
      }
    }
    reader.readAsDataURL(file)
  }

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl text-white"
      style={{
        background: gradientCss,
        width: "1565px",
        height: "659px",
        maxWidth: "100%",
        padding: "52px 64px",
        boxSizing: "border-box",
      }}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-400/30 blur-3xl" />
      </div>

      <div className="relative flex flex-row items-center justify-between gap-6 h-full">
        <div className="flex items-center gap-7">
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

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-blue-200" />
              <span className="text-sm font-medium text-blue-200 tracking-wider uppercase">
                <EditableField value={tagline} onChange={setTagline} className="text-sm font-medium text-blue-200 uppercase tracking-wider" />
              </span>
            </div>
            <h1 className="leading-tight mb-2">
              <EditableField value={companyName} onChange={setCompanyName} className="text-5xl font-bold text-white" />
            </h1>
            <p className="mb-2">
              <EditableField value={subtitle} onChange={setSubtitle} className="text-lg text-blue-100" />
            </p>
            <p>
              <EditableField value={description} onChange={setDescription} className="text-sm text-blue-200/70 max-w-2xl" multiline />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/20 flex-shrink-0">
          <Clock size={18} className="text-blue-200" />
          <div className="text-right">
            <p className="text-sm text-blue-200">Última atualização</p>
            <p className="text-2xl font-bold leading-tight">{time}</p>
            <p className="text-sm text-blue-200">{date}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-10 flex divide-x divide-white/20">
        {stats.map((s, i) => (
          <div key={i} className="flex-1 text-center px-6 first:pl-0">
            <div className="leading-tight">
              <EditableField value={s.value} onChange={v => updateStat(i, 'value', v)} className="text-5xl font-extrabold text-white" />
            </div>
            <p className="text-sm text-blue-200 mt-1">
              <EditableField value={s.label} onChange={v => updateStat(i, 'label', v)} className="text-sm text-blue-200" />
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
