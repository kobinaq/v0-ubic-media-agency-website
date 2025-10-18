"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { services } from "@/lib/content"
import { Analytics } from "@/components/analytics"
import portfolioData from "@/content/portfolio.json"

// Helper: pick up to `n` projects from different categories
function pickFeatured(projects, n = 3) {
  const byCategory = projects.reduce((acc, p) => {
    acc[p.category] = acc[p.category] || []
    acc[p.category].push(p)
    return acc
  }, {})

  const categories = Object.keys(byCategory)
  const chosen = []

  // Shuffle categories for variety
  for (let i = categories.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[categories[i], categories[j]] = [categories[j], categories[i]]
  }

  for (const cat of categories) {
    if (chosen.length >= n) break
    const list = byCategory[cat]
    if (list && list.length) {
      // pick a random project from that category
      const project = list[Math.floor(Math.random() * list.length)]
      chosen.push(project)
    }
  }

  // If not enough distinct categories, fill with remaining projects
  if (chosen.length < n) {
    const remaining = projects.filter((p) => !chosen.find((c) => c.id === p.id))
    while (chosen.length < n && remaining.length) {
      chosen.push(remaining.shift())
    }
  }

  return chosen
}

export default function HomePage() {
  const featured = pickFeatured(portfolioData.projects, 3)

  return (
    <>
      <Analytics />
      <Header />
      <main>
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src="/hero-creative-workspace.jpg"
              alt="Creative workspace"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20" />
          </div>

          <div className="mx-auto max-w-5xl text-center relative z-10">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 text-balance leading-tight">
              Bold Ideas. <span className="text-accent">Real Impact.</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed">
              We help ambitious brands stand out through design, strategy, and storytelling that spark emotion. 
              From websites to social media, photography, video, and print, we turn bold ideas into visuals that move people.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/contact">
                  Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-accent/30 hover:bg-accent/10 bg-transparent"
                asChild
              >
                <Link href="/portfolio">Explore Our Work</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 bg-secondary/30 border-t border-border">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">What We Create</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Full-spectrum brand solutions designed to elevate your presence and drive measurable results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.services.slice(0, 6).map((service, index) => (
                <Card
                  key={service.id}
                  className="border-accent/20 bg-card/50 backdrop-blur hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 overflow-hidden group"
                >
                  <div className="relative h-40 overflow-hidden bg-muted rounded-t-xl">
                    <img
                      src={`/service-${index + 1}.jpg`}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-t-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-serif font-bold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-16">
              <Button
                variant="outline"
                size="lg"
                className="border-accent/30 hover:bg-accent/10 bg-transparent"
                asChild
              >
                <Link href="/services">
                  View All Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 bg-black/20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20">
              <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">Featured Work</h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore our latest campaigns and brand transformations that have made an impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-accent/20 hover:border-accent/50 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-white mb-2">{p.title}</h3>
                      <p className="text-sm text-white/80">{p.category} · {p.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Button below grid */}
            <div className="text-center mt-16">
              <Button
                size="lg"
                variant="outline"
                className="border-accent/30 hover:bg-accent/10 bg-transparent"
                asChild
              >
                <Link href="/portfolio">
                  View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
         
        <section className="py-32 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-balance leading-tight">
                  Why Brands Choose <span className="text-accent">Ubic</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                  We don't just deliver creative services—we become strategic partners in your brand's evolution,
                  helping you navigate complexity and seize opportunity.
                </p>

                <div className="space-y-6">
                  {[
                    { title: "Strategic Depth", desc: "Deep market insights inform every creative decision" },
                    { title: "Cultural Fluency", desc: "We understand African markets and global audiences" },
                    { title: "Proven Excellence", desc: "Trusted by leading brands across multiple industries" },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-1 bg-accent rounded-full flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link href="/about">
                      Learn Our Story <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative aspect-square rounded-xl overflow-hidden border border-accent/20">
                <img
                  src="/creative-team-collaboration-modern-office.jpg"
                  alt="Ubic Media Agency team"
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-32 px-6 bg-accent text-accent-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 text-balance">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-lg mb-12 text-accent-foreground/90 text-pretty leading-relaxed max-w-2xl mx-auto">
              Let's collaborate to create something extraordinary that resonates with your audience and drives real
              business impact.
            </p>
            <Button size="lg" className="bg-accent-foreground hover:bg-accent-foreground/90 text-accent" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
