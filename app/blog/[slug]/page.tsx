"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPost, getBlogPosts, BlogContentBlock } from "@/lib/content"
import { Button } from "@/components/ui/button"
import { Analytics } from "@/components/analytics"
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Get related posts (same category, exclude current)
  const relatedPosts = getBlogPosts()
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  // Render content blocks
  const renderContentBlock = (block: BlogContentBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="text-lg leading-relaxed text-foreground/90 mb-6">
            {block.text}
          </p>
        )
      case "heading":
        return (
          <h2 key={index} className="text-3xl font-serif font-bold text-foreground mt-12 mb-6">
            {block.text}
          </h2>
        )
      case "image":
        return (
          <figure key={index} className="my-12">
            <img
              src={block.src || "/placeholder.svg"}
              alt={block.alt}
              className="w-full rounded-2xl border border-border"
            />
            {block.alt && (
              <figcaption className="text-sm text-muted-foreground text-center mt-4">
                {block.alt}
              </figcaption>
            )}
          </figure>
        )
      case "list":
        return (
          <ul key={index} className="space-y-3 mb-8 ml-6">
            {block.items.map((item, i) => (
              <li key={i} className="text-lg leading-relaxed text-foreground/90 flex items-start">
                <span className="text-accent mr-3 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )
      default:
        return null
    }
  }

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <>
      <Analytics />
      <Header />
      <main className="pt-24">
        {/* Hero Section */}
        <article className="py-16 px-6">
          <div className="mx-auto max-w-4xl">
            {/* Back Button */}
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            {/* Category & Date */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <span className="inline-block px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs font-medium">
                {post.category}
              </span>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Share Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="mb-8"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>

            {/* Featured Image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-border mb-12">
              <img
                src={post.image || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </article>

        {/* Content */}
        <article className="pb-16 px-6">
          <div className="mx-auto max-w-3xl">
            <div className="prose prose-lg max-w-none">
              {post.content.map((block, index) => renderContentBlock(block, index))}
            </div>
          </div>
        </article>

        {/* Author Section */}
        <section className="py-12 px-6 border-y border-border">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent-foreground font-bold text-xl">
                {post.author.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{post.author}</h3>
                <p className="text-muted-foreground">
                  Creating impactful brand experiences and digital strategies at Ubic Media Agency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-24 px-6 bg-secondary/30">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href={`/blog/${relatedPost.slug}`}>
                      {/* Image */}
                      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
                        <img
                          src={relatedPost.image || "/placeholder.svg"}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <span className="inline-block px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs font-medium">
                          {relatedPost.category}
                        </span>
                        <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-24 px-6">
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

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Ubic Media Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}
