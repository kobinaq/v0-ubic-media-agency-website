"use client"

import { useState, useEffect, useRef } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { portfolio } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/components/analytics"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

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
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">Our Portfolio</h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Explore our work across photography, videography, web design, and brand development
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-12 px-6 border-b border-border sticky top-[72px] bg-background/95 backdrop-blur-md z-30">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {portfolio.categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div 
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]"
            >
              {filteredProjects.map((project, index) => {
                const size = getBentoSize(index)
                const isLarge = size === 2
                
                return (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className={`group cursor-pointer relative overflow-hidden rounded-2xl bg-card border border-accent/20 hover:border-accent/50 transition-all duration-500 ${
                      isLarge ? 'md:col-span-2 md:row-span-2' : ''
                    } ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      transitionDelay: `${index * 50}ms`,
                      perspective: '1000px'
                    }}
                  >
                    {/* Image with 3D hover effect */}
                    <div 
                      className="absolute inset-0 transition-transform duration-500 group-hover:scale-105"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end z-10">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="inline-block px-3 py-1 bg-accent/90 text-accent-foreground text-xs font-medium rounded-full mb-3">
                          {project.category}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/30 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Full-Screen Project Modal */}
        {selectedProject && (
          <div 
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fadeIn"
            onClick={closeModal}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-white hover:text-accent transition-colors z-10"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Navigation */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateProject('prev')
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors z-10"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateProject('next')
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-accent transition-colors z-10"
              >
                <ChevronRight className="w-12 h-12" />
              </button>

              {/* Content */}
              <div 
                className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-accent/30">
                  <img
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="text-white space-y-6">
                  <div>
                    <span className="inline-block px-4 py-2 bg-accent text-accent-foreground text-sm font-medium rounded-full mb-4">
                      {selectedProject.category}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                      {selectedProject.title}
                    </h2>
                    <p className="text-lg text-white/80 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Additional project details - customize as needed */}
                  <div className="space-y-4 pt-6 border-t border-white/20">
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">
                        Project Type
                      </h4>
                      <p className="text-white">{selectedProject.category}</p>
                    </div>
                  </div>

                  <Button 
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground mt-8"
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
