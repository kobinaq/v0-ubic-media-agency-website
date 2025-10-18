import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { services } from "@/lib/content"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Analytics } from "@/components/analytics"
export default function ServicesPage() {
  return (
    <>
      <Analytics />
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">Our Services</h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Comprehensive brand development solutions to elevate your business and connect with your audience
            </p>
          </div>
        </section>
        {/* Services Grid */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.services.map((service, index) => (
                <Card key={service.id} className="border-2 hover:border-accent transition-all hover:shadow-lg overflow-hidden group">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={`/service-${index + 1}.jpg`}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 rounded-t-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <CardContent className="p-8">
                    <div className="text-4xl font-serif font-bold text-accent mb-4">
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* CTA */}
        <section className="py-24 px-6 bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 text-pretty">
              Let's discuss how our services can help your brand thrive
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
