"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { portfolio } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/components/analytics"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredProjects =
    activeCategory === "All"
      ? portfolio.projects
      : portfolio.projects.filter((project) => project.category === activeCategory)

  // Bento grid layout pattern - which items should be large
  const getBentoSize = (index: number) => {
    const pattern = [2, 1, 1, 1, 2, 1, 1, 1, 2] // 2 = large, 1 = regular
    return pattern[index % pattern.length]
  }

  // Animate in on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Reset animation when category changes
  useEffect(() => {
    setIsVisible(false)
    setTimeout(() => setIsVisible(true), 50)
  }, [activeCategory])

  const handleProjectClick = (project: any) => {
    setSelectedProject(project)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = 'unset'
  }

  const navigateProject = (direction: 'prev' | 'next') => {
    if (!selectedProject) return
    const currentIndex = filteredProjects.findIndex(p => p.id === selectedProject.id)
    let newIndex
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredProjects.length - 1
    } else {
      newIndex = currentIndex < filteredProjects.length - 1 ? currentIndex + 1 : 0
    }
    setSelectedProject(filteredProjects[newIndex])
  }

  return (
    <>
      <Analytics />
      <Header />

      <main className="bg-background pt-24 text-foreground">
        <section className="border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-accent">Issue 03 — portfolio</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">
                  Case studies, spreads, and selected work.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  A clearer look at the work behind the brand. Each project is presented more like a magazine spread than
                  a gallery tile, so the portfolio feels aligned with the rest of the site.
                </p>
              </div>

              <div className="border border-border bg-card p-7">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Browse by category</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {portfolio.categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      onClick={() => setActiveCategory(category)}
                      className={activeCategory === category ? "bg-accent text-accent-foreground hover:bg-accent/90" : "border-border bg-transparent"}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div ref={gridRef} className="space-y-20">
              {filteredProjects.map((project, index) => {
                const isReverse = index % 2 === 1

                return (
                  <article
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className={`group grid cursor-pointer gap-8 border-b border-border pb-16 transition-all duration-500 last:border-b-0 last:pb-0 lg:grid-cols-2 lg:items-center ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    } ${isReverse ? "lg:[&>*:first-child]:order-2" : ""}`}
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className="relative aspect-[5/4] overflow-hidden border border-border bg-card">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="retro-image object-cover"
                      />
                      <div className="absolute left-4 top-4 border border-border bg-background px-3 py-1 text-xs uppercase tracking-[0.18em] text-foreground">
                        {project.category}
                      </div>
                    </div>

                    <div className="max-w-xl">
                      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Fig. 0{index + 1}
                      </p>
                      <h2 className="mt-4 text-3xl font-serif font-semibold tracking-tight md:text-[2.5rem]">
                        {project.title}
                      </h2>
                      <p className="mt-5 text-base leading-8 text-muted-foreground">{project.description}</p>
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <span className="border border-border bg-card px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          Selected project
                        </span>
                        <span className="text-sm text-accent">Open to view case details</span>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {filteredProjects.length === 0 && (
          <section className="py-24">
            <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">No results</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Try another category.</h2>
            </div>
          </section>
        )}

        {/* Full-Screen Project Modal */}
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 bg-background/92 backdrop-blur-md animate-fadeIn"
            onClick={closeModal}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-10 text-foreground hover:text-accent transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateProject("prev")
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 text-foreground hover:text-accent transition-colors"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateProject("next")
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 text-foreground hover:text-accent transition-colors"
              >
                <ChevronRight className="w-12 h-12" />
              </button>

              {/* Content */}
              <div 
                className="max-w-6xl w-full grid grid-cols-1 gap-8 items-center lg:grid-cols-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden border border-border bg-card">
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="retro-image object-cover"
                  />
                </div>

                {/* Details */}
                <div className="space-y-6 text-foreground">
                  <div>
                    <span className="mb-4 inline-block border border-border bg-card px-4 py-2 text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                      {selectedProject.category}
                    </span>
                    <h2 className="mb-4 text-4xl font-serif font-semibold md:text-5xl">
                      {selectedProject.title}
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Additional project details - customize as needed */}
                  <div className="space-y-4 border-t border-border pt-6">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                        Project Type
                      </h4>
                      <p>{selectedProject.category}</p>
                    </div>
                  </div>

                  <Button 
                    size="lg"
                    className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
                    asChild
                  >
                    <a href="/contact">
                      Start Your Project
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
