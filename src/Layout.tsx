import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard, TrendingUp, Radio, FileText,
  Filter as FilterIcon, Award, Map, Lightbulb,
  ChevronLeft, ChevronRight, Sun, Moon,
  LogIn, LogOut, ShieldCheck, X, User
} from "lucide-react"
import GlobalColorPicker, { DEFAULT_GRADIENT } from "./components/dashboard/GlobalColorPicker"
import type { GradientOption, PageProps } from "./lib/types"

const ADMIN_EMAIL = "emanaproducoes@gmail.com"
const ADMIN_NAME  = "Emana Produções"

const navItems = [
  { name: "Visão Geral", path: "/", icon: LayoutDashboard },
  { name: "KPIs", path: "/KPIs", icon: TrendingUp, dot: true },
  { name: "Canais", path: "/Canais", icon: Radio },
  { name: "Conteúdo", path: "/Conteudo", icon: FileText },
  { name: "Funil", path: "/Funil", icon: FilterIcon },
  { name: "Prova Social", path: "/ProvaSocial", icon: Award },
  { name: "Roadmap", path: "/Roadmap", icon: Map },
  { name: "Insights", path: "/Insights", icon: Lightbulb },
]

const DARK_BG  = "linear-gradient(135deg, #050d1a 0%, #070f1f 50%, #08101e 100%)"
const LIGHT_BG = "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 40%, #ede9fe 70%, #f3e8ff 100%)"

function AdminLoginModal({ onClose, onLogin }: { onClose: () => void; onLogin: () => void }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
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

interface LayoutProps {
  children: React.ReactNode
  currentPageName: string
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed]           = useState(false)
  const [dark, setDark]                     = useState(true)
  const [accentGradient, setAccentGradient] = useState<GradientOption>(DEFAULT_GRADIENT)
  const [showPicker, setShowPicker]         = useState(false)
  const [isAdmin, setIsAdmin]               = useState(false)
  const [showModal, setShowModal]           = useState(false)

  const navigate  = useNavigate()
  const location  = useLocation()

  const handleNav = (item: { path: string }) => navigate(item.path)

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<PageProps>(child)) {
      return React.cloneElement(child, { darkMode: dark, accentGradient, isAdmin } as PageProps)
    }
    return child
  })

  const sidebarBg     = dark ? "rgba(5, 10, 25, 0.92)" : "rgba(255,255,255,0.85)"
  const sidebarBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const logoColor     = dark ? "text-white" : "text-blue-900"
  const logoAccent    = dark ? "text-blue-300" : "text-blue-600"
  const chevronColor  = dark ? "text-white/60" : "text-gray-500"
  const navActive     = dark ? "bg-white/20 text-white" : "bg-blue-600/15 text-blue-900"
  const navInactive   = dark
    ? "text-white/50 hover:text-white hover:bg-white/10"
    : "text-gray-500 hover:text-blue-900 hover:bg-blue-50"
  const navActiveIcon = dark ? "text-blue-300" : "text-blue-600"
  const dotActive     = dark ? "bg-white" : "bg-blue-600"
  const dotInactive   = dark ? "bg-blue-400" : "bg-blue-400"
  const brandText1    = dark ? "text-white/30" : "text-gray-400"
  const brandText2    = dark ? "text-white/50" : "text-gray-600"
  const themeBtn      = dark
    ? "text-white/50 hover:text-white hover:bg-white/10"
    : "text-gray-500 hover:text-blue-900 hover:bg-blue-50"

  return (
    <>
      {showModal && (
        <AdminLoginModal
          onClose={() => setShowModal(false)}
          onLogin={() => setIsAdmin(true)}
        />
      )}

      <div className="flex h-screen overflow-hidden">
        <aside
          className={`${collapsed ? "w-16" : "w-56"} transition-all duration-300 flex flex-col flex-shrink-0 z-20`}
          style={{ background: sidebarBg, backdropFilter: "blur(16px)", borderRight: `1px solid ${sidebarBorder}` }}
        >
          {/* Logo */}
          <div className="flex items-center justify-between px-4 h-16" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
            {!collapsed && (
              <span className={`text-lg font-bold ${logoColor}`}>
                AF <span className={logoAccent}>Analytics</span>
              </span>
            )}
            <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto">
              {collapsed
                ? <ChevronRight size={16} className={chevronColor} />
                : <ChevronLeft size={16} className={chevronColor} />}
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? navActive : navInactive}`}
                >
                  <Icon size={18} className={isActive ? navActiveIcon : ""} />
                  {!collapsed && <span>{item.name}</span>}
                  {item.dot && !collapsed && (
                    <span className={`ml-auto w-2 h-2 rounded-full ${isActive ? dotActive : dotInactive}`} />
                  )}
                </button>
              )
            })}
          </nav>

          {/* Controles */}
          <div className="px-2 pb-2 space-y-1">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${themeBtn}`}
            >
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: accentGradient.css }} />
              {!collapsed && <span>Cores Globais</span>}
              {!collapsed && <div className="ml-auto w-4 h-4 rounded-full" style={{ background: accentGradient.css }} />}
            </button>

            <button
              onClick={() => setDark(!dark)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${themeBtn}`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
              {!collapsed && <span>{dark ? "Modo Claro" : "Modo Escuro"}</span>}
            </button>

            {/* Botão Admin */}
            <button
              onClick={() => isAdmin ? setIsAdmin(false) : setShowModal(true)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${themeBtn}`}
            >
              {isAdmin
                ? <LogOut size={18} className="text-red-400 flex-shrink-0" />
                : <LogIn size={18} className="flex-shrink-0" />
              }
              {!collapsed && (
                <span className={isAdmin ? "text-red-400" : ""}>
                  {isAdmin ? "Sair do Admin" : "Entrar como Admin"}
                </span>
              )}
            </button>
          </div>

          {showPicker && (
            <GlobalColorPicker
              selectedGradient={accentGradient}
              onSelect={(g) => { setAccentGradient(g); setShowPicker(false) }}
              onClose={() => setShowPicker(false)}
              dark={dark}
            />
          )}

          {/* Footer */}
          {!collapsed && (
            <div className="p-4" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <User size={12} className="text-blue-300" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">Admin</p>
                    <p className="text-[11px] text-white/70 truncate">{ADMIN_NAME}</p>
                  </div>
                  <div className="ml-auto w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                </div>
              ) : (
                <>
                  <p className={`text-[10px] uppercase tracking-wider ${brandText1}`}>Planejamento Estratégico</p>
                  <p className={`text-xs font-medium mt-0.5 ${brandText2}`}>AF Consultoria & Projetos</p>
                  <p className={`text-[10px] mt-0.5 ${brandText1}`}>Ciclo 2025–2026</p>
                </>
              )}
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-y-auto transition-all duration-700" style={{ background: dark ? DARK_BG : LIGHT_BG }}>
          {childrenWithProps}
        </main>
      </div>
    </>
  )
}
