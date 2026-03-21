import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { FontSettingsProvider } from './lib/FontSettingsContext'
import LoginPage from './pages/LoginPage'
import Layout from './Layout'
import Home from './pages/Home'
import Canais from './pages/Canais'
import Conteudo from './pages/Conteudo'
import Funil from './pages/Funil'
import Insights from './pages/Insights'
import KPIs from './pages/KPIs'
import ProvaSocial from './pages/ProvaSocial'
import Roadmap from './pages/Roadmap'
import Configuracoes from './pages/Configuracoes'

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } },
})

function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-light text-slate-300">404</h1>
        <p className="text-slate-600 mt-4">Página não encontrada</p>
        <button onClick={() => window.location.href = '/'} className="mt-6 px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          Ir para o início
        </button>
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #050d1a 0%, #0a1628 50%, #070f1f 100%)" }}>
      <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  )

  if (!user) return <LoginPage />

  return (
    <Routes>
      <Route path="/" element={<Layout currentPageName="Home"><Home /></Layout>} />
      <Route path="/Canais" element={<Layout currentPageName="Canais"><Canais /></Layout>} />
      <Route path="/Conteudo" element={<Layout currentPageName="Conteudo"><Conteudo /></Layout>} />
      <Route path="/Funil" element={<Layout currentPageName="Funil"><Funil /></Layout>} />
      <Route path="/Insights" element={<Layout currentPageName="Insights"><Insights /></Layout>} />
      <Route path="/KPIs" element={<Layout currentPageName="KPIs"><KPIs /></Layout>} />
      <Route path="/ProvaSocial" element={<Layout currentPageName="ProvaSocial"><ProvaSocial /></Layout>} />
      <Route path="/Roadmap" element={<Layout currentPageName="Roadmap"><Roadmap /></Layout>} />
      <Route path="/Configuracoes" element={<Layout currentPageName="Configuracoes"><Configuracoes /></Layout>} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <FontSettingsProvider>
            <AppRoutes />
          </FontSettingsProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  )
}
