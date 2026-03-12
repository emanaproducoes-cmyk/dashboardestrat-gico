import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { auth } from './lib/firebase'
import Layout from './Layout'
import Home from './pages/Home'
import Canais from './pages/Canais'
import Conteudo from './pages/Conteudo'
import Funil from './pages/Funil'
import Insights from './pages/Insights'
import KPIs from './pages/KPIs'
import ProvaSocial from './pages/ProvaSocial'
import Roadmap from './pages/Roadmap'
import LoginPage from './pages/LoginPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function ProtectedRoute({ user, children }: { user: User | null, children: React.ReactNode }) {
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-light text-slate-300">404</h1>
        <p className="text-slate-600 mt-4">Página não encontrada</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Ir para o início
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/" element={<ProtectedRoute user={user}><Layout currentPageName="Home"><Home /></Layout></ProtectedRoute>} />
          <Route path="/Canais" element={<ProtectedRoute user={user}><Layout currentPageName="Canais"><Canais /></Layout></ProtectedRoute>} />
          <Route path="/Conteudo" element={<ProtectedRoute user={user}><Layout currentPageName="Conteudo"><Conteudo /></Layout></ProtectedRoute>} />
          <Route path="/Funil" element={<ProtectedRoute user={user}><Layout currentPageName="Funil"><Funil /></Layout></ProtectedRoute>} />
          <Route path="/Insights" element={<ProtectedRoute user={user}><Layout currentPageName="Insights"><Insights /></Layout></ProtectedRoute>} />
          <Route path="/KPIs" element={<ProtectedRoute user={user}><Layout currentPageName="KPIs"><KPIs /></Layout></ProtectedRoute>} />
          <Route path="/ProvaSocial" element={<ProtectedRoute user={user}><Layout currentPageName="ProvaSocial"><ProvaSocial /></Layout></ProtectedRoute>} />
          <Route path="/Roadmap" element={<ProtectedRoute user={user}><Layout currentPageName="Roadmap"><Roadmap /></Layout></ProtectedRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
