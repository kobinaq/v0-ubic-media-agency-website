import siteConfig from "@/content/site-config.json"
import about from "@/content/about.json"
import services from "@/content/services.json"
import packages from "@/content/packages.json"
import portfolio from "@/content/portfolio.json"

export { siteConfig, about, services, packages, portfolio }

export type Package = {
  id: string
  name: string
  description: string
  features: string[]
  priceGHS: number
  priceUSD: number
  popular: boolean
  service?: string
}

export type Service = {
  id: string
  title: string
  description: string
  icon: string
}

export type PortfolioProject = {
  id: string
  title: string
  category: string
  image: string
  description: string
}
