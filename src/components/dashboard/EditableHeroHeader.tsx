import React, { useState, useRef, useEffect } from "react"
import { Sparkles, Clock, Pencil, Check, Camera, Shield } from "lucide-react"
import type { GradientOption } from "../../lib/types"
import { useAuth } from "../../lib/AuthContext"
import { getGlobalItem, setGlobalItem } from "../../lib/auth"
import HeaderMiniCharts from "./HeaderMiniCharts"
import { useFontSettings } from "../../lib/FontSettingsContext"
import { useUserPhoto } from "../../lib/UserPhotoContext"
import { usePlanningData } from "../../lib/PlanningDataContext"

interface EditableFieldProps {
  value: string
  onChange: (v: string) => void
  className?: string
  style?: React.CSSProperties
  multiline?: boolean
  isAdmin: boolean
}

function EditableField({ value, onChange, className = "", style, multiline, isAdmin }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  useEffect(() => { if (!editing) setDraft(value) }, [value, editing])
  const save = () => { onChange(draft); setEditing(false) }

  if (!isAdmin) return <span className={className} style={style}>{value}</span>

  if (editing) {
    const sharedProps = {
      autoFocus: true,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" && !multiline) save() },
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
const statAccents = ["#60a5fa", "#34d399", "#f472b6", "#fbbf24"]

function StatCard({ s, i, onUpdateValue, onUpdateLabel, isAdmin }: {
  s: StatItem, i: number,
  onUpdateValue: (v: string) => void,
  onUpdateLabel: (v: string) => void,
  isAdmin: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      className="md:flex-1 md:text-center px-4 first:pl-0 cursor-default select-none"
      style={{ transition: 'transform 0.2s ease', transform: hovered ? 'scale(1.1)' : 'scale(1)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none"
        style={{ color: hovered ? statAccents[i] : 'white', textShadow: hovered ? `0 0 24px ${statAccents[i]}80` : 'none', transition: 'color 0.2s, text-shadow 0.2s' }}>
        <EditableField value={s.value} onChange={onUpdateValue} className="font-extrabold" isAdmin={isAdmin} />
      </div>
      <p className="text-[11px] mt-1"
        style={{ color: hovered ? statAccents[i] : 'rgba(191,219,254,0.8)', transition: 'color 0.2s' }}>
        <EditableField value={s.label} onChange={onUpdateLabel} className="text-[11px]" isAdmin={isAdmin} />
      </p>
    </div>
  )
}

const DEFAULTS = {
  companyName: "AF Consultoria & Projetos",
  tagline: "Inteligência Estratégica de Marketing",
  subtitle: "Centro de Inteligência de Marketing Estratégico 2026",
  description: "Análise em tempo real e insights estratégicos para decisões de marketing baseadas em dados. Monitore KPIs, acompanhe performance e otimize sua estratégia multicanal.",
  stats: [
    { value: "200", label: "Meta Anual LinkedIn" },
    { value: "500", label: "Meta Anual YouTube" },
    { value: "70-105", label: "Conversão Instagram" },
    { value: "3-4", label: "Cases de Sucesso" },
  ]
}

export default function EditableHeroHeader({ accentGradient }: { accentGradient?: GradientOption }) {
  const gradientCss = accentGradient?.css || "linear-gradient(135deg, #3B6AF5, #7B35EF)"
  const { user } = useAuth()
  const isAdmin = user?.isAdmin ?? false
  const { fontSettings } = useFontSettings()
  const { photo, savePhoto } = useUserPhoto()
  const { data: planningData } = usePlanningData()

  const [companyName, setCompanyName] = useState(
    planningData.empresa.nome || getGlobalItem('hero_companyName') || DEFAULTS.companyName
  )
  const [tagline, setTagline] = useState(
    planningData.empresa.segmento || getGlobalItem('hero_tagline') || DEFAULTS.tagline
  )
  const [subtitle, setSubtitle] = useState(
    planningData.missaoVisao.missao?.slice(0, 80) || getGlobalItem('hero_subtitle') || DEFAULTS.subtitle
  )
  const [description, setDescription] = useState(
    planningData.missaoVisao.visao || getGlobalItem('hero_description') || DEFAULTS.description
  )
  const [stats, setStats] = useState<StatItem[]>(() => {
    const saved = getGlobalItem('hero_stats')
    if (saved) return JSON.parse(saved)
    if (planningData.kpis.filter(k => k.indicador).length > 0) {
      return planningData.kpis.filter(k => k.indicador).slice(0, 4).map(k => ({
        value: k.meta || "—", label: k.indicador
      }))
    }
    return DEFAULTS.stats
  })
  const [now, setNow] = useState(new Date())
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (planningData.empresa.nome) setCompanyName(planningData.empresa.nome)
  }, [planningData.empresa.nome])

  useEffect(() => {
    if (planningData.empresa.segmento) setTagline(planningData.empresa.segmento)
  }, [planningData.empresa.segmento])

  useEffect(() => {
    if (planningData.missaoVisao.missao) setSubtitle(planningData.missaoVisao.missao.slice(0, 80))
  }, [planningData.missaoVisao.missao])

  useEffect(() => {
    if (planningData.missaoVisao.visao) setDescription(planningData.missaoVisao.visao)
  }, [planningData.missaoVisao.visao])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const save = (key: string, value: string) => { if (isAdmin) setGlobalItem(key, value) }
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  const date = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result && typeof ev.target.result === "string") savePhoto(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    const next = stats.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
    setStats(next)
    setGlobalItem('hero_stats', JSON.stringify(next))
  }

  const avatarSize = fontSettings.avatarSize || 64

  return (
    <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{ background: gradientCss }}>
      {isAdmin && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-300/40">
          <Shield size={11} className="text-yellow-300" />
          <span className="text-[10px] font-semibold text-yellow-200">Modo edição ativo — clique nos textos para editar</span>
        </div>
      )}

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-400/30 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-300/20 blur-3xl" />
      </div>

      <div className="relative flex items-start justify-between gap-4 mt-4">
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30 relative group overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-200"
            style={{ width: `${avatarSize}px`, height: `${avatarSize}px` }}
            onClick={() => fileRef.current?.click()}
          >
            {photo
              ? <img src={photo} alt="avatar" className="w-full h-full object-cover rounded-full" />
              : <span className="font-black text-white" style={{ fontSize: `${avatarSize * 0.3}px` }}>
                  {planningData.empresa.nome?.slice(0, 2).toUpperCase() || "AF"}
                </span>
            }
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera size={14} className="text-white" />
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles size={11} className="text-blue-200 flex-shrink-0" />
              <EditableField
                value={tagline}
                onChange={v => { setTagline(v); save('hero_tagline', v) }}
                className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest"
                isAdmin={isAdmin}
              />
            </div>
            <h1 className="leading-tight">
              <EditableField
                value={companyName}
                onChange={v => { setCompanyName(v); save('hero_companyName', v) }}
                className="font-extrabold text-white"
                style={{ fontSize: `${fontSettings.titulo.size}px`, textAlign: fontSettings.titulo.align }}
                isAdmin={isAdmin}
              />
            </h1>
            <p className="mt-1">
              <EditableField
                value={subtitle}
                onChange={v => { setSubtitle(v); save('hero_subtitle', v) }}
                className="text-blue-100/80"
                style={{ fontSize: `${fontSettings.subtitulo1.size}px`, textAlign: fontSettings.subtitulo1.align }}
                isAdmin={isAdmin}
              />
            </p>
            <p className="mt-1 hidden md:block">
              <EditableField
                value={description}
                onChange={v => { setDescription(v); save('hero_description', v) }}
                className="text-blue-200/60 leading-relaxed"
                style={{ fontSize: `${fontSettings.subtitulo2.size}px`, textAlign: fontSettings.subtitulo2.align }}
                multiline
                isAdmin={isAdmin}
              />
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/20 flex-shrink-0">
          <Clock size={12} className="text-blue-200" />
          <div className="text-right">
            <p className="text-[10px] text-blue-200 leading-none mb-0.5">Última atualização</p>
            <p className="text-base font-bold leading-tight">{time}</p>
            <p className="text-[10px] text-blue-200">{date}</p>
          </div>
        </div>
      </div>

      <div className="relative mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-3 md:gap-0 md:divide-x divide-white/20">
        {stats.map((s, i) => (
          <StatCard key={i} s={s} i={i}
            onUpdateValue={v => updateStat(i, 'value', v)}
            onUpdateLabel={v => updateStat(i, 'label', v)}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      <div className="mt-6">
        <HeaderMiniCharts />
      </div>
    </div>
  )
}
