const MAX_EDGE = 1920
const THUMB_EDGE = 800
const MAIN_QUALITY = 0.82
const THUMB_QUALITY = 0.72

function canEncode(type) {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL(type).startsWith(`data:${type}`)
}

export const preferredImageType = () => (canEncode('image/webp') ? 'image/webp' : 'image/jpeg')

const OUTPUT_TYPE = preferredImageType

async function decode(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file)
    } catch {
      // fall through to <img> decoding
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    return image
  } finally {
    URL.revokeObjectURL(url)
  }
}

function render(source, maxEdge, quality) {
  const width = source.width
  const height = source.height
  if (!width || !height) throw new Error('Dimensi gambar tidak terbaca.')

  const scale = Math.min(1, maxEdge / Math.max(width, height))
  const targetW = Math.max(1, Math.round(width * scale))
  const targetH = Math.max(1, Math.round(height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = targetW
  canvas.height = targetH
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas tidak tersedia.')

  const type = OUTPUT_TYPE()
  if (type === 'image/jpeg') {
    // JPEG has no alpha channel: paint white so transparent PNGs do not turn black.
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, targetW, targetH)
  }

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(source, 0, 0, targetW, targetH)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, type, width: targetW, height: targetH }) : reject(new Error('Gagal mengompres gambar.'))),
      type,
      quality,
    )
  })
}

export function replaceExtension(name, type) {
  const ext = type === 'image/webp' ? 'webp' : 'jpg'
  return name.replace(/\.[^./\\]+$/, '') + '.' + ext
}

/**
 * Re-encode an uploaded photo to WebP and build a small thumbnail.
 * Falls back to the original file when re-encoding would inflate it or fail.
 */
export async function preparePhoto(file) {
  if (!file.type.startsWith('image/')) return { main: file, thumbnail: null }

  const bitmap = await decode(file)
  try {
    const main = await render(bitmap, MAX_EDGE, MAIN_QUALITY)
    const thumbnail = await render(bitmap, THUMB_EDGE, THUMB_QUALITY)

    // Never ship something larger than the file the admin picked.
    if (main.blob.size >= file.size) {
      return { main: file, thumbnail: thumbnail.blob }
    }

    return { main: main.blob, thumbnail: thumbnail.blob, type: main.type }
  } finally {
    if (typeof bitmap.close === 'function') bitmap.close()
  }
}

