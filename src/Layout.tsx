import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard, TrendingUp, Radio, FileText,
  Filter as FilterIcon, Award, Map, Lightbulb,
  ChevronLeft, ChevronRight, Sun, Moon, LogOut, User
} from "lucide-react"
import GlobalColorPicker, { DEFAULT_GRADIENT } from "./components/dashboard/GlobalColorPicker"
import type { GradientOption, PageProps } from "./lib/types"
import { useAuth } from "./lib/AuthContext"

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

interface LayoutProps {
  children: React.ReactNode
  currentPageName: string
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed]           = useState(false)
  const [dark, setDark]                     = useState(true)
  const [accentGradient, setAccentGradient] = useState<GradientOption>(DEFAULT_GRADIENT)
  const [showPicker, setShowPicker]         = useState(false)

  const { user, logout } = useAuth()
  const isAdmin = user?.isAdmin ?? false

  const navigate = useNavigate()
  const location = useLocation()

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

          {user && (
            <button
              onClick={() => logout()}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${themeBtn}`}
            >
              <LogOut size={18} className="text-red-400 flex-shrink-0" />
              {!collapsed && <span className="text-red-400">Sair</span>}
            </button>
          )}
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
            {user ? (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <User size={12} className="text-blue-300" />
                </div>
                <div className="min-w-0">
                  {isAdmin && <p className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">Admin</p>}
                  <p className="text-[11px] text-white/70 truncate">{user.name}</p>
                </div>
                {isAdmin && <div className="ml-auto w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />}
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
  )
}
