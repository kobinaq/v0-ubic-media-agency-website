# Website Diagnostics Report

Date: 2026-02-13  
Scope: UX, SEO, technical quality, and conversion readiness based on repository review.

## Diagnostics summary

- Internal route scan found no broken internal links for statically declared `href` values.
- Lint is currently not runnable because ESLint v9 expects a flat config (`eslint.config.*`) that is not present.
- Dependency install is blocked in this environment by npm registry authorization (`403`), so full build/runtime checks could not be executed.
- Core SEO files exist (`robots.ts`, `sitemap.ts`) and include the key public pages.
- Several performance and SEO opportunities remain (metadata depth, image optimization strategy, semantic/accessibility polish, and trust/conversion content).

## Top 10 improvement opportunities (UX + SEO)

1. **Complete OpenGraph/Twitter preview metadata per page**  
   Add a reusable OG image, `metadataBase`, and page-level title/description overrides so snippets are not generic across all pages.

2. **Switch content images from `<img>` to `next/image` where practical**  
   Portfolio/home images currently use native `<img>`, reducing optimization benefits (responsive sizing, modern formats, lazy loading controls).

3. **Restore a visible brand anchor in mobile nav header**  
   The mobile menu currently has an empty logo link area, which weakens orientation and perceived polish.

4. **Add an ESLint flat config and enforce CI linting**  
   Current lint script fails due to missing flat config; this prevents catching regressions early.

5. **Re-enable strict build safeguards**  
   `next.config.mjs` currently ignores TypeScript and ESLint build errors, which can ship defects silently.

6. **Add stronger local SEO trust blocks**  
   Expand location/service-area mentions, testimonials, and case-study schema where appropriate to improve geo-relevance and conversion confidence.

7. **Improve sitemap freshness strategy**  
   Current sitemap uses `new Date()` for all URLs, which can send noisy freshness signals. Use content-driven last-modified dates.

8. **Strengthen accessibility audit baseline**  
   Validate keyboard navigation, focus states, heading hierarchy, landmark usage, and modal semantics on key pages.

9. **Create a technical SEO monitoring loop**  
   Add recurring checks for 404s, redirect chains, Core Web Vitals, index coverage, and schema validation in a monthly routine.

10. **Improve conversion instrumentation**  
    Add event tracking for primary funnels (contact submit, calendar click, package CTA click) and tie these to landing page/source.

## Quick wins completed in this branch

- Added stronger global metadata defaults: `metadataBase`, canonical fallback, OG image and Twitter image configuration.
- Added route-specific metadata + canonicals for `/portfolio`, `/contact`, and `/packages` by moving those pages to server wrappers with client components.
- Converted portfolio gallery and modal images to `next/image` for better image delivery behavior.
- Restored mobile-menu logo visibility in header for better navigation UX consistency.
- Expanded sitemap coverage to include packages and legal pages with stable `lastModified` values.
