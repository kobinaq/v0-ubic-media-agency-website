import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getBlogPost, getBlogPosts } from "@/lib/content"
import { Analytics } from "@/components/analytics"
import { BlogPostClient } from "./page.client"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Get related posts (same category, exclude current)
  const relatedPosts = getBlogPosts()
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3)

  return (
    <>
      <Analytics />
      <Header />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
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
