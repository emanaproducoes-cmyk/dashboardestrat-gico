import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  LayoutDashboard, TrendingUp, Radio, FileText,
  Filter as FilterIcon, Award, Map, Lightbulb,
  ChevronLeft, ChevronRight, Sun, Moon, LogOut, Shield, Settings
} from "lucide-react"
import GlobalColorPicker, { DEFAULT_GRADIENT } from "./components/dashboard/GlobalColorPicker"
import type { GradientOption, PageProps } from "./lib/types"
import { useAuth } from "./lib/AuthContext"

const navItems = [
  { name: "Visão Geral", path: "/", icon: LayoutDashboard },
  { name: "KPIs", path: "/KPIs", icon: TrendingUp },
  { name: "Canais", path: "/Canais", icon: Radio },
  { name: "Conteúdo", path: "/Conteudo", icon: FileText },
  { name: "Funil", path: "/Funil", icon: FilterIcon },
  { name: "Prova Social", path: "/ProvaSocial", icon: Award },
  { name: "Roadmap", path: "/Roadmap", icon: Map },
  { name: "Insights", path: "/Insights", icon: Lightbulb },
]

const DARK_BG = "linear-gradient(135deg, #050d1a 0%, #070f1f 50%, #08101e 100%)"
const LIGHT_BG = "linear-gradient(135deg, #dbeafe 0%, #e0e7ff 40%, #ede9fe 70%, #f3e8ff 100%)"

interface LayoutProps {
  children: React.ReactNode
  currentPageName: string
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark] = useState(true)
  const [accentGradient, setAccentGradient] = useState<GradientOption>(DEFAULT_GRADIENT)
  const [showPicker, setShowPicker] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleNav = (item: { path: string }) => navigate(item.path)

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<PageProps>(child)) {
      return React.cloneElement(child, { darkMode: dark, accentGradient } as PageProps)
    }
    return child
  })

  const sidebarBg = dark ? "rgba(5, 10, 25, 0.92)" : "rgba(255,255,255,0.85)"
  const sidebarBorder = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const logoColor = dark ? "text-white" : "text-blue-900"
  const logoAccent = dark ? "text-blue-300" : "text-blue-600"
  const chevronColor = dark ? "text-white/60" : "text-gray-500"
  const navActive = dark ? "bg-white/20 text-white" : "bg-blue-600/15 text-blue-900"
  const navInactive = dark ? "text-white/50 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-blue-900 hover:bg-blue-50"
  const navActiveIcon = dark ? "text-blue-300" : "text-blue-600"
  const dotActive = dark ? "bg-white" : "bg-blue-600"
  const brandText1 = dark ? "text-white/30" : "text-gray-400"
  const themeBtn = dark ? "text-white/50 hover:text-white hover:bg-white/10" : "text-gray-500 hover:text-blue-900 hover:bg-blue-50"

  const initials = user?.name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "U"
  const isAdmin = user?.isAdmin ?? false

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`${collapsed ? 'w-16' : 'w-56'} transition-all duration-300 flex flex-col flex-shrink-0 z-20`}
        style={{ background: sidebarBg, backdropFilter: "blur(16px)", borderRight: `1px solid ${sidebarBorder}` }}
      >
        <div className="flex items-center justify-between px-4 h-16" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
          {!collapsed && (
            <span className={`text-lg font-bold ${logoColor}`}>
              AF <span className={logoAccent}>Analytics</span>
            </span>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-auto">
            {collapsed ? <ChevronRight size={16} className={chevronColor} /> : <ChevronLeft size={16} className={chevronColor} />}
          </button>
        </div>

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
                <Icon size={18} className={isActive ? navActiveIcon : ''} />
                {!collapsed && <span>{item.name}</span>}
                {isActive && !collapsed && (
                  <span className={`ml-auto w-2 h-2 rounded-full ${dotActive}`} />
                )}
              </button>
            )
          })}

          {isAdmin && (
            <>
              {!collapsed && (
                <div className="px-3 pt-3 pb-1">
                  <div className="h-px" style={{ background: sidebarBorder }} />
                  <p className={`text-[9px] uppercase tracking-widest font-semibold mt-2 ${brandText1}`}>Admin</p>
                </div>
              )}
              {collapsed && <div className="h-px mx-2 my-2" style={{ background: sidebarBorder }} />}
              <button
                onClick={() => navigate("/Configuracoes")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  location.pathname === "/Configuracoes" ? navActive : navInactive
                }`}
              >
                <Settings size={18} className={location.pathname === "/Configuracoes" ? navActiveIcon : ''} />
                {!collapsed && <span>Configurações</span>}
                {location.pathname === "/Configuracoes" && !collapsed && (
                  <span className={`ml-auto w-2 h-2 rounded-full ${dotActive}`} />
                )}
              </button>
            </>
          )}
        </nav>

        <div className="px-2 pb-2 space-y-1">
          <button onClick={() => setShowPicker(!showPicker)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${themeBtn}`}>
            <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: accentGradient.css }} />
            {!collapsed && <span>Cores Globais</span>}
            {!collapsed && <div className="ml-auto w-4 h-4 rounded-full" style={{ background: accentGradient.css }} />}
          </button>
          <button onClick={() => setDark(!dark)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${themeBtn}`}>
            {dark ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{dark ? 'Modo Claro' : 'Modo Escuro'}</span>}
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

        <div className="px-3 py-3 cursor-pointer" style={{ borderTop: `1px solid ${sidebarBorder}` }}
          onClick={() => setShowUserMenu(!showUserMenu)}>
          {showUserMenu && !collapsed && (
            <div className="mb-2 rounded-xl overflow-hidden"
              style={{ background: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)", border: `1px solid ${sidebarBorder}` }}>
              <div className="px-3 py-2">
                <p className={`text-[10px] truncate ${brandText1}`}>{user?.email}</p>
                {isAdmin && (
                  <div className="flex items-center gap-1 mt-1">
                    <Shield size={10} className="text-blue-400" />
                    <p className="text-[10px] text-blue-400 font-medium">Administrador</p>
                  </div>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); logout() }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${dark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}>
                <LogOut size={13} />
                Sair da conta
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0 ring-2 ring-white/20" />
              : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: isAdmin ? "linear-gradient(135deg, #3B6AF5, #7B35EF)" : "linear-gradient(135deg, #374151, #6B7280)" }}>
                  {initials}
                </div>
              )
            }
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className={`text-xs font-semibold truncate ${dark ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                  {isAdmin && <Shield size={10} className="text-blue-400 flex-shrink-0" />}
                </div>
                <p className={`text-[10px] truncate ${brandText1}`}>{isAdmin ? "Administrador" : "Visualizador"}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto transition-all duration-700" style={{ background: dark ? DARK_BG : LIGHT_BG }}>
        {childrenWithProps}
      </main>
    </div>
  )
}
