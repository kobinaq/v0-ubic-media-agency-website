import puppeteer from "puppeteer"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, "..", "public")

const sites = [
  { url: "https://writidian.com", filename: "case-writidian.jpg" },
  { url: "https://socialmarketersnetwork.com", filename: "case-smn.jpg" },
  { url: "https://lurniq.com", filename: "case-lurniq.jpg" },
  { url: "https://cozyoven.store", filename: "case-cozyoven.jpg" },
  { url: "https://thehaircessorize.com", filename: "case-haircessorize.jpg" },
  { url: "https://sybilesi.com", filename: "case-sybilesi.jpg" },
]

/** Used only when a live capture fails. */
const FALLBACKS = {
  "case-writidian.jpg": "portfolio-9.jpg",
  "case-smn.jpg": "service-2.jpg",
  "case-lurniq.jpg": "service-1.jpg",
  "case-cozyoven.jpg": "portfolio-1.jpg",
  "case-haircessorize.jpg": "portfolio-4.jpg",
  "case-sybilesi.jpg": "portfolio-3.jpg",
}

const chromeCandidates = [
  process.env.PUPPETEER_EXECUTABLE_PATH,
  "/usr/local/bin/google-chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean)

const executablePath = chromeCandidates.find((candidate) => fs.existsSync(candidate))

function applyFallback(filename, reason) {
  const fallback = FALLBACKS[filename]
  const dest = path.join(publicDir, filename)
  if (!fallback) {
    console.log(`❌ ${filename}: no fallback mapped (${reason})`)
    return false
  }
  fs.copyFileSync(path.join(publicDir, fallback), dest)
  console.log(`↩️  ${filename}: fallback from public/${fallback} (${reason})`)
  return true
}

const results = []

const browser = await puppeteer.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--font-render-hinting=none",
  ],
})

for (const site of sites) {
  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    )
    try {
      await page.goto(site.url, { waitUntil: "networkidle2", timeout: 30000 })
    } catch {
      await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: 45000 })
    }
    await new Promise((r) => setTimeout(r, 2000))
    const outPath = path.join(publicDir, site.filename)
    await page.screenshot({ path: outPath, type: "jpeg", quality: 85 })
    console.log(`✅ ${site.url} → public/${site.filename}`)
    results.push({ filename: site.filename, url: site.url, source: "live" })
    await page.close()
  } catch (e) {
    console.log(`❌ ${site.url}: ${e.message}`)
    applyFallback(site.filename, e.message)
    results.push({ filename: site.filename, url: site.url, source: "fallback", error: e.message })
  }
}

await browser.close()

const fallbackUsed = results.filter((r) => r.source === "fallback")
console.log("\nScreenshot summary:")
for (const result of results) {
  console.log(`  ${result.filename}: ${result.source}${result.error ? ` (${result.error})` : ""}`)
}
if (fallbackUsed.length) {
  console.log(`\nFallbacks used: ${fallbackUsed.map((r) => r.filename).join(", ")}`)
} else {
  console.log("\nAll six captures used live screenshots.")
}
