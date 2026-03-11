import React from "react"
import { CheckCircle2, Clock, Pause } from "lucide-react"

const phases = [
  {
    quarter: "Q1",
    title: "Lançamento do Mixchannel",
    period: "Mar – Abr",
    status: "complete",
    progress: 100,
    color: "from-blue-600 to-indigo-700",
    items: [
      "Lançamento das novas redes: LI e YT",
      "Captação de novos seguidores para os novos canais",
      "Postagens semanais em ambos canais"
    ]
  },
  {
    quarter: "Q2",
    title: "Coletar Social",
    period: "Jun – Ago",
    status: "in_progress",
    progress: 60,
    color: "from-teal-600 to-cyan-700",
    items: [
      "Início das captações de prova social",
      "Planejamento de lançamento",
      "Lançamento de teasers"
    ]
  },
  {
    quarter: "Q3",
    title: "Publicar Social Proof",
    period: "Set – Nov",
    status: "pending",
    progress: 0,
    color: "from-rose-500 to-pink-600",
    items: [
      "3 a 4 Storytellings de casos de sucesso",
      "Publicações em todo omnichannel",
      "Publicações no site: Histórias que Transformam"
    ]
  },
  {
    quarter: "Q4",
    title: "Consolidar Autoridade",
    period: "Dez",
    status: "pending",
    progress: 0,
    color: "from-blue-500 to-blue-700",
    items: [
      "Publicações no blog: temas transversais",
      "Consolidação da autoridade digital",
      "Avaliação de resultados anuais"
    ]
  }
]

const statusConfig = {
  complete: { icon: CheckCircle2, label: "Completo", className: "text-emerald-600 bg-emerald-50" },
  in_progress: { icon: Clock, label: "Em Andamento", className: "text-blue-600 bg-blue-50" },
  pending: { icon: Pause, label: "Pendente", className: "text-gray-400 bg-gray-100" },
}

export default function RoadmapTimeline({ dark }: { dark?: boolean }) {
  return (
    <div>
      {!dark && <h2 className="text-xl font-bold text-gray-900 mb-1">Roadmap Estratégico</h2>}
      {!dark && <p className="text-sm text-gray-500 mb-6">Linha do tempo de execução de 120 dias</p>}
      <div className="space-y-4">
        {phases.map((phase, i) => {
          const StatusIcon = statusConfig[phase.status].icon
          return (
            <div
              key={i}
              className={`rounded-xl border p-6 hover:brightness-110 transition-all duration-300 ${
                dark ? 'bg-white/10 border-white/10' : 'bg-white border-gray-100 hover:shadow-lg'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white font-extrabold text-sm">{phase.quarter}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {phase.title}
                    </h3>
                    <span className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                      {phase.period}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[phase.status].className}`}
                    >
                      <StatusIcon size={12} />
                      {statusConfig[phase.status].label}
                    </span>
                  </div>

                  <div className={`w-full h-2 rounded-full overflow-hidden mb-4 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${phase.color} transition-all duration-700`}
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>

                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li
                        key={j}
                        className={`flex items-start gap-2 text-sm ${dark ? 'text-white/60' : 'text-gray-600'}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dark ? 'bg-white/30' : 'bg-gray-300'}`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <span className={`text-2xl font-extrabold hidden md:block ${dark ? 'text-white/20' : 'text-gray-200'}`}>
                  {phase.progress}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
