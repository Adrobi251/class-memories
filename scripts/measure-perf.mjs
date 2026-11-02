import { chromium } from 'playwright'

const URL = process.env.PERF_URL ?? 'http://localhost:4173/'
const PROFILES = {
  fast: { latency: 0, down: -1, cpu: 1 },
  slow: { latency: 150, down: (1.6 * 1024 * 1024) / 8, cpu: 4 },
}
const ROUNDS = Number(process.env.PERF_ROUNDS ?? 5)

// Prefer the Chromium that Playwright downloaded. If it is not installed (for
// example after clearing the cache), fall back to a locally installed browser so
// measuring never requires a fresh ~700 MB download.
async function launch() {
  try {
    return await chromium.launch()
  } catch {
    for (const channel of ['msedge', 'chrome']) {
      try {
        return await chromium.launch({ channel })
      } catch {
        // try the next channel
      }
    }
    throw new Error(
      'No browser available. Run `npx playwright install chromium` or install Edge/Chrome.',
    )
  }
}

const INIT = `
window.__perf = { lcp: 0, lcpEl: null, cls: 0, fcp: 0, longTasks: 0, longTaskTime: 0 };
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) {
    window.__perf.lcp = e.startTime;
    window.__perf.lcpEl = e.element ? (e.element.tagName + '.' + (e.element.className || '') + ' ' + (e.element.textContent || '').slice(0, 60)) : null;
  }
}).observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) if (!e.hadRecentInput) window.__perf.cls += e.value;
}).observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) window.__perf.fcp = e.startTime;
}).observe({ type: 'paint', buffered: true });
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) { window.__perf.longTasks++; window.__perf.longTaskTime += e.duration; }
}).observe({ type: 'longtask', buffered: true });
`

async function run(browser, profileName, round) {
  const profile = PROFILES[profileName]
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
  const cdp = await page.context().newCDPSession(page)
  const bytes = {}
  const requests = []
  cdp.on('Network.responseReceived', (e) => {
    requests.push({ requestId: e.requestId, url: e.response.url, type: e.type, mime: e.response.mimeType })
  })
  cdp.on('Network.loadingFinished', (e) => {
    const req = requests.find((r) => r.requestId === e.requestId)
    const key = req?.type ?? 'Other'
    bytes[key] = (bytes[key] ?? 0) + e.encodedDataLength
  })
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: profile.latency,
    downloadThroughput: profile.down,
    uploadThroughput: profile.down < 0 ? -1 : (750 * 1024) / 8,
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu })
  await page.addInitScript(INIT)
  await page.goto(URL, { waitUntil: 'load' })
  await page.waitForTimeout(profileName === 'slow' ? 8000 : 4000)
  const perf = await page.evaluate(() => window.__perf)
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0]
    return { ttfb: n.responseStart, domContentLoaded: n.domContentLoadedEventEnd, load: n.loadEventEnd }
  })
  const resources = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .filter((r) => /font|woff/.test(r.name) || /\.js$|\.css$/.test(r.name))
      .map((r) => ({ name: r.name, transfer: r.transferSize, duration: Math.round(r.duration) })),
  )
  await page.close()
  return { profileName, round, perf, nav, bytes, resources }
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const browser = await launch()
const results = []
for (const profile of Object.keys(PROFILES)) {
  for (let round = 0; round < ROUNDS; round++) results.push(await run(browser, profile, round))
}
await browser.close()

for (const profile of Object.keys(PROFILES)) {
  const rows = results.filter((r) => r.profileName === profile)
  const pick = (fn) => median(rows.map(fn))
  console.log(`\n=== ${profile.toUpperCase()} (median of ${rows.length}) ===`)
  console.log({
    fcp: Math.round(pick((r) => r.perf.fcp)),
    lcp: Math.round(pick((r) => r.perf.lcp)),
    cls: Number(pick((r) => r.perf.cls).toFixed(3)),
    ttfb: Math.round(pick((r) => r.nav.ttfb)),
    longTasks: Math.round(pick((r) => r.perf.longTasks)),
    longTaskTime: Math.round(pick((r) => r.perf.longTaskTime)),
    transferredKB: Object.fromEntries(
      Object.entries(rows[0].bytes).map(([k, v]) => [k, Math.round(v / 1024)]),
    ),
  })
  console.log('LCP element:', rows[0].perf.lcpEl)
  console.log('slowest:', rows[0].resources.sort((a, b) => b.transfer - a.transfer).slice(0, 6))
}
