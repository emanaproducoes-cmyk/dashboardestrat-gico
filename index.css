import React from "react"

const channels = [
  {
    name: "LinkedIn",
    score: 92,
    followers: "+200",
    engagement: "4.2%",
    content: "48 posts",
    conversions: "30",
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-50"
  },
  {
    name: "YouTube",
    score: 88,
    followers: "+500",
    engagement: "5.8%",
    content: "24 posts",
    conversions: "56",
    color: "from-red-500 to-red-700",
    bg: "bg-red-50"
  },
  {
    name: "Instagram",
    score: 76,
    followers: "+87",
    engagement: "3.1%",
    content: "120 posts",
    conversions: "22",
    color: "from-pink-500 to-purple-600",
    bg: "bg-pink-50"
  },
  {
    name: "Blog/Website",
    score: 71,
    followers: "N/A",
    engagement: "2.8%",
    content: "12 posts",
    conversions: "45",
    color: "from-gray-500 to-gray-700",
    bg: "bg-gray-50"
  }
]

export default function ChannelComparison({ dark }: { dark?: boolean }) {
  return (
    <div className={dark ? "" : "bg-white rounded-xl border border-gray-100 p-6"}>
      <h3 className={`font-bold mb-1 ${dark ? 'text-white' : 'text-gray-900'}`}>
        Comparação de Performance dos Canais
      </h3>
      <p className={`text-xs mb-6 ${dark ? 'text-white/40' : 'text-gray-400'}`}>
        Análise comparativa entre todos os canais de marketing
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.name}
            className={`rounded-xl p-5 border ${dark ? 'bg-white/10 border-white/10' : `${ch.bg} border-gray-100`}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className={`font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{ch.name}</h4>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${ch.color} flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{ch.score}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {[
                ["Seguidores", ch.followers],
                ["Engajamento", ch.engagement],
                ["Conteúdo", ch.content],
                ["Conversões", ch.conversions],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className={dark ? 'text-white/50' : 'text-gray-500'}>{label}</span>
                  <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
