import React, { useState } from "react"
import { Shield, Lock, Code2, Building2, Target, BarChart3, ListChecks, DollarSign, AlertTriangle, Users, TrendingUp, RefreshCw, Radio, LayoutGrid, Map, Route } from "lucide-react"
import { useAuth } from "../lib/AuthContext"
import { usePlanningData } from "../lib/PlanningDataContext"
import type { GradientOption } from "../lib/types"
import DevEmpresa from "../components/devmode/DevEmpresa"
import DevMissao from "../components/devmode/DevMissao"
import DevSwot from "../components/devmode/DevSwot"
import DevOKRs from "../components/devmode/DevOKRs"
import DevKPIs from "../components/devmode/DevKPIs"
import DevAcoes from "../components/devmode/DevAcoes"
import DevOrcamento from "../components/devmode/DevOrcamento"
import DevRiscos from "../components/devmode/DevRiscos"
import DevEquipe from "../components/devmode/DevEquipe"
import DevAcompanhamento from "../components/devmode/DevAcompanhamento"
import DevCanais from "../components/devmode/DevCanais"
import DevContentDistribution from "../components/devmode/DevContentDistribution"
import DevClientJourney from "../components/devmode/DevClientJourney"
import DevRoadmap from "../components/devmode/DevRoadmap"

interface PageProps {
  darkMode?: boolean
  accentGradient?: GradientOption
}

const TABS = [
  { id: "empresa",        label: "Empresa",        icon: Building2 },
  { id: "missao",         label: "Missão & Visão",  icon: Target },
  { id: "swot",           label: "SWOT",            icon: BarChart3 },
  { id: "okrs",           label: "OKRs",            icon: TrendingUp },
  { id: "kpis",           label: "KPIs",            icon: BarChart3 },
  { id: "acoes",          label: "Plano de Ação",   icon: ListChecks },
  { id: "orcamento",      label: "Orçamento",       icon: DollarSign },
  { id: "riscos",         label: "Riscos",          icon: AlertTriangle },
  { id: "equipe",         label: "Equipe",          icon: Users },
  { id: "acompanhamento", label: "Acomp.",          icon: RefreshCw },
  { id: "canais",         label: "Canais",          icon: Radio },
  { id: "conteudo",       label: "Conteúdo",        icon: LayoutGrid },
  { id: "jornada",        label: "Jornada",         icon: Map },
  { id: "roadmap",        label: "Roadmap",         icon: Route },
]

export default function DevMode({ darkMode = true, accentGradient }: PageProps) {
  const { user } = useAuth()
  const { loading } = usePlanningData()
  const [activeTab, setActiveTab] = useState("empresa")

  const isAdmin = user?.isAdmin ?? false
  const accent = accentGradient || { from: "#3b82f6", to: "#8b5cf6", css: "linear-gradient(135deg,#3b82f6,#8b5cf6)" }
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"
  const textPrimary = darkMode ? "text-white" : "text-gray-900"
  const textSecondary = darkMode ? "text-white/50" : "text-gray-500"

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-1.5 rounded-full" style={{ background: accent.css }} />
          <span className={`text-xs uppercase tracking-widest font-semibold ${textSecondary}`}>Painel Administrativo</span>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)" }}>
            <Shield size={10} className="text-blue-400" />
            <span className="text-[10px] text-blue-400 font-medium">Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Code2 size={24} className={textSecondary} />
          <h1 className={`text-3xl font-extrabold ${textPrimary}`}>Dev Mode</h1>
        </div>
        <p className={`text-sm mt-1 ${textSecondary}`}>
          Gerencie todos os dados do app — edite, adicione e salve para todos os usuários em tempo real.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap mb-6 p-1 rounded-xl"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 flex-1 justify-center"
              style={{
                background: isActive ? accent.css : "transparent",
                color: isActive ? "#fff" : darkMode ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              }}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div>
        {activeTab === "empresa"        && <DevEmpresa        darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "missao"         && <DevMissao         darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "swot"           && <DevSwot           darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "okrs"           && <DevOKRs           darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "kpis"           && <DevKPIs           darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "acoes"          && <DevAcoes          darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "orcamento"      && <DevOrcamento      darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "riscos"         && <DevRiscos         darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "equipe"         && <DevEquipe         darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "acompanhamento" && <DevAcompanhamento darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "canais"         && <DevCanais         darkMode={darkMode} accentGradient={accentGradient} />}
        {activeTab === "conteudo"       && <DevContentDistribution dark={darkMode} />}
        {activeTab === "jornada"        && <DevClientJourney       dark={darkMode} />}
        {activeTab === "roadmap"        && <DevRoadmap             dark={darkMode} />}
      </div>
    </div>
  )
}
