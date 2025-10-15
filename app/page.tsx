import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { siteConfig, services } from "@/lib/content"
import { Analytics } from "@/components/analytics"

export default function HomePage() {
  return (
    <>
      <Analytics />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-6 pt-24">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted/50 to-background" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-6 text-balance">
              Building Brands That Resonate, Inspire, and Lead
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/portfolio">See Our Work</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">What We Do</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Full-service brand development to elevate your business
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.services.slice(0, 6).map((service) => (
                <Card key={service.id} className="border-2 hover:border-accent transition-colors">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <CheckCircle2 className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">
                  View All Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Why Choose Ubic Media Agency?</h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  We don't just deliver creative services—we help your brand grow, stand out, and stay relevant in a
                  fast-moving digital world.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Strategic Approach</h4>
                      <p className="text-muted-foreground">We understand your brand deeply before creating anything</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Full-Service Excellence</h4>
                      <p className="text-muted-foreground">Everything from strategy to execution under one roof</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Proven Results</h4>
                      <p className="text-muted-foreground">Trusted by leading brands across Ghana and beyond</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link href="/about">
                      Learn More About Us <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src="/creative-team-working-on-brand-strategy.jpg"
                  alt="Ubic Media Agency team"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to Build Something Bold?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 text-pretty">
              Let's transform your brand into a market-ready experience that drives growth and lasting engagement.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
