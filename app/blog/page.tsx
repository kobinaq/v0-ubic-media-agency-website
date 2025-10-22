"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPosts, getBlogCategories } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/components/analytics"
import { Calendar, User, ArrowRight } from "lucide-react"

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [isVisible, setIsVisible] = useState(false)
  const posts = getBlogPosts()
  const categories = ["All", ...getBlogCategories()]

  const filteredPosts =
    activeCategory === "All"
      ? posts
      : posts.filter((post) => post.category === activeCategory)

  // Sort posts by date (newest first)
  const sortedPosts = [...filteredPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  // Animate in on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Reset animation when category changes
  useEffect(() => {
    setIsVisible(false)
    setTimeout(() => setIsVisible(true), 50)
  }, [activeCategory])

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <>
      <Analytics />
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-balance">
              Blog & Insights
            </h1>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Tips, trends, and insights from the world of branding, marketing, and creative strategy
            </p>
          </div>
        </section>

        {/* Filter */}
        <section className="py-12 px-6 border-b border-border sticky top-[72px] bg-background/95 backdrop-blur-md z-30">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
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

        {/* Blog Grid */}
        <section className="py-24 px-6">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedPosts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group cursor-pointer bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    {/* Image */}
                    <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Category & Date */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl font-serif font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>

                      {/* Author & Read More */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1 text-accent font-medium text-sm group-hover:gap-2 transition-all">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* No posts message */}
            {sortedPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No posts found in this category.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-secondary/30">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Ready to Transform Your Brand?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Let's bring your vision to life with strategy, creativity, and execution.
            </p>
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/contact">
                Get in Touch
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
