import React, { useState, useRef, useCallback } from "react"
import { Move, RefreshCw } from "lucide-react"
import type { GradientOption } from "../../lib/types"

interface TextElement {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontWeight: string
  color: string
}

const DEFAULT_ELEMENTS: TextElement[] = [
  { id: "title", text: "AF Consultoria & Projetos", x: 50, y: 35, fontSize: 32, fontWeight: "800", color: "#ffffff" },
  { id: "subtitle", text: "Planejamento Estratégico de Marketing 2026", x: 50, y: 50, fontSize: 16, fontWeight: "400", color: "rgba(255,255,255,0.8)" },
  { id: "badge", text: "Centro de Inteligência de Marketing", x: 50, y: 22, fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.6)" },
  { id: "year", text: "2025 – 2026", x: 50, y: 78, fontSize: 14, fontWeight: "500", color: "rgba(255,255,255,0.5)" },
]

interface Props {
  accentGradient?: GradientOption
  dark?: boolean
}

export default function DraggableCover({ accentGradient, dark }: Props) {
  const gradientCss = accentGradient?.css || "linear-gradient(135deg, #3B6AF5, #7B35EF)"
  const [elements, setElements] = useState<TextElement[]>(DEFAULT_ELEMENTS)
  const [dragging, setDragging] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragOffset = useRef({ x: 0, y: 0 })
  // BUG FIX: track whether a drag has actually moved (to distinguish click vs drag)
  const hasMoved = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    // BUG FIX: don't start drag if clicking on the contentEditable span
    if ((e.target as HTMLElement).isContentEditable) return
    e.preventDefault()
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const el = elements.find(el => el.id === id)
    if (!el) return
    dragOffset.current = {
      x: e.clientX - rect.left - (el.x / 100) * rect.width,
      y: e.clientY - rect.top - (el.y / 100) * rect.height
    }
    hasMoved.current = false
    setDragging(id)
    setSelected(id)
  }, [elements])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return
    hasMoved.current = true
    const container = containerRef.current
    if (!container) return
    const rect = container.getBoundingClientRect()
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left - dragOffset.current.x) / rect.width) * 100))
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top - dragOffset.current.y) / rect.height) * 100))
    setElements(prev => prev.map(el => el.id === dragging ? { ...el, x, y } : el))
  }, [dragging])

  const onMouseUp = useCallback(() => setDragging(null), [])

  const updateText = (id: string, text: string) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, text } : el))
  }

  const reset = () => {
    setElements(DEFAULT_ELEMENTS)
    setSelected(null)
  }

  return (
    <div className={dark ? "" : "bg-white rounded-xl border border-gray-100 p-6"}>
      {!dark && <h3 className="font-bold text-gray-900 mb-1">Editor de Capa</h3>}
      {!dark && <p className="text-xs text-gray-400 mb-4">Arraste os elementos para reposicionar</p>}

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden select-none"
        style={{ background: gradientCss, paddingBottom: "56.25%" /* 16:9 */ }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchMove={e => {
          if (!dragging) return
          e.preventDefault()
          const touch = e.touches[0]
          const container = containerRef.current
          if (!container) return
          const rect = container.getBoundingClientRect()
          const x = Math.max(5, Math.min(95, ((touch.clientX - rect.left - dragOffset.current.x) / rect.width) * 100))
          const y = Math.max(5, Math.min(95, ((touch.clientY - rect.top - dragOffset.current.y) / rect.height) * 100))
          setElements(prev => prev.map(el => el.id === dragging ? { ...el, x, y } : el))
        }}
        onTouchEnd={() => setDragging(null)}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/15 blur-3xl" />
        </div>

        {/* Draggable text elements */}
        {elements.map((el) => (
          <div
            key={el.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group ${
              selected === el.id ? 'ring-2 ring-white/60 rounded-lg px-2 py-1' : 'px-2 py-1'
            } ${dragging === el.id ? 'opacity-90 scale-105' : ''}`}
            style={{ left: `${el.x}%`, top: `${el.y}%`, transition: dragging === el.id ? 'none' : 'all 0.1s' }}
            onMouseDown={e => onMouseDown(e, el.id)}
            onTouchStart={e => {
              // BUG FIX: check if the touch target is contentEditable before initiating drag
              if ((e.target as HTMLElement).isContentEditable) return
              const touch = e.touches[0]
              const container = containerRef.current
              if (!container) return
              const rect = container.getBoundingClientRect()
              dragOffset.current = {
                x: touch.clientX - rect.left - (el.x / 100) * rect.width,
                y: touch.clientY - rect.top - (el.y / 100) * rect.height
              }
              hasMoved.current = false
              setDragging(el.id)
              setSelected(el.id)
            }}
          >
            <span
              className="whitespace-nowrap block text-center"
              style={{ fontSize: el.fontSize, fontWeight: el.fontWeight, color: el.color }}
              contentEditable
              suppressContentEditableWarning
              onBlur={e => updateText(el.id, e.currentTarget.innerText)}
              // BUG FIX: stop propagation so clicking to edit doesn't trigger parent mousedown drag
              onMouseDown={e => e.stopPropagation()}
              onTouchStart={e => e.stopPropagation()}
            >
              {el.text}
            </span>
            {selected === el.id && (
              <Move size={10} className="absolute -top-3 -right-3 text-white/70" />
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mt-3">
        <button
          onClick={reset}
          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
            dark ? 'text-white/40 hover:text-white/70 hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          }`}
        >
          <RefreshCw size={12} />
          Resetar
        </button>
        <span className={`text-xs ${dark ? 'text-white/20' : 'text-gray-300'}`}>
          Clique em texto para editar • Arraste para mover
        </span>
      </div>
    </div>
  )
}
