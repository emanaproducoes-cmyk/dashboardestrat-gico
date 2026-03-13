import React, { useState, useRef, useEffect } from "react"
import { Sparkles, Clock, Pencil, Check, Camera, LogIn, LogOut, ShieldCheck, X } from "lucide-react"
import type { GradientOption } from "../../lib/types"
import HeaderMiniCharts from "./HeaderMiniCharts"

const ADMIN_EMAIL = "emanaproducoes@gmail.com"

// ── Admin Auth Modal ─────────────────────────────────────────────────────────
interface AdminLoginModalProps {
  onClose: () => void
  onLogin: () => void
}

function AdminLoginModal({ onClose, onLogin }: AdminLoginModalProps) {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = () => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      onLogin()
      onClose()
    } else {
      setError("E-mail não autorizado.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={20} className="text-blue-500" />
          <h2 className="text-base font-semibold text-gray-800">Acesso Administrativo</h2>
        </div>

        <label className="block text-xs text-gray-500 mb-1.5">E-mail do administrador</label>
        <input
          type="email"
          autoFocus
          value={email}
          onChange={e => { setEmail(e.target.value); setError("") }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="seu@email.com"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent transition"
        />
        {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-sm font-medium py-2 rounded-lg transition-all"
        >
          Entrar
        </button>
      </div>
    </div>
  )
}

// ── Editable Field ───────────────────────────────────────────────────────────
interface EditableFieldProps {
  value: string
  onChange: (v: string) => void
  className?: string
  multiline?: boolean
  isAdmin: boolean
}

function EditableField({ value, onChange, className = "", multiline, isAdmin }: EditableFieldProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  const save = () => {
    onChange(draft)
    setEditing(false)
  }

  if (editing && isAdmin) {
    const sharedProps = {
      autoFocus: true,
      value: draft,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onKeyDown: (e: React.KeyboardEvent) => { if (e.key === "Enter" && !multiline) save() },
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
    <span
      className={`inline-flex items-center gap-1 ${isAdmin ? "group cursor-pointer" : "cursor-default"}`}
      onClick={() => isAdmin && setEditing(true)}
    >
      <span className={className}>{value}</span>
      {isAdmin && (
        <Pencil
          size={12}
          className="text-white/40 group-hover:text-white/80 transition-colors opacity-0 group-hover:opacity-100"
        />
      )}
    </span>
  )
}

// ── Types ────────────────────────────────────────────────────────────────────
interface StatItem {
  value: string
  label: string
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function EditableHeroHeader({ accentGradient }: { accentGradient?: GradientOption }) {
  const gradientCss = accentGradient?.css || "linear-gradient(135deg, #3B6AF5, #7B35EF)"

  const [isAdmin, setIsAdmin]     = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [photo, setPhoto]               = useState<string | null>(null)
  const [companyName, setCompanyName]   = useState("AF Consultoria & Projetos")
  const [tagline, setTagline]           = useState("Inteligência Estratégica de Marketing")
  const [subtitle, setSubtitle]         = useState("Centro de Inteligência de Marketing Estratégico 2026")
  const [description, setDescription]   = useState(
    "Análise em tempo real e insights estratégicos para decisões de marketing baseadas em dados. Monitore KPIs, acompanhe performance e otimize sua estratégia multicanal."
  )
  const [stats, setStats] = useState<StatItem[]>([
    { value: "200",    label: "Meta Anual LinkedIn" },
    { value: "500",    label: "Meta Anual YouTube" },
    { value: "70-105", label: "Conversão Instagram" },
    { value: "3-4",    label: "Cases de Sucesso" },
  ])
  const [now, setNow] = useState(new Date())
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  const date = now.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      if (ev.target?.result && typeof ev.target.result === "string") {
        setPhoto(ev.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const updateStat = (i: number, field: keyof StatItem, val: string) => {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  return (
    <>
      {showModal && (
        <AdminLoginModal
          onClose={() => setShowModal(false)}
          onLogin={() => setIsAdmin(true)}
        />
      )}

      <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{ background: gradientCss }}>

        {/* Botão admin — canto superior direito do card */}
        <button
          onClick={() => isAdmin ? setIsAdmin(false) : setShowModal(true)}
          title={isAdmin ? "Sair do modo admin" : "Entrar como admin"}
          className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-semibold transition-all
            bg-white/10 hover:bg-white/25 border border-white/20 text-white/70 hover:text-white"
        >
          {isAdmin
            ? <><LogOut size={11} /> Sair</>
            : <><LogIn size={11} /> Admin</>
          }
        </button>

        {/* Indicador de modo edição */}
        {isAdmin && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-300/40">
            <ShieldCheck size={11} className="text-yellow-300" />
            <span className="text-[10px] font-semibold text-yellow-200">Modo edição ativo — clique nos textos para editar</span>
          </div>
        )}

        {/* Blobs decorativos */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-400/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-300/20 blur-3xl" />
        </div>

        {/* Linha principal */}
        <div className="relative flex items-start justify-between gap-4 mt-4">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30 relative group overflow-hidden flex-shrink-0 ${isAdmin ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => isAdmin && fileRef.current?.click()}
            >
              {photo
                ? <img src={photo} alt="AF" className="w-full h-full object-cover rounded-full" />
                : <span className="text-xl font-black">AF</span>
              }
              {isAdmin && (
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={14} className="text-white" />
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <Sparkles size={11} className="text-blue-200 flex-shrink-0" />
                <EditableField value={tagline} onChange={setTagline} className="text-[10px] font-semibold text-blue-200 uppercase tracking-widest" isAdmin={isAdmin} />
              </div>
              <h1 className="leading-tight">
                <EditableField value={companyName} onChange={setCompanyName} className="text-2xl font-extrabold text-white" isAdmin={isAdmin} />
              </h1>
              <p className="mt-1">
                <EditableField value={subtitle} onChange={setSubtitle} className="text-sm text-blue-100/80" isAdmin={isAdmin} />
              </p>
              <p className="mt-1 hidden md:block">
                <EditableField value={description} onChange={setDescription} className="text-xs text-blue-200/60 leading-relaxed" multiline isAdmin={isAdmin} />
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

        {/* Stats com hover */}
        <div className="relative mt-8 pt-6 border-t border-white/15 flex flex-wrap gap-3 md:gap-0 md:divide-x divide-white/20">
          {stats.map((s, i) => (
            <div
              key={i}
              className="md:flex-1 md:text-center px-4 first:pl-0 group transition-transform duration-200 hover:scale-105 cursor-default"
            >
              <div className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none">
                <EditableField
                  value={s.value}
                  onChange={v => updateStat(i, "value", v)}
                  className="text-3xl md:text-4xl font-extrabold text-white transition-colors duration-200 group-hover:text-yellow-300"
                  isAdmin={isAdmin}
                />
              </div>
              <p className="text-[11px] text-blue-200 mt-1">
                <EditableField
                  value={s.label}
                  onChange={v => updateStat(i, "label", v)}
                  className="text-[11px] text-blue-200 transition-colors duration-200 group-hover:text-white"
                  isAdmin={isAdmin}
                />
              </p>
            </div>
          ))}
        </div>

        {/* Mini charts — sem alterações */}
        <div className="mt-6">
          <HeaderMiniCharts />
        </div>
      </div>
    </>
  )
}
