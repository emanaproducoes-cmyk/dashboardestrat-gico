import React from "react"
import { FileSignature, Send, CheckCircle2, Trophy, Flag } from "lucide-react"

const steps = [
  {
    title: "Contrato",
    subtitle: "Fase de Recepção",
    description: "Mensagem de boas-vindas e felicitações. Convite para seguir nossas redes sociais.",
    icon: FileSignature,
    color: "from-cyan-400 to-blue-500"
  },
  {
    title: "Protocolo",
    subtitle: "Projeto enviado ao Banco",
    description: "Mensagem de reforço positivo. Convite para seguir nossas redes sociais.",
    icon: Send,
    color: "from-blue-400 to-blue-600"
  },
  {
    title: "Aprovação",
    subtitle: "Projeto aprovado",
    description: "Mensagem para celebrar e orientar implementação e próximo marco.",
    icon: CheckCircle2,
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "Conclusão",
    subtitle: "Projeto contratado",
    description: "Mensagem de conquista e vitória, implementação e próximo marco.",
    icon: Trophy,
    color: "from-indigo-500 to-violet-600"
  },
  {
    title: "Encerramento",
    subtitle: "Projeto concluído",
    description: "Formalizar o encerramento, agradecer, convidar para social proof.",
    icon: Flag,
    color: "from-violet-500 to-purple-600"
  }
]

export default function ClientJourney({ dark }: { dark?: boolean }) {
  return (
    <div>
      <h2 className={`text-xl font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
        Gamificação do Ciclo do Cliente
      </h2>
      <p className={`text-sm mb-6 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
        Processo que mapeia a jornada do cliente, aumentando o valor percebido do serviço em cada etapa
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {steps.map((step, i) => {
          const Icon = step.icon
          return (
            <div key={i} className="relative group">
              <div
                className={`rounded-xl border p-5 transition-all duration-300 h-full flex flex-col ${
                  dark
                    ? 'bg-white/10 border-white/10 hover:bg-white/15'
                    : 'bg-white border-gray-100 hover:shadow-lg'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold ${dark ? 'text-white/20' : 'text-gray-300'}`}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`font-bold text-sm ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {step.title}
                  </h3>
                </div>
                <p className={`text-xs font-semibold mb-2 ${dark ? 'text-blue-300' : 'text-blue-600'}`}>
                  {step.subtitle}
                </p>
                <p className={`text-xs flex-1 ${dark ? 'text-white/50' : 'text-gray-500'}`}>
                  {step.description}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10 text-gray-300">
                  →
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
