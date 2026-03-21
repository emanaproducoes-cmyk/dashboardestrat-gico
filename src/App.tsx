import React, { useState, useEffect } from "react"
import {
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Save, RotateCcw, Eye, Type, Shield, Lock, Circle
} from "lucide-react"
import { useFontSettings, DEFAULT_FONT_SETTINGS, FontSettings, TextAlign } from "../lib/FontSettingsContext"
import { useAuth } from "../lib/AuthContext"
import type { GradientOption } from "../lib/types"

interface PageProps {
  darkMode?: boolean
  accentGradient?: GradientOption
}

const ALIGN_OPTIONS: { value: TextAlign; icon: React.ReactNode; label: string }[] = [
  { value: "left",    icon: <AlignLeft size={15} />,    label: "Esquerda" },
  { value: "center",  icon: <AlignCenter size={15} />,  label: "Centro" },
  { value: "right",   icon: <AlignRight size={15} />,   label: "Direita" },
  { value: "justify", icon: <AlignJustify size={15} />, label: "Justificado" },
]

const LEVEL_META = [
  {
    key: "titulo" as const,
    label: "Título",
    description: "Cabeçalhos principais das seções",
    previewText: "AF Consultoria & Projetos",
    minSize: 18,
    maxSize: 56,
  },
  {
    key: "subtitulo1" as const,
    label: "Subtítulo 1",
    description: "Títulos secundários e destaques",
    previewText: "Centro de Inteligência de Marketing Estratégico 2026",
    minSize: 12,
    maxSize: 36,
  },
  {
    key: "subtitulo2" as const,
    label: "Subtítulo 2",
    description: "Descrições, labels e textos de apoio",
    previewText: "Análise em tempo real e insights estratégicos para decisões de marketing baseadas em dados.",
    minSize: 10,
    maxSize: 24,
  },
]

export default function Configuracoes({ darkMode = true, accentGradient }: PageProps) {
  const { user } = useAuth()
  const { fontSettings, saveFontSettings } = useFontSettings()
  const [draft, setDraft] = useState<FontSettings>(fontSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setDraft(fontSettings) }, [fontSettings])

  const isAdmin = user?.isAdmin ?? false
  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const textPrimary = darkMode ? "text-white" : "text-gray-900"
  const textSecondary = darkMode ? "text-white/50" : "text-gray-500"
  const trackBg = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const previewBg = darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"

  const updateLevel = (key: keyof Omit<FontSettings, 'avatarSize'>, field: "size" | "align", value: number | TextAlign) => {
    setDraft(prev => ({ ...prev, [key]: { ...prev[key], [field]: value } }))
  }

  const handleSave = async () => {
    setSaving(true)
    await saveFontSettings(draft)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => setDraft(DEFAULT_FONT_SETTINGS)

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <Lock size={28} className="text-red-400" />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${textPrimary}`}>Acesso Restrito</h2>
          <p className={`text-sm ${textSecondary}`}>Esta área é exclusiva para administradores.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-1.5 rounded-full" style={{ background: accent.css }} />
          <span className={`text-xs uppercase tracking-widest font-semibold ${textSecondary}`}>Painel Administrativo</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <Shield size={10} className="text-blue-400" />
            <span className="text-[10px] text-blue-400 font-medium">Admin</span>
          </div>
        </div>
        <h1 className={`text-3xl font-extrabold ${textPrimary}`}>Configurações</h1>
        <p className={`text-sm mt-1 ${textSecondary}`}>
          Ajuste tipografia, alinhamento e avatar — as alterações refletem para todos os usuários em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Controles */}
        <div className="space-y-4">

          {/* Avatar size */}
          <div className="flex items-center gap-2 mb-2">
            <Circle size={16} className={textSecondary} />
            <span className={`text-sm font-semibold ${textPrimary}`}>Avatar do Header</span>
          </div>
          <div className="rounded-2xl p-5" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: accent.css }} />
                  <span className={`text-sm font-bold ${textPrimary}`}>Tamanho do círculo</span>
                </div>
                <p className={`text-xs mt-0.5 ml-4 ${textSecondary}`}>Foto de perfil no header de todas as páginas</p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg"
                style={{ background: accent.css + "20", color: accentGradient?.from || "#3b82f6" }}>
                {draft.avatarSize}px
              </span>
            </div>
            <div className="flex items-center gap-4">
              {/* Preview do avatar */}
              <div
                className="rounded-full bg-white/20 flex items-center justify-center ring-2 ring-white/30 flex-shrink-0 text-white font-black transition-all duration-200"
                style={{
                  width: `${draft.avatarSize}px`,
                  height: `${draft.avatarSize}px`,
                  background: accent.css,
                  fontSize: `${draft.avatarSize * 0.3}px`,
                }}
              >
                AF
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] uppercase tracking-wider ${textSecondary}`}>Tamanho</span>
                  <span className={`text-[10px] ${textSecondary}`}>32px — 120px</span>
                </div>
                <div className="relative h-5 flex items-center">
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: trackBg }}>
                    <div className="h-full rounded-full transition-all duration-150"
                      style={{
                        width: `${((draft.avatarSize - 32) / (120 - 32)) * 100}%`,
                        background: accent.css,
                      }} />
                  </div>
                  <input type="range" min={32} max={120} value={draft.avatarSize}
                    onChange={e => setDraft(prev => ({ ...prev, avatarSize: Number(e.target.value) }))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                  <div className="absolute w-4 h-4 rounded-full shadow-lg border-2 border-white pointer-events-none transition-all duration-150"
                    style={{
                      left: `calc(${((draft.avatarSize - 32) / (120 - 32)) * 100}% - 8px)`,
                      background: accent.css,
                    }} />
                </div>
              </div>
            </div>
          </div>

          {/* Tipografia */}
          <div className="flex items-center gap-2 mt-4 mb-2">
            <Type size={16} className={textSecondary} />
            <span className={`text-sm font-semibold ${textPrimary}`}>Tipografia</span>
          </div>

          {LEVEL_META.map((meta) => {
            const level = draft[meta.key]
            return (
              <div key={meta.key} className="rounded-2xl p-5"
                style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: accent.css }} />
                      <span className={`text-sm font-bold ${textPrimary}`}>{meta.label}</span>
                    </div>
                    <p className={`text-xs mt-0.5 ml-4 ${textSecondary}`}>{meta.description}</p>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg"
                    style={{ background: accent.css + "20", color: accentGradient?.from || "#3b82f6" }}>
                    {level.size}px
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] uppercase tracking-wider ${textSecondary}`}>Tamanho</span>
                    <span className={`text-[10px] ${textSecondary}`}>{meta.minSize}px — {meta.maxSize}px</span>
                  </div>
                  <div className="relative h-5 flex items-center">
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: trackBg }}>
                      <div className="h-full rounded-full transition-all duration-150"
                        style={{
                          width: `${((level.size - meta.minSize) / (meta.maxSize - meta.minSize)) * 100}%`,
                          background: accent.css,
                        }} />
                    </div>
                    <input type="range" min={meta.minSize} max={meta.maxSize} value={level.size}
                      onChange={e => updateLevel(meta.key, "size", Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer" />
                    <div className="absolute w-4 h-4 rounded-full shadow-lg border-2 border-white pointer-events-none transition-all duration-150"
                      style={{
                        left: `calc(${((level.size - meta.minSize) / (meta.maxSize - meta.minSize)) * 100}% - 8px)`,
                        background: accent.css,
                      }} />
                  </div>
                </div>

                <div>
                  <span className={`text-[10px] uppercase tracking-wider block mb-1.5 ${textSecondary}`}>Alinhamento</span>
                  <div className="flex gap-1.5">
                    {ALIGN_OPTIONS.map(opt => {
                      const isActive = level.align === opt.value
                      return (
                        <button key={opt.value} onClick={() => updateLevel(meta.key, "align", opt.value)}
                          title={opt.label}
                          className="flex-1 flex items-center justify-center py-2 rounded-lg transition-all duration-150"
                          style={{
                            background: isActive ? accent.css : trackBg,
                            color: isActive ? "#fff" : darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                            border: `1px solid ${isActive ? "transparent" : cardBorder}`,
                          }}>
                          {opt.icon}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}

          <div className="flex gap-3 pt-2">
            <button onClick={handleReset}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${textSecondary}`}
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <RotateCcw size={14} />
              Restaurar padrão
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: saved ? "linear-gradient(135deg,#22c55e,#16a34a)" : accent.css, opacity: saving ? 0.7 : 1 }}>
              <Save size={14} />
              {saving ? "Salvando..." : saved ? "✓ Salvo!" : "Salvar para todos"}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Eye size={16} className={textSecondary} />
            <span className={`text-sm font-semibold ${textPrimary}`}>Preview em tempo real</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${textSecondary}`}
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>ao vivo</span>
          </div>

          <div className="rounded-2xl p-6 sticky top-6" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
            <div className="space-y-6">

              {/* Preview avatar */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent.css }} />
                  <span className={`text-[9px] uppercase tracking-widest font-semibold ${textSecondary}`}>
                    Avatar — {draft.avatarSize}px
                  </span>
                </div>
                <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: previewBg, border: `1px solid ${cardBorder}` }}>
                  <div
                    className="rounded-full flex items-center justify-center text-white font-black flex-shrink-0 ring-2 ring-white/30 transition-all duration-200"
                    style={{
                      width: `${draft.avatarSize}px`,
                      height: `${draft.avatarSize}px`,
                      background: accent.css,
                      fontSize: `${draft.avatarSize * 0.3}px`,
                    }}
                  >
                    AF
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${textPrimary}`}>AF Consultoria</p>
                    <p className={`text-xs ${textSecondary}`}>Header do dashboard</p>
                  </div>
                </div>
              </div>

              {LEVEL_META.map((meta) => {
                const level = draft[meta.key]
                return (
                  <div key={meta.key}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent.css }} />
                      <span className={`text-[9px] uppercase tracking-widest font-semibold ${textSecondary}`}>
                        {meta.label} — {level.size}px
                      </span>
                    </div>
                    <div className="rounded-xl p-4 transition-all duration-200"
                      style={{ background: previewBg, border: `1px solid ${cardBorder}` }}>
                      <p className={`font-bold leading-tight transition-all duration-200 ${textPrimary}`}
                        style={{ fontSize: `${level.size}px`, textAlign: level.align, lineHeight: 1.25 }}>
                        {meta.previewText}
                      </p>
                    </div>
                  </div>
                )
              })}

              {/* Simulação completa */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <span className={`text-[9px] uppercase tracking-widest font-semibold ${textSecondary}`}>Simulação completa</span>
                </div>
                <div className="rounded-xl p-5 transition-all duration-200"
                  style={{ background: previewBg, border: `1px solid ${cardBorder}` }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="rounded-full flex items-center justify-center text-white font-black flex-shrink-0 transition-all duration-200"
                      style={{
                        width: `${draft.avatarSize}px`,
                        height: `${draft.avatarSize}px`,
                        background: accent.css,
                        fontSize: `${draft.avatarSize * 0.3}px`,
                      }}
                    >
                      AF
                    </div>
                    <div>
                      <p className={`font-extrabold leading-tight transition-all duration-200 ${textPrimary}`}
                        style={{ fontSize: `${draft.titulo.size}px`, textAlign: draft.titulo.align }}>
                        AF Consultoria & Projetos
                      </p>
                      <p className="font-semibold mt-0.5 transition-all duration-200"
                        style={{ fontSize: `${draft.subtitulo1.size}px`, textAlign: draft.subtitulo1.align, color: accentGradient?.from || "#3b82f6" }}>
                        Centro de Inteligência de Marketing Estratégico 2026
                      </p>
                    </div>
                  </div>
                  <p className={`mt-1 transition-all duration-200 ${textSecondary}`}
                    style={{ fontSize: `${draft.subtitulo2.size}px`, textAlign: draft.subtitulo2.align }}>
                    Análise em tempo real e insights estratégicos para decisões de marketing baseadas em dados.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
