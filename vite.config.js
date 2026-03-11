export interface GradientOption {
  id: string
  label: string
  css: string
  from: string
  to: string
}

export interface PageProps {
  darkMode?: boolean
  accentGradient?: GradientOption
}
