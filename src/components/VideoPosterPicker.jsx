import { useEffect, useMemo, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { captureFrame, readDuration, seekVideo } from '../lib/video'

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const whole = Math.floor(seconds)
  const minutes = Math.floor(whole / 60)
  const rest = whole % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

export default function VideoPosterPicker({ file, onSelect, disabled = false }) {
  const videoRef = useRef(null)
  const onSelectRef = useRef(onSelect)
  const queueRef = useRef(Promise.resolve())
  const requestRef = useRef(0)
  const mountedRef = useRef(true)

  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [duration, setDuration] = useState(0)
  const [time, setTime] = useState(0)
  const [preview, setPreview] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!file || !video) return undefined
    const next = URL.createObjectURL(file)
    video.src = next
    video.load()
    return () => {
      requestRef.current += 1
      video.pause()
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(next)
    }
  }, [file])

  const previewUrl = useMemo(() => (preview ? URL.createObjectURL(preview) : ''), [preview])
  useEffect(() => {
    if (!previewUrl) return undefined
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])


  function grab(at) {
    const video = videoRef.current
    if (!video) return Promise.resolve(null)

    // Captures run one at a time: seeking is shared state on the video element.
    const task = queueRef.current.then(async () => {
      try {
        await seekVideo(video, at)
        return await captureFrame(video)
      } catch {
        setFailed(true)
        return null
      }
    })
    queueRef.current = task.catch(() => {})
    return task
  }

  async function handleMetadata() {
    const video = videoRef.current
    if (!video) return
    const total = readDuration(video)
    setDuration(total)
    setReady(true)

    const start = total > 0 ? Math.min(1, total * 0.1) : 0
    setTime(start)
    setSelectedTime(start)
    const blob = await grab(start)
    if (!mountedRef.current) return
    if (!blob) {
      setSelectedTime(null)
      return
    }
    setPreview(blob)
    onSelectRef.current?.(blob)
  }

  useEffect(() => {
    if (!ready || failed || playing) return undefined
    if (selectedTime !== null && Math.abs(time - selectedTime) < 0.05) return undefined

    const id = setTimeout(async () => {
      const request = ++requestRef.current
      const blob = await grab(time)
      if (!mountedRef.current || request !== requestRef.current) return
      if (blob) setPreview(blob)
    }, 150)
    return () => clearTimeout(id)
  }, [time, ready, failed, playing, selectedTime])

  async function togglePlay() {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      try {
        await video.play()
        setPlaying(true)
      } catch {
        setFailed(true)
      }
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  function handleSeek(event) {
    const next = Number(event.target.value)
    if (!Number.isFinite(next)) return
    const video = videoRef.current
    if (video && !video.paused) {
      video.pause()
      setPlaying(false)
    }
    setTime(next)
  }

  async function confirmFrame() {
    if (disabled || busy) return
    setBusy(true)
    const video = videoRef.current
    if (video && !video.paused) {
      video.pause()
      setPlaying(false)
    }
    requestRef.current += 1
    const blob = await grab(time)
    if (!mountedRef.current) return
    setBusy(false)
    if (!blob) return
    setPreview(blob)
    setSelectedTime(time)
    onSelectRef.current?.(blob)
  }

  const isSelected = selectedTime !== null && Math.abs(time - selectedTime) < 0.05

  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
          Thumbnail dari video
        </p>
        <p className="font-mono text-[11px] tabular-nums uppercase tracking-[0.12em] text-muted">
          {formatTime(time)} / {formatTime(duration)}
        </p>
      </div>

      <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg bg-black">
        <video
            ref={videoRef}
            muted
            playsInline
            preload="metadata"
            className="size-full object-contain"
            onLoadedMetadata={handleMetadata}
            onTimeUpdate={(event) => {
              if (playing) setTime(event.currentTarget.currentTime)
            }}
            onPause={() => setPlaying(false)}
            onPlay={() => setPlaying(true)}
            onError={() => setFailed(true)}
        />

        {failed ? (
          <p className="absolute inset-0 grid place-items-center px-4 text-center text-xs leading-relaxed text-white/80">
            Browser tidak bisa membaca video ini. Unggah thumbnail manual di bawah.
          </p>
        ) : (
          ready && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center bg-black/20">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={playing ? 'Jeda video' : 'Putar video'}
                className="pointer-events-auto grid size-11 place-items-center rounded-full bg-black/60 text-white transition-colors duration-200 hover:bg-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {playing ? (
                  <Pause className="size-4 fill-white" aria-hidden="true" />
                ) : (
                  <Play className="ml-0.5 size-4 fill-white" aria-hidden="true" />
                )}
              </button>
            </span>
          )
        )}
      </div>

      <label className="mt-3 block">
        <span className="sr-only">Pilih frame thumbnail</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={time}
          disabled={!ready || failed}
          onChange={handleSeek}
          aria-valuetext={`Frame ${formatTime(time)}`}
          className="h-11 w-full accent-signal disabled:opacity-50"
        />
      </label>

      <div className="mt-1 flex flex-wrap items-center gap-3">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Pratinjau frame video"
            className="h-14 w-24 shrink-0 rounded-lg border border-line object-cover"
          />
        ) : (
          <span className="grid h-14 w-24 shrink-0 place-items-center rounded-lg border border-dashed border-cool bg-paper-soft">
            <Play className="size-4 text-muted" aria-hidden="true" />
          </span>
        )}

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
            {selectedTime === null
              ? 'Belum ada frame terpilih'
              : isSelected
                ? `Terpilih / ${formatTime(selectedTime)}`
                : `Frame ${formatTime(time)}`}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-muted">
            Geser untuk memilih momen.
          </p>
        </div>

        <button
          type="button"
          onClick={confirmFrame}
          disabled={!ready || failed || disabled || busy}
          aria-busy={busy}
          className="min-h-11 w-full shrink-0 rounded-lg border border-ink px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-ink transition-colors duration-200 hover:bg-ink hover:text-paper disabled:opacity-50 sm:w-auto"
        >
          {busy ? 'Menyiapkan...' : isSelected ? 'Terpilih' : 'Gunakan frame'}
        </button>
      </div>
    </div>
  )
}






