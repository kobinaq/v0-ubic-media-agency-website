import siteConfig from "@/content/site-config.json"
import about from "@/content/about.json"
import services from "@/content/services.json"
import packages from "@/content/packages.json"
import portfolio from "@/content/portfolio.json"
import blog from "@/content/blog.json"

export { siteConfig, about, services, packages, portfolio, blog }

export type Package = {
  id: string
  name: string
  description: string
  features: string[]
  priceGHS: number
  priceUSD: number
  popular: boolean
  isHourly?: boolean
}

export type Service = {
  id: string
  title: string
  description: string
  icon: string
  startingPrice: number
}

export type PortfolioProject = {
  id: string
  title: string
  category: string
  image: string
  description: string
}

export type BlogContentBlock = 
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "image"; src: string; alt: string }
  | { type: "list"; items: string[] }

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  category: string
  image: string
  content: BlogContentBlock[]
}

export function getBlogPosts(): BlogPost[] {
  return blog.posts as BlogPost[]
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return blog.posts.find(post => post.slug === slug) as BlogPost | undefined
}

export function getBlogCategories(): string[] {
  const categories = new Set(blog.posts.map(post => post.category))
  return Array.from(categories).sort()
}
