import React, { useState, useRef, useEffect } from "react"
import { Sparkles, Clock, Pencil, Check, Camera } from "lucide-react"
import type { GradientOption } from "../../lib/types"
import HeaderMiniCharts from "./HeaderMiniCharts"
import { useFontSettings } from "../../lib/FontSettingsContext"

interface EditableFieldProps {
  value: string
  onChange: (v: string) => void
  className?: string
  style?: React.CSSProperties
  multiline?: boolean
}

function EditableField({ value, onChange, className = '', style, multiline }: EditableFieldProps) {
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
      style,
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
      <span className={className} style={style}>{value}</span>
      <Pencil size={12} className="text-white/40 group-hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100" />
    </span>
  )
}

interface StatItem { value: string; label: string }

export default function HeroHeader({ accentGradient }: { accentGradient?: GradientOption }) {
  const gradientCss = accentGradient?.css || 'linear-gradient(135deg, #3B6AF5, #7B35EF)'
  const { fontSettings } = useFontSettings()

  const [photo, setPhoto] = useState<string | null>(null)
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
      if (ev.target?.result && typeof ev.target.result === 'string') setPhoto(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  return (
    <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{ background: gradientCss }}>
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-400/30 blur-3xl" />
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30 cursor-pointer relative group overflow-hidden flex-shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            {photo
              ? <img src={photo} alt="AF" className="w-full h-full object-cover rounded-full" />
              : <span className="text-2xl font-black">AF</span>
            }
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={14} className="text-blue-200" />
              <EditableField value={tagline} onChange={setTagline} className="text-xs font-medium text-blue-200 tracking-wider uppercase" />
            </div>

            <h1 className="leading-tight">
              <EditableField
                value={companyName}
                onChange={setCompanyName}
                className="font-bold text-white"
                style={{
                  fontSize: `${fontSettings.titulo.size}px`,
                  textAlign: fontSettings.titulo.align,
                }}
              />
            </h1>

            <p className="mt-1">
              <EditableField
                value={subtitle}
                onChange={setSubtitle}
                className="text-blue-100"
                style={{
                  fontSize: `${fontSettings.subtitulo1.size}px`,
                  textAlign: fontSettings.subtitulo1.align,
                }}
              />
            </p>

            <p className="mt-1 hidden md:block">
              <EditableField
                value={description}
                onChange={setDescription}
                className="text-blue-200/70 leading-relaxed"
                style={{
                  fontSize: `${fontSettings.subtitulo2.size}px`,
                  textAlign: fontSettings.subtitulo2.align,
                }}
                multiline
              />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
          <Clock size={14} className="text-blue-200" />
          <div className="text-right">
            <p className="text-xs text-blue-200">Última atualização</p>
            <p className="text-lg font-bold leading-tight">{time}</p>
            <p className="text-xs text-blue-200">{date}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap gap-6 md:gap-0 md:divide-x divide-white/20">
        {stats.map((s, i) => (
          <div key={i} className="md:flex-1 md:text-center px-4 first:pl-0">
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <EditableField value={s.value} onChange={v => updateStat(i, 'value', v)} className="text-3xl md:text-4xl font-extrabold text-white" />
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              <EditableField value={s.label} onChange={v => updateStat(i, 'label', v)} className="text-xs text-blue-200" />
            </p>
          </div>
        ))}
      </div>

      <HeaderMiniCharts />
    </div>
  )
}
