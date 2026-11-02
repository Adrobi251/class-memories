import { preferredImageType } from './image'

const POSTER_EDGE = 1280
const POSTER_QUALITY = 0.72
const TIMEOUT_MS = 8000


function once(target, event, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup()
      reject(new Error(`Timeout menunggu event ${event}.`))
    }, timeoutMs)
    function onDone() {
      cleanup()
      resolve()
    }
    function onFail() {
      cleanup()
      reject(new Error('Video tidak dapat dibaca browser.'))
    }
    function cleanup() {
      clearTimeout(timer)
      target.removeEventListener(event, onDone)
      target.removeEventListener('error', onFail)
    }
    target.addEventListener(event, onDone, { once: true })
    target.addEventListener('error', onFail, { once: true })
  })
}

/**
 * Grab a poster frame from a video file, in the browser.
 * Resolves to null when the browser cannot decode the file (e.g. HEVC .mov),
 * so the upload can still continue without a thumbnail.
 */
export async function extractPoster(file, { maxEdge = POSTER_EDGE, quality = POSTER_QUALITY } = {}) {
  if (!file.type.startsWith('video/')) return null

  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.muted = true
  video.playsInline = true
  video.crossOrigin = 'anonymous'

  try {
    video.src = url
    await once(video, 'loadedmetadata', TIMEOUT_MS)

    const duration = Number.isFinite(video.duration) ? video.duration : 0
    const target = duration > 0 ? Math.min(1, duration * 0.1) : 0
    video.currentTime = target
    await once(video, 'seeked', TIMEOUT_MS)

    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) return null

    const scale = Math.min(1, maxEdge / Math.max(width, height))
    const targetW = Math.max(1, Math.round(width * scale))
    const targetH = Math.max(1, Math.round(height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const context = canvas.getContext('2d')
    if (!context) return null

    const type = preferredImageType()
    if (type === 'image/jpeg') {
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, targetW, targetH)
    }
    context.imageSmoothingQuality = 'high'
    context.drawImage(video, 0, 0, targetW, targetH)

    return await new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality)
    })
  } catch {
    return null
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}

