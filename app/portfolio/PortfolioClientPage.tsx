"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Analytics } from "@/components/analytics"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { portfolio } from "@/lib/content"

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<(typeof portfolio.projects)[number] | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredProjects =
    activeCategory === "All"
      ? portfolio.projects
      : portfolio.projects.filter((project) => project.category === activeCategory)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [activeCategory])

  const handleProjectClick = (project: (typeof portfolio.projects)[number]) => {
    setSelectedProject(project)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = "unset"
  }

  const navigateProject = (direction: "prev" | "next") => {
    if (!selectedProject) return
    const currentIndex = filteredProjects.findIndex((project) => project.id === selectedProject.id)
    const newIndex =
      direction === "prev"
        ? currentIndex > 0
          ? currentIndex - 1
          : filteredProjects.length - 1
        : currentIndex < filteredProjects.length - 1
          ? currentIndex + 1
          : 0

    setSelectedProject(filteredProjects[newIndex])
  }

  return (
    <>
      <Analytics />
      <Header />

      <main className="bg-background pt-24 text-foreground">
        <section className="editorial-grid border-b border-border">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span>Issue 03 - Case Studies</span>
              <span>Selected work</span>
              <span>{filteredProjects.length} entries</span>
            </div>

            <div className="grid gap-12 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="issue-label">Case Studies</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] md:text-6xl">
                  Case studies, spreads, and selected work.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                  A clearer look at the work behind the brand. Each study includes the brief, the approach, and the
                  result so the work reads like more than a gallery tile.
                </p>
              </div>

              <div className="border-t border-border pt-7">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Index by category</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {portfolio.categories.map((category) => (
                    <Button
                      key={category}
                      variant={activeCategory === category ? "default" : "outline"}
                      onClick={() => setActiveCategory(category)}
                      className={`editorial-button ${
                        activeCategory === category
                          ? "bg-foreground text-background hover:bg-accent"
                          : "border-border bg-transparent hover:bg-card"
                      }`}
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
                      isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    } ${isReverse ? "lg:[&>*:first-child]:order-2" : ""}`}
                    style={{ transitionDelay: `${index * 60}ms` }}
                  >
                    <div className="image-print-overlay relative aspect-[5/4] overflow-hidden border border-border bg-card">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="retro-image object-cover"
                      />
                      <div className="absolute left-4 top-4 z-10 border border-border bg-background px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-foreground">
                        {project.category}
                      </div>
                    </div>

                    <div className="max-w-xl">
                      <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                        Fig. 0{index + 1}
                      </p>
                      <h2 className="mt-4 text-3xl font-serif font-semibold tracking-tight md:text-[2.5rem]">
                        {project.title}
                      </h2>
                      <p className="mt-5 text-base leading-8 text-muted-foreground">{project.description}</p>
                      <div className="mt-8 flex flex-wrap items-center gap-3">
                        <span className="border border-border bg-card px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {project.client ?? "Selected client"}
                        </span>
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {project.year ?? "Recent"}
                        </span>
                        <span className="text-sm text-accent">Open case study</span>
                      </div>
                      <div className="mt-8 grid gap-5 border-t border-border pt-6 sm:grid-cols-3">
                        {[
                          ["Challenge", project.challenge],
                          ["Approach", project.approach],
                          ["Outcome", project.outcome],
                        ].map(([label, body]) => (
                          <div key={label}>
                            <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">{label}</h3>
                            <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{body}</p>
                          </div>
                        ))}
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
              <p className="font-mono text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">No results</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight">Try another category.</h2>
            </div>
          </section>
        )}

        {selectedProject && (
          <div className="fixed inset-0 z-50 animate-fadeIn bg-background/95 backdrop-blur-sm" onClick={closeModal}>
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <button
                onClick={closeModal}
                className="absolute right-6 top-6 z-10 border border-border bg-background p-2 text-foreground transition-colors hover:text-accent"
              >
                <span className="sr-only">Close project details</span>
                <X className="h-6 w-6" />
              </button>

              <button
                onClick={(event) => {
                  event.stopPropagation()
                  navigateProject("prev")
                }}
                className="absolute left-6 top-1/2 z-10 hidden -translate-y-1/2 border border-border bg-background p-2 text-foreground transition-colors hover:text-accent md:block"
              >
                <span className="sr-only">Previous project</span>
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  navigateProject("next")
                }}
                className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 border border-border bg-background p-2 text-foreground transition-colors hover:text-accent md:block"
              >
                <span className="sr-only">Next project</span>
                <ChevronRight className="h-8 w-8" />
              </button>

              <div
                className="grid w-full max-w-6xl grid-cols-1 items-center gap-8 border border-border bg-card p-5 lg:grid-cols-2 lg:p-8"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="image-print-overlay relative aspect-[4/3] overflow-hidden border border-border bg-background">
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="retro-image object-cover"
                  />
                </div>

                <div className="space-y-6 text-foreground">
                  <div>
                    <span className="mb-4 inline-block border border-border bg-background px-4 py-2 font-mono text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                      {selectedProject.category}
                    </span>
                    <h2 className="mb-4 text-4xl font-serif font-semibold md:text-5xl">
                      {selectedProject.title}
                    </h2>
                    <p className="text-lg leading-relaxed text-muted-foreground">{selectedProject.description}</p>
                  </div>

                  <div className="grid gap-4 border-y border-border py-5 sm:grid-cols-3">
                    <div>
                      <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Client</h4>
                      <p>{selectedProject.client ?? "Selected client"}</p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Year</h4>
                      <p>{selectedProject.year ?? "Recent"}</p>
                    </div>
                    <div>
                      <h4 className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Type</h4>
                      <p>{selectedProject.category}</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    {[
                      ["Challenge", selectedProject.challenge],
                      ["Approach", selectedProject.approach],
                      ["Outcome", selectedProject.outcome],
                    ].map(([label, body]) => (
                      <div key={label}>
                        <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{label}</h4>
                        <p className="mt-2 text-sm leading-7 text-muted-foreground">{body}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">Services</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(selectedProject.services ?? [selectedProject.category]).map((service) => (
                        <span key={service} className="border border-border bg-background px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button size="lg" className="editorial-button mt-8 bg-foreground text-background hover:bg-accent" asChild>
                    <a href="/contact">Start Your Project</a>
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
