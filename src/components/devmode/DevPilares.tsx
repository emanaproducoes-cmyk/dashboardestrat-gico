import React, { useState } from "react"
import { Plus, Trash2, Save, Award, Radio, Users, Target, Star, Zap, Globe, Heart, Shield, TrendingUp, RotateCcw } from "lucide-react"
import { usePlanningData } from "../../lib/PlanningDataContext"
import type { GradientOption } from "../../lib/types"

interface PageProps { darkMode?: boolean; accentGradient?: GradientOption }

const ICON_OPTIONS = [
  { id: "Award",     icon: Award,      label: "Prêmio"    },
  { id: "Radio",     icon: Radio,      label: "Canal"     },
  { id: "Users",     icon: Users,      label: "Usuários"  },
  { id: "Target",    icon: Target,     label: "Alvo"      },
  { id: "Star",      icon: Star,       label: "Estrela"   },
  { id: "Zap",       icon: Zap,        label: "Raio"      },
  { id: "Globe",     icon: Globe,      label: "Globo"     },
  { id: "Heart",     icon: Heart,      label: "Coração"   },
  { id: "Shield",    icon: Shield,     label: "Escudo"    },
  { id: "TrendingUp",icon: TrendingUp, label: "Tendência" },
]

const GRADIENT_OPTIONS = [
  { id: "from-violet-600 to-purple-800",  label: "Violeta",  preview: "linear-gradient(135deg,#7c3aed,#6b21a8)" },
  { id: "from-blue-600 to-cyan-700",      label: "Azul",     preview: "linear-gradient(135deg,#2563eb,#0e7490)" },
  { id: "from-rose-600 to-pink-800",      label: "Rosa",     preview: "linear-gradient(135deg,#e11d48,#9d174d)" },
  { id: "from-amber-500 to-orange-700",   label: "Âmbar",    preview: "linear-gradient(135deg,#f59e0b,#c2410c)" },
  { id: "from-emerald-500 to-teal-700",   label: "Verde",    preview: "linear-gradient(135deg,#10b981,#0f766e)" },
  { id: "from-sky-500 to-blue-700",       label: "Céu",      preview: "linear-gradient(135deg,#0ea5e9,#1d4ed8)" },
  { id: "from-fuchsia-500 to-purple-700", label: "Fúcsia",   preview: "linear-gradient(135deg,#d946ef,#7e22ce)" },
  { id: "from-red-500 to-rose-700",       label: "Vermelho", preview: "linear-gradient(135deg,#ef4444,#be123c)" },
]

const DEFAULT_PILARES = [
  { id: "autoridade",    label: "Autoridade Digital",      icon: "Award",  gradient: "from-violet-600 to-purple-800", desc: "Posicionamento como referência em FNO" },
  { id: "multichannel",  label: "Estratégia Multichannel", icon: "Radio",  gradient: "from-blue-600 to-cyan-700",    desc: "LinkedIn, YouTube, Instagram, Blog" },
  { id: "provasSocial",  label: "Prova Social",            icon: "Users",  gradient: "from-rose-600 to-pink-800",    desc: "Cases de sucesso e depoimentos" },
  { id: "posicionamento",label: "Posicionamento",          icon: "Target", gradient: "from-amber-500 to-orange-700", desc: "Consolidação da marca AF" },
]

export default function DevPilares({ darkMode = true, accentGradient }: PageProps) {
  const { data, saveSection } = usePlanningData()
  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }

  // Pilares vêm do Firestore via planning.pilares ou usam defaults
  const pilaresFirestore = (data as any).pilares as typeof DEFAULT_PILARES | undefined
  const [pilares, setPilares] = useState<typeof DEFAULT_PILARES>(
    pilaresFirestore?.length ? pilaresFirestore : DEFAULT_PILARES
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const cardBg    = darkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.95)"
  const cardBorder= darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const inputBg   = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.04)"
  const inputBorder = darkMode ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"
  const textPrimary   = darkMode ? "text-white"    : "text-gray-900"
  const textSecondary = darkMode ? "text-white/50" : "text-gray-500"

  const inputStyle: React.CSSProperties = {
    background: inputBg,
    border: `1px solid ${inputBorder}`,
    color: darkMode ? "#fff" : "#111827",
    borderRadius: 10, padding: "8px 12px", fontSize: 13,
    outline: "none", width: "100%",
  }

  const update = (idx: number, field: string, val: string) => {
    setPilares(prev => prev.map((p, i) => i === idx ? { ...p, [field]: val } : p))
  }

  const addPilar = () => {
    setPilares(prev => [...prev, {
      id: `p_${Date.now()}`, label: "Novo Pilar",
      icon: "Star", gradient: "from-emerald-500 to-teal-700",
      desc: "Descrição do pilar estratégico"
    }])
  }

  const removePilar = (idx: number) => {
    setPilares(prev => prev.filter((_, i) => i !== idx))
  }

  const handleSave = async () => {
    setSaving(true)
    await saveSection("pilares" as any, pilares as any)
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => setPilares(DEFAULT_PILARES)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`text-xl font-extrabold ${textPrimary}`}>Pilares Estratégicos</h2>
          <p className={`text-sm mt-0.5 ${textSecondary}`}>
            Edite os pilares que aparecem na página Visão Geral. Salve para todos os usuários verem.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleReset}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium ${textSecondary}`}
            style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <RotateCcw size={12} /> Restaurar padrão
          </button>
          <button onClick={addPilar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background: accent.css }}>
            <Plus size={13} /> Novo Pilar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pilares.map((pilar, idx) => {
          const IconComp = ICON_OPTIONS.find(i => i.id === pilar.icon)?.icon || Star
          const gradObj  = GRADIENT_OPTIONS.find(g => g.id === pilar.gradient)

          return (
            <div key={pilar.id} className="rounded-2xl p-5 space-y-4"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>

              {/* Preview */}
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${cardBorder}` }}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${pilar.gradient} flex items-center justify-center flex-shrink-0`}>
                  <IconComp size={20} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-sm truncate ${textPrimary}`}>{pilar.label}</p>
                  <p className={`text-xs truncate ${textSecondary}`}>{pilar.desc}</p>
                </div>
              </div>

              {/* Label */}
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${textSecondary}`}>Título</label>
                <input value={pilar.label} style={inputStyle}
                  onChange={e => update(idx, "label", e.target.value)}
                  placeholder="Ex: Autoridade Digital" />
              </div>

              {/* Desc */}
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${textSecondary}`}>Descrição</label>
                <input value={pilar.desc} style={inputStyle}
                  onChange={e => update(idx, "desc", e.target.value)}
                  placeholder="Ex: Posicionamento como referência em FNO" />
              </div>

              {/* Ícone */}
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${textSecondary}`}>Ícone</label>
                <div className="flex gap-1.5 flex-wrap">
                  {ICON_OPTIONS.map(opt => {
                    const I = opt.icon
                    const active = pilar.icon === opt.id
                    return (
                      <button key={opt.id} onClick={() => update(idx, "icon", opt.id)} title={opt.label}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                        style={{
                          background: active ? accent.css : (darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"),
                          border: `1px solid ${active ? "transparent" : cardBorder}`,
                        }}>
                        <I size={14} style={{ color: active ? "#fff" : (darkMode ? "rgba(255,255,255,0.55)" : "#6b7280") }} />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Gradiente */}
              <div>
                <label className={`text-[10px] font-bold uppercase tracking-wider block mb-2 ${textSecondary}`}>Cor do Ícone</label>
                <div className="flex gap-1.5 flex-wrap">
                  {GRADIENT_OPTIONS.map(g => (
                    <button key={g.id} onClick={() => update(idx, "gradient", g.id)} title={g.label}
                      className="w-7 h-7 rounded-lg transition-all"
                      style={{
                        background: g.preview,
                        border: pilar.gradient === g.id ? "2px solid white" : "2px solid transparent",
                        boxShadow: pilar.gradient === g.id ? "0 0 0 2px rgba(255,255,255,0.3)" : "none",
                      }} />
                  ))}
                </div>
              </div>

              {/* Remove */}
              {pilares.length > 1 && (
                <button onClick={() => removePilar(idx)}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors">
                  <Trash2 size={12} /> Remover pilar
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all"
          style={{ background: saved ? "linear-gradient(135deg,#22c55e,#16a34a)" : accent.css, opacity: saving ? 0.7 : 1 }}>
          <Save size={15} />
          {saving ? "Salvando..." : saved ? "✓ Salvo para todos!" : "Salvar para todos os usuários"}
        </button>
      </div>
    </div>
  )
}
