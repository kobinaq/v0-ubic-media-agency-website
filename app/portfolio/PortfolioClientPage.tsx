"use client"

import Image from "next/image"
import { useRef, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { PageIntro } from "@/components/page-intro"
import { ImageReveal } from "@/components/animations/image-reveal"
import { FadeUp } from "@/components/home/text-reveal"
import { portfolio } from "@/lib/content"

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<(typeof portfolio.projects)[number] | null>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  const filteredProjects =
    activeCategory === "All"
      ? portfolio.projects
      : portfolio.projects.filter((project) => project.category === activeCategory)

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

  const getImageFitClass = (category: string) =>
    category === "Social Media" ? "object-contain p-3 sm:p-5" : "object-cover"

  const getImageFrameClass = (category: string, context: "list" | "modal") =>
    category === "Social Media"
      ? context === "list"
        ? "aspect-square lg:aspect-[4/3]"
        : "aspect-square lg:aspect-[16/10]"
      : context === "list"
        ? "aspect-[5/4]"
        : "aspect-[4/3]"

  return (
    <>
      <Header />

      <main className="bg-background text-foreground">
        <PageIntro
          eyebrow="Work"
          meta={
            <>
              <span className="studio-label">Case studies</span>
              <span className="studio-label">{filteredProjects.length} projects</span>
              <span className="studio-label">Strategy · Identity · Web · Social · Photo · Video · Print</span>
            </>
          }
          title={
            <h1 className="studio-display text-5xl md:text-6xl lg:text-[5.5rem]">
              Selected work.
            </h1>
          }
          description="Projects across strategy, identity, websites, social, photo, video, and print."
          aside={
            <div>
              <p className="studio-label">Index by category</p>
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
                    data-cursor="hover"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          }
        />

        <section className="px-5 py-24 md:px-8 lg:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div ref={gridRef} className="space-y-20">
              {filteredProjects.map((project, index) => {
                const isReverse = index % 2 === 1

                return (
                  <FadeUp key={project.id} delay={index * 0.04} y={48}>
                    <article
                      onClick={() => handleProjectClick(project)}
                      className={`group grid cursor-pointer gap-8 border-b border-border pb-16 last:border-b-0 last:pb-0 lg:grid-cols-2 lg:items-center ${
                        isReverse ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                      data-cursor="view"
                    >
                      <ImageReveal
                        className={`relative border border-border bg-card ${getImageFrameClass(
                          project.category,
                          "list",
                        )}`}
                      >
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className={`retro-image ${getImageFitClass(project.category)}`}
                        />
                        <div className="absolute left-4 top-4 z-10 border border-border bg-background px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] text-foreground">
                          {project.category}
                        </div>
                      </ImageReveal>

                      <div className="max-w-xl">
                        <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                          Fig. {String(index + 1).padStart(2, "0")}
                        </p>
                        <h2 className="mt-4 font-serif text-3xl font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1 md:text-[2.5rem]">
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
                            <div key={label as string}>
                              <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-accent">
                                {label}
                              </h3>
                              <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  </FadeUp>
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
                <div
                  className={`relative overflow-hidden border border-border bg-background ${getImageFrameClass(
                    selectedProject.category,
                    "modal",
                  )}`}
                >
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={getImageFitClass(selectedProject.category)}
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
