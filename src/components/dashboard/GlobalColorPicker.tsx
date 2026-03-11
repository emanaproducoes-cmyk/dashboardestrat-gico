import React from "react"
import { X, Check } from "lucide-react"
import type { GradientOption } from "../../lib/types"

export const GRADIENT_GROUPS = [
  {
    label: "Azuis & Roxos",
    items: [
      { id: 'g1', label: 'Oceano Real', css: 'linear-gradient(160deg, #4169E1, #2541B2)', from: '#4169E1', to: '#2541B2' },
      { id: 'g2', label: 'Safira', css: 'linear-gradient(160deg, #4B6FD8, #1a1a7e)', from: '#4B6FD8', to: '#1a1a7e' },
      { id: 'g3', label: 'Ciano Violeta', css: 'linear-gradient(160deg, #00C9FF, #5B00FF)', from: '#00C9FF', to: '#5B00FF' },
      { id: 'g4', label: 'Aura Púrpura', css: 'linear-gradient(160deg, #9B59B6, #2D1B69)', from: '#9B59B6', to: '#2D1B69' },
      { id: 'g5', label: 'Azul Teal', css: 'linear-gradient(160deg, #4169E1, #006994)', from: '#4169E1', to: '#006994' },
      { id: 'g6', label: 'Aço Profundo', css: 'linear-gradient(160deg, #4682B4, #1B3A7A)', from: '#4682B4', to: '#1B3A7A' },
      { id: 'g7', label: 'Marinho', css: 'linear-gradient(160deg, #1B4F8A, #0D1B3E)', from: '#1B4F8A', to: '#0D1B3E' },
    ]
  },
  {
    label: "Vibrantes",
    items: [
      { id: 'g8', label: 'Menta Aurora', css: 'linear-gradient(160deg, #00E5CC, #00C9A7)', from: '#00E5CC', to: '#00C9A7' },
      { id: 'g9', label: 'Pôr do Sol', css: 'linear-gradient(160deg, #FFB347, #FF2D78)', from: '#FFB347', to: '#FF2D78' },
      { id: 'g10', label: 'Céu Tropical', css: 'linear-gradient(160deg, #54C8FF, #29B6F6)', from: '#54C8FF', to: '#29B6F6' },
      { id: 'g11', label: 'Cosmos', css: 'linear-gradient(160deg, #4169E1, #AB47BC)', from: '#4169E1', to: '#AB47BC' },
      { id: 'g12', label: 'Floresta', css: 'linear-gradient(160deg, #00E676, #00897B)', from: '#00E676', to: '#00897B' },
      { id: 'g13', label: 'Âmbar Solar', css: 'linear-gradient(160deg, #FFD600, #FF6D00)', from: '#FFD600', to: '#FF6D00' },
      { id: 'g14', label: 'Lavanda', css: 'linear-gradient(160deg, #B39DDB, #7C4DFF)', from: '#B39DDB', to: '#7C4DFF' },
    ]
  },
  {
    label: "Ousados",
    items: [
      { id: 'g15', label: 'Ciano Elétrico', css: 'linear-gradient(135deg, #00C9FF, #0080FF)', from: '#00C9FF', to: '#0080FF' },
      { id: 'g16', label: 'Índigo Neon', css: 'linear-gradient(135deg, #6C63FF, #3F5EFB)', from: '#6C63FF', to: '#3F5EFB' },
      { id: 'g17', label: 'Esmeralda', css: 'linear-gradient(135deg, #1DE9B6, #00B0FF)', from: '#1DE9B6', to: '#00B0FF' },
      { id: 'g18', label: 'Jade', css: 'linear-gradient(135deg, #69F0AE, #00E676)', from: '#69F0AE', to: '#00E676' },
      { id: 'g19', label: 'Mel Dourado', css: 'linear-gradient(135deg, #FFD740, #FFAB40)', from: '#FFD740', to: '#FFAB40' },
      { id: 'g20', label: 'Vulcão', css: 'linear-gradient(135deg, #FF6D00, #FF3D00)', from: '#FF6D00', to: '#FF3D00' },
      { id: 'g21', label: 'Rubi', css: 'linear-gradient(135deg, #FF5252, #D50000)', from: '#FF5252', to: '#D50000' },
      { id: 'g22', label: 'Coral', css: 'linear-gradient(135deg, #FF8A65, #FF6B6B)', from: '#FF8A65', to: '#FF6B6B' },
      { id: 'g23', label: 'Magenta', css: 'linear-gradient(135deg, #EA00FF, #9C27B0)', from: '#EA00FF', to: '#9C27B0' },
      { id: 'g24', label: 'Fogo Roxo', css: 'linear-gradient(135deg, #FF1744, #9C27B0)', from: '#FF1744', to: '#9C27B0' },
      { id: 'g25', label: 'Ametista', css: 'linear-gradient(135deg, #9C27B0, #6200EA)', from: '#9C27B0', to: '#6200EA' },
      { id: 'g26', label: 'Azul Profundo', css: 'linear-gradient(135deg, #1565C0, #0D47A1)', from: '#1565C0', to: '#0D47A1' },
    ]
  }
]

export const DEFAULT_GRADIENT: GradientOption = {
  id: 'default',
  label: 'Padrão AF',
  css: 'linear-gradient(135deg, #3B6AF5, #7B35EF)',
  from: '#3B6AF5',
  to: '#7B35EF'
}

interface PickerProps {
  selectedGradient?: GradientOption
  onSelect: (g: GradientOption) => void
  onClose: () => void
  dark?: boolean
}

export default function GlobalColorPicker({ selectedGradient, onSelect, onClose, dark }: PickerProps) {
  const border = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'
  const bg = dark ? 'rgba(8,14,35,0.98)' : 'white'
  const textColor = dark ? 'text-white' : 'text-gray-900'
  const groupColor = dark ? 'text-white/30' : 'text-gray-400'
  const subColor = dark ? 'text-white/40' : 'text-gray-500'
  const btnHover = dark ? 'hover:bg-white/10 text-white/60' : 'hover:bg-gray-100 text-gray-400'

  const current = selectedGradient || DEFAULT_GRADIENT

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        className="fixed left-16 top-16 w-72 rounded-2xl shadow-2xl border overflow-hidden"
        style={{ background: bg, borderColor: border }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: border }}>
          <div>
            <p className={`font-bold text-sm ${textColor}`}>Cores Globais</p>
            <p className={`text-xs ${subColor}`}>Selecione o gradiente do sistema</p>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${btnHover}`}>
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pt-3 pb-2">
          <p className={`text-[10px] uppercase tracking-wider mb-2 ${groupColor}`}>Padrão do Sistema</p>
          <button
            onClick={() => onSelect(DEFAULT_GRADIENT)}
            className="relative w-full h-10 rounded-xl overflow-hidden hover:opacity-90 transition-all hover:scale-[1.02]"
            style={{ background: DEFAULT_GRADIENT.css }}
            title={DEFAULT_GRADIENT.label}
          >
            {current.id === DEFAULT_GRADIENT.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Check size={16} className="text-white drop-shadow-lg" />
              </div>
            )}
            <span className="absolute bottom-1.5 right-2 text-[10px] text-white/80 font-medium">
              {DEFAULT_GRADIENT.label}
            </span>
          </button>
        </div>

        <div className="px-4 pb-4 space-y-4 max-h-80 overflow-y-auto">
          {GRADIENT_GROUPS.map((group) => (
            <div key={group.label}>
              <p className={`text-[10px] uppercase tracking-wider mb-2 ${groupColor}`}>{group.label}</p>
              <div className="grid grid-cols-7 gap-1.5">
                {group.items.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => onSelect(g)}
                    title={g.label}
                    className="relative h-9 rounded-lg overflow-hidden hover:scale-110 transition-transform"
                    style={{ background: g.css }}
                  >
                    {current.id === g.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Check size={10} className="text-white drop-shadow" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4">
          <p className={`text-[10px] uppercase tracking-wider mb-2 ${groupColor}`}>Selecionado</p>
          <div className="h-8 rounded-xl w-full" style={{ background: current.css }} />
          <p className={`text-[10px] mt-1 text-center ${subColor}`}>{current.label}</p>
        </div>
      </div>
    </div>
  )
}
