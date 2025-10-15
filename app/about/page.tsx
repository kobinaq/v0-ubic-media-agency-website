import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { about } from "@/lib/content"
import { Card, CardContent } from "@/components/ui/card"
import { Analytics } from "@/components/analytics"

export default function AboutPage() {
  return (
    <>
      <Analytics />
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">About Ubic Media Agency</h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              A team of passionate creatives, strategists, and storytellers united by a single mission
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="border-2">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{about.mission}</p>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-serif font-bold mb-4">Our Vision</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">{about.vision}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12 text-center">Our Story</h2>
            <div className="space-y-6">
              {about.story.map((paragraph, index) => (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-16 text-center">What Makes Us Different</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {about.differentiators.map((item, index) => (
                <Card key={index} className="border-2 hover:border-accent transition-colors">
                  <CardContent className="p-8">
                    <div className="text-5xl font-serif font-bold text-accent mb-4">
                      {(index + 1).toString().padStart(2, "0")}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Clients */}
        <section className="py-24 px-6 bg-muted/30">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-12">Brands We've Worked With</h2>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              {about.clients.map((client) => (
                <div
                  key={client}
                  className="text-2xl font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
