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

export function readDuration(video) {
  return Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
}

export async function waitForMetadata(video, timeoutMs = TIMEOUT_MS) {
  if (video.readyState >= 1 && readDuration(video) >= 0) return
  await once(video, 'loadedmetadata', timeoutMs)
}

export async function seekVideo(video, time, timeoutMs = TIMEOUT_MS) {
  const duration = readDuration(video)
  const target = Math.max(0, Math.min(duration || 0, time))
  if (Math.abs(video.currentTime - target) < 0.05) return
  video.currentTime = target
  await once(video, 'seeked', timeoutMs)
}

export async function captureFrame(video, { maxEdge = POSTER_EDGE, quality = POSTER_QUALITY } = {}) {
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

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

/**
 * Grab a poster frame from a video file, outside the upload form.
 * Resolves to null when the browser cannot decode the file (e.g. HEVC .mov).
 */
export async function extractPoster(file, options = {}) {
  if (!file.type.startsWith('video/')) return null

  const url = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.preload = 'metadata'
  video.muted = true
  video.playsInline = true

  try {
    video.src = url
    await waitForMetadata(video)
    const duration = readDuration(video)
    const target = duration > 0 ? Math.min(1, duration * 0.1) : 0
    await seekVideo(video, target)
    return await captureFrame(video, options)
  } catch {
    return null
  } finally {
    video.removeAttribute('src')
    video.load()
    URL.revokeObjectURL(url)
  }
}
