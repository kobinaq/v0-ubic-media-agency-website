# Blog Feature

## Overview
The blog feature allows you to manage blog posts through a JSON file, similar to other content on the site. Blog posts are fully integrated with your site's SEO (sitemap, metadata) and navigation.

## Technical Implementation
- **Blog listing page**: `/app/blog/page.tsx` (client component with filtering)
- **Individual post pages**: `/app/blog/[slug]/page.tsx` (server component for SEO)
- **Content source**: `content/blog.json`
- **Utility functions**: `lib/content.ts` (getBlogPosts, getBlogPost, getBlogCategories)
- **Sitemap integration**: Automatic inclusion of all blog posts in sitemap.xml

## Adding New Blog Posts

Edit the `content/blog.json` file to add new blog posts. Each post should follow this structure:

```json
{
  "id": "unique-post-id",
  "slug": "url-friendly-slug",
  "title": "Your Blog Post Title",
  "excerpt": "A short description that appears in the blog listing",
  "author": "Author Name",
  "date": "2025-01-15",
  "category": "Category Name",
  "image": "/path/to/image.jpg",
  "content": [
    {
      "type": "paragraph",
      "text": "Your paragraph text here"
    },
    {
      "type": "heading",
      "text": "Section Heading"
    },
    {
      "type": "image",
      "src": "/path/to/image.jpg",
      "alt": "Image description"
    },
    {
      "type": "list",
      "items": [
        "First list item",
        "Second list item",
        "Third list item"
      ]
    }
  ]
}
```

## Content Block Types

### Paragraph
```json
{
  "type": "paragraph",
  "text": "Your text content"
}
```

### Heading
```json
{
  "type": "heading",
  "text": "Your heading text"
}
```

### Image
```json
{
  "type": "image",
  "src": "/path/to/image.jpg",
  "alt": "Description for accessibility"
}
```

### List
```json
{
  "type": "list",
  "items": ["Item 1", "Item 2", "Item 3"]
}
```

## Adding Images

1. Place your images in the `public` folder (e.g., `public/blog/my-image.jpg`)
2. Reference them in the JSON using the path starting with `/` (e.g., `/blog/my-image.jpg`)

## Blog URLs

- Blog listing: `/blog`
- Individual post: `/blog/your-post-slug`

## Categories

Categories are automatically extracted from the posts. When you add a new category to a post, it will appear in the filter automatically.

## Best Practices

1. **Use descriptive slugs**: Make sure each slug is unique and URL-friendly (lowercase, hyphens instead of spaces)
2. **Optimize images**: Keep images under 500KB for better performance
3. **Write compelling excerpts**: Keep them between 100-160 characters
4. **Use proper dates**: Format dates as YYYY-MM-DD
5. **Structure content**: Mix different content types (paragraphs, headings, images, lists) for better readability

## Example Blog Post

See the existing posts in `content/blog.json` for complete examples.
