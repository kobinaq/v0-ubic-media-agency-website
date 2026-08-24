import siteConfig from "@/content/site-config.json"
import about from "@/content/about.json"
import servicesData from "@/content/services.json"
import packages from "@/content/packages.json"
import portfolio from "@/content/portfolio.json"

export const pillars = servicesData.pillars
export const services = servicesData

export { siteConfig, about, packages, portfolio }

export type Package = {
  id: string
  name: string
  description: string
  features: string[]
  priceGHS: number
  priceUSD: number
  service?: string
  popular?: boolean
  isHourly?: boolean
}

export type Service = {
  id: string
  title: string
  description: string
  icon: string
  startingPrice: number
}

export type Pillar = Service

export type PortfolioProject = {
  id: string
  title: string
  category: string
  image: string
  description: string
  client?: string
  year?: string
  services?: string[]
  challenge?: string
  approach?: string
  outcome?: string
}
