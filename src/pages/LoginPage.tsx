import React, { useState } from "react"
import { useAuth } from "../lib/AuthContext"
import { Eye, EyeOff, LogIn, Sparkles, UserPlus, Mail } from "lucide-react"

type Mode = "login" | "register"

export default function LoginPage() {
  const { login, register } = useAuth()
  const [mode, setMode] = useState<Mode>("login")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const reset = (m: Mode) => { setMode(m); setError(""); setName(""); setEmail(""); setPassword("") }

  const handleSubmit = async () => {
    setError("")
    if (!email || !password) { setError("Preencha todos os campos."); return }
    if (mode === "register" && !name.trim()) { setError("Informe seu nome."); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    if (mode === "login") {
      const ok = login(email, password)
      if (!ok) setError("E-mail ou senha incorretos.")
    } else {
      const result = register(name, email, password)
      if (!result.success) setError(result.error || "Erro ao cadastrar.")
    }
    setLoading(false)
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-white text-sm outline-none transition-all placeholder-white/20"
  const inputStyle = { background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #070f1f 100%)" }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #3B6AF5, #7B35EF)" }}>
            <Sparkles size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">AF Analytics</h1>
          <p className="text-blue-300/70 text-sm mt-1">Dashboard Estratégico</p>
        </div>

        <div className="rounded-2xl p-8"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(20px)" }}>

          <div className="flex rounded-xl overflow-hidden mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
            {(["login", "register"] as Mode[]).map(m => (
              <button key={m} onClick={() => reset(m)}
                className="flex-1 py-2.5 text-sm font-semibold transition-all"
                style={mode === m
                  ? { background: "linear-gradient(135deg, #3B6AF5, #7B35EF)", color: "white" }
                  : { color: "rgba(255,255,255,0.4)" }
                }>
                {m === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">Nome</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Seu nome completo"
                  className={inputClass} style={inputStyle} />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                placeholder="seu@email.com"
                className={inputClass} style={inputStyle} autoComplete="email" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
                {mode === "register" ? "Criar senha (mín. 6 caracteres)" : "Senha"}
              </label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="••••••••"
                  className={`${inputClass} pr-11`} style={inputStyle} autoComplete={mode === "login" ? "current-password" : "new-password"} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm text-red-300 bg-red-500/10 border border-red-500/20">{error}</div>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #3B6AF5, #7B35EF)" }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : mode === "login"
                  ? <><LogIn size={16} /> Entrar</>
                  : <><UserPlus size={16} /> Criar conta</>
              }
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
              <span className="text-xs text-white/30">ou continue com</span>
              <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.open("https://accounts.google.com", "_blank")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                onClick={() => window.open("https://login.microsoftonline.com", "_blank")}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                  <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
                Outlook
              </button>
            </div>

            <p className="text-xs text-white/20 text-center">
              Os botões Google e Outlook abrem a página de login do provedor
            </p>
          </div>

          <div className="mt-5 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <p className="text-xs text-white/30 text-center">Acesso restrito · AF Consultoria & Projetos</p>
          </div>
        </div>
      </div>
    </div>
  )
}
