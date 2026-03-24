import type { PageProps } from "../lib/types"
import React, { useState } from "react"
import HeroHeader from "../components/dashboard/HeroHeader"
import ChannelChart from "../components/dashboard/ChannelChart"
import ChannelComparison from "../components/dashboard/ChannelComparison"
import SectionDetailModal from "../components/dashboard/SectionDetailModal"
import { Linkedin, Youtube, Instagram, Globe, ArrowRight, Info } from "lucide-react"
import { useFontSettings } from "../lib/FontSettingsContext"

interface ModalSection {
  title: string; subtitle: string; description: string
  kpis?: { label: string; value: string }[]
  chart?: { type: "area" | "bar" | "pie"; data: Record<string, number | string>[]; colors?: string[] }
  chartTitle?: string; bullets?: string[]; bulletsTitle?: string
}

interface Channel {
  id: string; name: string; icon: React.ReactNode; gradient: string; accentColor: string
  h1: { freq: string; format: string; lang: string }
  h2: { freq: string; format: string; lang: string }
  meta: string; tags: string[]; modalSection: ModalSection
}

const channels: Channel[] = [
  {
    id: "linkedin", name: "LinkedIn",
    icon: <Linkedin size={20} className="text-white" />,
    gradient: "from-blue-600 to-blue-800", accentColor: "#3b82f6",
    h1: { freq: "3x/semana", format: "Artigos + Posts de texto + Carrossel", lang: "Português formal" },
    h2: { freq: "4x/semana", format: "+ Cases de Sucesso + Vídeos curtos", lang: "Português formal" },
    meta: "+200 seguidores | 2.5–5.5% engajamento", tags: ["B2B", "Autoridade", "Longo prazo"],
    modalSection: {
      title: "Estratégia LinkedIn", subtitle: "Canal principal de autoridade B2B",
      description: "O LinkedIn é o canal de maior retorno para a AF Consultoria, focado em decisores de empresas que buscam financiamento FNO e consultoria estratégica.",
      kpis: [{ label: "Meta Seguidores", value: "+200" }, { label: "Taxa Engajamento", value: "2.5–5.5%" }, { label: "Posts/Semana", value: "3–4x" }, { label: "Conversões/Ano", value: "28–32" }],
      chart: { type: "bar", data: [{ label: "Jan", Seguidores: 0 }, { label: "Fev", Seguidores: 20 }, { label: "Mar", Seguidores: 50 }, { label: "Abr", Seguidores: 80 }, { label: "Mai", Seguidores: 120 }, { label: "Jun", Seguidores: 170 }], colors: ["#3b82f6"] },
      chartTitle: "Crescimento de Seguidores"
    }
  },
  {
    id: "youtube", name: "YouTube",
    icon: <Youtube size={20} className="text-white" />,
    gradient: "from-red-600 to-red-800", accentColor: "#ef4444",
    h1: { freq: "1x/semana", format: "Vídeos informativos + Shorts", lang: "Português descontraído técnico" },
    h2: { freq: "1–2x/semana", format: "+ Depoimentos em vídeo + Bastidores", lang: "Português descontraído técnico" },
    meta: "+500 inscritos | 3.0–6.8% engajamento", tags: ["Educativo", "SEO", "Longo prazo"],
    modalSection: {
      title: "Estratégia YouTube", subtitle: "Canal de educação e SEO de longo prazo",
      description: "YouTube é o canal de maior potencial de crescimento orgânico e SEO. Vídeos educativos sobre FNO e financiamento constroem autoridade duradoura.",
      kpis: [{ label: "Meta Inscritos", value: "+500" }, { label: "Taxa Engajamento", value: "3.0–6.8%" }, { label: "Vídeos/Mês", value: "4–8" }, { label: "Conversões/Ano", value: "43–56" }],
      chart: { type: "area", data: [{ month: "Jan", Inscritos: 0, Visualizações: 0 }, { month: "Fev", Inscritos: 12, Visualizações: 150 }, { month: "Mar", Inscritos: 30, Visualizações: 420 }, { month: "Abr", Inscritos: 50, Visualizações: 680 }, { month: "Mai", Inscritos: 80, Visualizações: 1100 }, { month: "Jun", Inscritos: 100, Visualizações: 1500 }], colors: ["#ef4444", "#f97316"] },
      chartTitle: "Crescimento de Inscritos e Visualizações"
    }
  },
  {
    id: "instagram", name: "Instagram",
    icon: <Instagram size={20} className="text-white" />,
    gradient: "from-pink-600 to-purple-700", accentColor: "#ec4899",
    h1: { freq: "4–5x/semana", format: "Antes/Depois + Reels + Carrossel", lang: "Português informal inspirador" },
    h2: { freq: "5–6x/semana", format: "+ Depoimentos + Bastidores", lang: "Português informal inspirador" },
    meta: "70–105 conversões | Awareness regional", tags: ["Awareness", "Social Proof", "Visual"],
    modalSection: {
      title: "Estratégia Instagram", subtitle: "Canal de conversão e prova social visual",
      description: "Instagram é o canal de maior alcance para o público geral e para conversões diretas através de DM e stories.",
      kpis: [{ label: "Conversões/Ano", value: "70–105" }, { label: "Posts/Semana", value: "4–6x" }, { label: "Tipos de Conteúdo", value: "5 tipos" }, { label: "Formato Principal", value: "Reels" }],
      chart: { type: "pie", data: [{ name: "Antes/Depois", value: 40, color: "#ec4899" }, { name: "Vídeos/Reels", value: 30, color: "#8b5cf6" }, { name: "Reposts", value: 20, color: "#f59e0b" }, { name: "Bastidores", value: 10, color: "#06b6d4" }] },
      chartTitle: "Mix de Conteúdo"
    }
  },
  {
    id: "blog", name: "Blog / Website",
    icon: <Globe size={20} className="text-white" />,
    gradient: "from-slate-600 to-slate-800", accentColor: "#64748b",
    h1: { freq: "1x/mês", format: "Artigos técnicos + SEO", lang: "Português formal técnico" },
    h2: { freq: "2x/mês", format: "+ Histórias que Transformam + Análises", lang: "Português formal técnico" },
    meta: "SEO orgânico | Referência técnica", tags: ["SEO", "Técnico", "Longo prazo"],
    modalSection: {
      title: "Estratégia Blog / Website", subtitle: "Canal de SEO e referência técnica",
      description: "O blog é a base de SEO de longo prazo da AF, com conteúdo técnico aprofundado sobre FNO, BNDES e projetos econômicos.",
      kpis: [{ label: "Posts/Mês", value: "1–2" }, { label: "Foco", value: "SEO" }, { label: "Lançamento H2", value: "Jul/26" }, { label: "Sessão/mês Alvo", value: "+500" }],
      bullets: ["Artigos técnicos sobre linhas de crédito FNO e BNDES", "Análises de mercado e tendências do setor", "Seção 'Histórias que Transformam' com cases publicados em H2", "Glossário de termos técnicos para decisores", "Páginas de serviço otimizadas para SEO local"],
      bulletsTitle: "Conteúdos Planejados"
    }
  }
]

// Badge indicador Dev Mode para seção de evolução
function EvolutionDevBadge({ dark }: { dark: boolean }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold"
        style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.25)" }}>
        <Info size={10} /> Editar dados
      </button>
      {show && (
        <div className="absolute right-0 top-8 z-30 rounded-xl p-3 shadow-2xl w-60"
          style={{ background: dark ? "#0a1628" : "#fff", border: "1px solid rgba(59,130,246,0.25)" }}>
          <p className="text-[10px] font-bold text-blue-400 mb-1.5 uppercase tracking-wider">Como editar os dados</p>
          <div className="flex items-center gap-1.5 text-[11px] mb-2"
            style={{ color: dark ? "rgba(255,255,255,0.70)" : "#374151" }}>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Dev Mode</span>
            <ArrowRight size={10} className="text-blue-400" />
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/20 text-blue-400">Canais</span>
          </div>
          <p className="text-[10px]" style={{ color: dark ? "rgba(255,255,255,0.45)" : "#6b7280" }}>
            Edite os dados mensais de cada canal. As alterações aparecem aqui em tempo real e são salvas no Firestore para todos os usuários.
          </p>
        </div>
      )}
    </div>
  )
}

export default function Canais({ darkMode = false, accentGradient }: PageProps) {
  const [activeModal, setActiveModal] = useState<Channel | null>(null)
  const { fontSettings } = useFontSettings()

  const cardBg   = darkMode ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.95)"
  const cardBord = darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.06)"
  const labelBg  = darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"
  const valClass  = darkMode ? "text-white"    : "text-gray-900"
  const subColor  = darkMode ? "rgba(255,255,255,0.5)" : "#6b7280"
  const tagBg     = darkMode ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.05)"

  const sectionStyle: React.CSSProperties = {
    background: cardBg,
    border: `1px solid ${cardBord}`,
    borderRadius: 16, padding: 24,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: `${fontSettings.titulo.size}px`,
    textAlign: fontSettings.titulo.align as any,
    color: darkMode ? "#ffffff" : "#111827",
    fontWeight: 800, marginBottom: 4,
  }
  const subStyle: React.CSSProperties = {
    fontSize: `${fontSettings.subtitulo1.size}px`,
    textAlign: fontSettings.subtitulo1.align as any,
    color: subColor, marginBottom: 20,
  }

  return (
    <div className={`min-h-screen p-6 md:p-8 space-y-8 ${!darkMode ? "bg-gray-50" : ""}`}>
      <HeroHeader accentGradient={accentGradient} />

      {/* ── MIX DE CANAIS ───────────────────────── */}
      <section>
        <p style={titleStyle}>Mix de Canais por Semestre</p>
        <p style={subStyle}>Estratégia de conteúdo H1 (Jan–Jun) e H2 (Jul–Dez)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {channels.map(ch => (
            <button key={ch.id} onClick={() => setActiveModal(ch)}
              className="rounded-2xl p-6 text-left group transition-all duration-300 hover:scale-[1.01]"
              style={{ background: cardBg, border: `1px solid ${cardBord}` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ch.gradient} flex items-center justify-center flex-shrink-0`}>
                  {ch.icon}
                </div>
                <div className="min-w-0">
                  <h3 className={`font-bold ${valClass}`}>{ch.name}</h3>
                  <p className="text-xs truncate" style={{ color: subColor }}>{ch.meta}</p>
                </div>
                <ArrowRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: subColor }} />
              </div>
              <div className="space-y-3">
                {[{ label: "H1 (Jan–Jun)", data: ch.h1 }, { label: "H2 (Jul–Dez)", data: ch.h2 }].map(({ label, data }) => (
                  <div key={label} className="rounded-xl p-3" style={{ background: labelBg }}>
                    <p className="text-[10px] uppercase tracking-wider font-semibold mb-2"
                      style={{ color: darkMode ? "rgba(255,255,255,0.30)" : "#9ca3af" }}>{label}</p>
                    <div className="space-y-1">
                      {[["Freq.", data.freq], ["Formato", data.format], ["Linguagem", data.lang]].map(([k, v]) => (
                        <div key={k} className="flex gap-2 text-xs">
                          <span style={{ color: subColor }}>{k}:</span>
                          <span className={`font-medium ${valClass}`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {ch.tags.map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: tagBg, color: subColor }}>{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── COMPARAÇÃO DE PERFORMANCE ─────────────── */}
      <section style={sectionStyle}>
        <ChannelComparison dark={darkMode} />
      </section>

      {/* ── CRESCIMENTO POR CANAL (vindo do KPIs) ─── */}
      <section style={sectionStyle}>
        <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
          <div>
            <p style={titleStyle}>Crescimento por Canal</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>Evolução de seguidores ao longo de 2026</p>
          </div>
          <EvolutionDevBadge dark={darkMode} />
        </div>
        <div className="mt-5">
          <ChannelChart dark={darkMode} />
        </div>
      </section>

      {/* ── EVOLUÇÃO DE SEGUIDORES ────────────────── */}
      <section style={sectionStyle}>
        <div className="flex items-start justify-between mb-1 flex-wrap gap-2">
          <div>
            <p style={titleStyle}>Evolução de Seguidores</p>
            <p style={{ ...subStyle, marginBottom: 0 }}>Trajetória de crescimento multicanal · dados do Dev Mode → Canais</p>
          </div>
          <EvolutionDevBadge dark={darkMode} />
        </div>
        <div className="mt-5">
          <ChannelChart dark={darkMode} />
        </div>
      </section>

      {activeModal && (
        <SectionDetailModal isOpen onClose={() => setActiveModal(null)} section={activeModal.modalSection} />
      )}
    </div>
  )
}
