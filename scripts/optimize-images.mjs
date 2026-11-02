// Generate responsive WebP variants for the hero and story backgrounds.
// Source photos live in /images (originals, untouched). Output goes to
// /public/images so Vite serves them as-is with a stable URL.
//
// Run: npm run images

import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const SRC_DIR = path.join(ROOT, 'images')
const OUT_DIR = path.join(ROOT, 'public', 'images')

const WIDTHS = [960, 1280, 1920]
const QUALITY = 78

const JOBS = [
  { source: 'Studio Session-30365.jpg', base: 'hero' },
  { source: 'Studio Session-30412.jpg', base: 'story' },
]

function kb(bytes) {
  return `${Math.round(bytes / 1024)} kB`
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  for (const job of JOBS) {
    const input = path.join(SRC_DIR, job.source)
    const original = await stat(input)
    console.log(`${job.source} (${kb(original.size)})`)

    for (const width of WIDTHS) {
      const output = path.join(OUT_DIR, `${job.base}-${width}.webp`)
      const info = await sharp(input)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toFile(output)

      console.log(`  -> images/${job.base}-${width}.webp  ${info.width}x${info.height}  ${kb(info.size)}`)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
