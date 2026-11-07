import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowDownRight,
  ArrowLeft,
  ImageOff,
  Images,
  LogOut,
  Pencil,
  RefreshCw,
  Trash2,
  Upload,
} from 'lucide-react'
import AdminBulkBar from './AdminBulkBar'
import AdminGate from './AdminGate'
import AdminMediaCard from './AdminMediaCard'
import AdminMediaTable from './AdminMediaTable'
import AdminMediaToolbar from './AdminMediaToolbar'
import AdminSidebar from './AdminSidebar'
import AdminStats from './AdminStats'
import ConfirmDialog from '../ConfirmDialog'
import EditMediaModal from '../EditMediaModal'
import MediaPreview from '../MediaPreview'
import Modal from '../Modal'
import StatusToast from '../StatusToast'
import { useAuth } from '../../context/AuthContext'
import { useMedia } from '../../hooks/useMedia'
import { deleteMediaItems, formatMediaError } from '../../lib/media'
import { site } from '../../lib/site'

const UploadModal = lazy(() => import('../UploadModal'))

const PAGE_SIZE = 12
const LOAD_STEP = 12
const VIEW_KEY = 'cm-admin-view'

function LoadingCards() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-white/10 bg-paper-soft"
        >
          <div className="skeleton aspect-[4/3]" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-3 w-3/4 rounded" />
            <div className="skeleton h-2.5 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyLibrary({ onUpload }) {
  return (
    <div className="mt-8 grid place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-full border border-white/10 bg-paper-soft text-accent-soft">
        <Images className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-serif text-xl">Belum ada dokumentasi.</h3>
      <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted">
        Unggah foto atau video pertama untuk mulai membangun arsip kelas.
      </p>
      <button
        type="button"
        onClick={onUpload}
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-signal px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:bg-signal-dark"
      >
        <Upload className="size-4" aria-hidden="true" />
        Upload dokumentasi
      </button>
    </div>
  )
}

function EmptyFilter({ query, onReset }) {
  return (
    <div className="mt-6 grid place-items-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-6 py-14 text-center">
      <ImageOff className="size-7 text-muted" aria-hidden="true" />
      <h3 className="mt-3 font-serif text-xl">Tidak ada hasil.</h3>
      <p className="mt-2 max-w-[44ch] break-words text-sm leading-relaxed text-muted">
        {query
          ? `Tidak ada dokumentasi yang cocok dengan "${query}".`
          : 'Filter ini belum punya dokumentasi.'}
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        Reset pencarian & filter
      </button>
    </div>
  )
}

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth()
  const { media, loading, error, refresh } = useMedia()

  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('semua')
  const [sort, setSort] = useState('terbaru')
  const [view, setView] = useState(() => {
    const saved = window.localStorage.getItem(VIEW_KEY)
    return saved === 'list' ? 'list' : 'grid'
  })
  const [page, setPage] = useState({ key: '', limit: PAGE_SIZE })
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [previewId, setPreviewId] = useState(null)
  const [editItem, setEditItem] = useState(null)
  const [deleteList, setDeleteList] = useState([])
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadMounted, setUploadMounted] = useState(false)
  const [notice, setNotice] = useState('')

  const normalizedQuery = query.trim().toLocaleLowerCase('id-ID')
  const listKey = `${filter}|${normalizedQuery}|${sort}`

  useEffect(() => {
    window.scrollTo(0, 0)
    const previous = document.title
    document.title = `Dashboard Admin - ${site.name}`
    return () => {
      document.title = previous
    }
  }, [])

  const counts = useMemo(() => {
    const foto = media.filter((item) => item.media_type === 'foto').length
    return {
      semua: media.length,
      foto,
      video: media.length - foto,
    }
  }, [media])

  const filtered = useMemo(() => {
    let list = media

    if (filter === 'foto' || filter === 'video') {
      list = list.filter((item) => item.media_type === filter)
    }

    if (normalizedQuery) {
      list = list.filter((item) => {
        const haystack = [item.title, item.description]
          .filter(Boolean)
          .join(' ')
          .toLocaleLowerCase('id-ID')
        return haystack.includes(normalizedQuery)
      })
    }

    const sorted = [...list]
    if (sort === 'terlama') {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sort === 'judul') {
      sorted.sort((a, b) => a.title.localeCompare(b.title, 'id-ID'))
    } else {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
    return sorted
  }, [filter, media, normalizedQuery, sort])

  const limit = page.key === listKey ? page.limit : PAGE_SIZE
  const visible = filtered.slice(0, limit)
  const remaining = Math.max(0, filtered.length - visible.length)

  const selectedItems = useMemo(
    () => media.filter((item) => selectedIds.has(item.id)),
    [media, selectedIds],
  )

  const allSelected = visible.length > 0 && visible.every((item) => selectedIds.has(item.id))
  const someSelected = !allSelected && visible.some((item) => selectedIds.has(item.id))

  const previewIndex = filtered.findIndex((item) => item.id === previewId)
  const previewItem = previewIndex >= 0 ? filtered[previewIndex] : null

  const dismissNotice = useCallback(() => setNotice(''), [])

  const openUpload = useCallback(() => {
    setUploadMounted(true)
    setUploadOpen(true)
  }, [])

  const closeUpload = useCallback(() => setUploadOpen(false), [])

  function resetSelection() {
    setSelectedIds(new Set())
    setPreviewId(null)
  }

  function handleQueryChange(nextQuery) {
    setQuery(nextQuery)
    resetSelection()
  }

  function handleFilterChange(nextFilter) {
    setFilter(nextFilter)
    resetSelection()
  }

  function handleSortChange(nextSort) {
    setSort(nextSort)
    resetSelection()
  }

  function toggleSelect(id) {
    setSelectedIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set())
      return
    }
    setSelectedIds((previous) => {
      const next = new Set(previous)
      visible.forEach((item) => next.add(item.id))
      return next
    })
  }

  function handleViewChange(nextView) {
    setView(nextView)
    window.localStorage.setItem(VIEW_KEY, nextView)
  }

  function showRelative(offset) {
    if (!filtered.length) return
    const nextIndex = (previewIndex + offset + filtered.length) % filtered.length
    setPreviewId(filtered[nextIndex].id)
  }

  function requestDelete(item) {
    setDeleteError('')
    setDeleteList([item])
  }

  function requestBulkDelete() {
    if (!selectedItems.length) return
    setDeleteError('')
    setDeleteList(selectedItems)
  }

  async function confirmDelete() {
    if (!deleteList.length || deleting) return

    const targets = deleteList
    setDeleting(true)
    setDeleteError('')

    try {
      await deleteMediaItems(targets)
      setDeleteList([])
      setSelectedIds(new Set())
      if (targets.some((item) => item.id === previewId)) setPreviewId(null)
      await refresh()
      setNotice(
        targets.length === 1
          ? 'Dokumentasi berhasil dihapus.'
          : `${targets.length} dokumentasi berhasil dihapus.`,
      )
    } catch (err) {
      setDeleteError(formatMediaError(err, 'Gagal menghapus dokumentasi.'))
    } finally {
      setDeleting(false)
    }
  }

  function handleUploaded() {
    refresh()
    setNotice('Dokumentasi berhasil diunggah.')
  }

  function handleSaved() {
    refresh()
    setEditItem(null)
    setNotice('Perubahan dokumentasi disimpan.')
  }

  async function handleSignOut() {
    await signOut()
    window.location.hash = '#home'
  }

  function resetFilters() {
    setQuery('')
    setFilter('semua')
    setSort('terbaru')
    resetSelection()
  }

  if (authLoading) {
    return (
      <div
        className="grid min-h-[100dvh] place-items-center bg-paper px-6 text-center"
        aria-busy="true"
      >
        <div className="flex flex-col items-center gap-4">
          <span className="grid size-12 place-items-center rounded-xl bg-signal text-sm font-bold tracking-[0.08em] text-white">
            {site.mark}
          </span>
          <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-accent-soft">
            Memeriksa sesi admin...
          </p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return <AdminGate />

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <AdminSidebar user={user} onUpload={openUpload} onSignOut={handleSignOut} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-paper/85 backdrop-blur-xl lg:hidden">
          <div className="flex h-16 items-center justify-between gap-3 px-4">
            <a href="#home" className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-signal text-[11px] font-bold tracking-[0.08em] text-white">
                {site.mark}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold uppercase tracking-[0.14em]">
                  {site.shortName}
                </span>
                <span className="block text-[9px] uppercase tracking-[0.24em] text-muted">
                  Arsip studio
                </span>
              </span>
            </a>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={openUpload}
                aria-label="Unggah dokumentasi"
                className="grid size-11 place-items-center rounded-full bg-signal text-white"
              >
                <Upload className="size-4" aria-hidden="true" />
              </button>
              <a
                href="#home"
                aria-label="Lihat situs"
                className="grid size-11 place-items-center rounded-full border border-line text-muted"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
              </a>
              <button
                type="button"
                onClick={handleSignOut}
                aria-label="Keluar dari dashboard"
                className="grid size-11 place-items-center rounded-full border border-line text-muted"
              >
                <LogOut className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1440px] px-4 pb-36 pt-8 sm:px-8 lg:pt-12">
          <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.32em] text-accent-soft">
                <span aria-hidden="true" className="h-px w-8 bg-accent-soft/60" />
                Admin / Galeri
              </p>
              <h1 className="mt-3 max-w-[20ch] font-serif text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.015em] text-balance">
                Kelola kenangan kelas.
              </h1>
              <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-muted">
                Cari, sunting, dan kurasi seluruh foto dan video yang sudah tayang di
                galeri publik.
              </p>
            </div>

            <button
              type="button"
              onClick={openUpload}
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-signal px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-signal-dark active:translate-y-0"
            >
              <Upload className="size-4" aria-hidden="true" />
              Upload dokumentasi
            </button>
          </div>

          <AdminStats media={media} loading={loading} />

          <section aria-labelledby="library-title" className="mt-10">
            <div className="flex flex-col gap-1">
              <h2 id="library-title" className="font-serif text-2xl leading-tight">
                Galeri media
              </h2>
              <p className="text-sm leading-relaxed text-muted">
                Semua dokumentasi yang sudah diunggah, terbaru lebih dulu.
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                className="mt-6 flex flex-col items-start gap-4 rounded-2xl border border-signal/60 bg-paper-soft px-6 py-6"
              >
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-signal-bright">
                    Dashboard gagal dimuat
                  </p>
                  <p className="mt-2 max-w-[56ch] text-sm leading-relaxed text-muted">
                    {error.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={refresh}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink transition-colors duration-200 hover:border-accent-soft hover:text-accent-soft"
                >
                  <RefreshCw className="size-4" aria-hidden="true" />
                  Coba lagi
                </button>
              </div>
            ) : loading ? (
              <div className="mt-6" aria-busy="true">
                <LoadingCards />
              </div>
            ) : media.length === 0 ? (
              <EmptyLibrary onUpload={openUpload} />
            ) : (
              <>
                <div className="mt-6">
                  <AdminMediaToolbar
                    query={query}
                    onQueryChange={handleQueryChange}
                    filter={filter}
                    onFilterChange={handleFilterChange}
                    counts={counts}
                    sort={sort}
                    onSortChange={handleSortChange}
                    view={view}
                    onViewChange={handleViewChange}
                    visible={visible.length}
                    total={filtered.length}
                    allSelected={allSelected}
                    someSelected={someSelected}
                    onToggleSelectAll={toggleSelectAll}
                  />
                </div>

                {filtered.length === 0 ? (
                  <EmptyFilter query={query.trim()} onReset={resetFilters} />
                ) : view === 'grid' ? (
                  <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
                    {visible.map((item) => (
                      <AdminMediaCard
                        key={item.id}
                        item={item}
                        selected={selectedIds.has(item.id)}
                        onToggleSelect={() => toggleSelect(item.id)}
                        onPreview={() => setPreviewId(item.id)}
                        onEdit={() => setEditItem(item)}
                        onDelete={() => requestDelete(item)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-6">
                    <AdminMediaTable
                      items={visible}
                      selectedIds={selectedIds}
                      onToggleSelect={toggleSelect}
                      allSelected={allSelected}
                      someSelected={someSelected}
                      onToggleSelectAll={toggleSelectAll}
                      onPreview={(item) => setPreviewId(item.id)}
                      onEdit={setEditItem}
                      onDelete={requestDelete}
                    />
                  </div>
                )}

                {remaining > 0 && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setPage({ key: listKey, limit: limit + LOAD_STEP })
                      }
                      className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/[0.03] px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-soft hover:text-accent-soft active:translate-y-0"
                    >
                      Muat lebih banyak
                      <ArrowDownRight className="size-4" aria-hidden="true" />
                    </button>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted">
                      {remaining} dokumentasi lagi
                    </p>
                  </div>
                )}
              </>
            )}
          </section>
        </main>
      </div>

      <Modal
        open={Boolean(previewItem)}
        onClose={() => setPreviewId(null)}
        title={previewItem?.title ?? 'Dokumentasi'}
        wide
      >
        {previewItem && (
          <div className="space-y-4">
            <MediaPreview
              key={previewItem.id}
              item={previewItem}
              position={previewIndex + 1}
              total={filtered.length}
              onPrev={() => showRelative(-1)}
              onNext={() => showRelative(1)}
            />

            <div className="flex flex-col gap-2 border-t border-line pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setPreviewId(null)
                  setEditItem(previewItem)
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-paper"
              >
                <Pencil className="size-4" aria-hidden="true" />
                Edit dokumentasi
              </button>
              <button
                type="button"
                onClick={() => {
                  setPreviewId(null)
                  requestDelete(previewItem)
                }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-signal px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-signal-dark"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Hapus dokumentasi
              </button>
            </div>
          </div>
        )}
      </Modal>

      {editItem && (
        <EditMediaModal
          key={editItem.id}
          open={Boolean(editItem)}
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={deleteList.length > 0}
        items={deleteList}
        busy={deleting}
        error={deleteError}
        onClose={() => {
          if (deleting) return
          setDeleteList([])
          setDeleteError('')
        }}
        onConfirm={confirmDelete}
      />

      <AdminBulkBar
        count={selectedItems.length}
        busy={deleting}
        onDelete={requestBulkDelete}
        onClear={() => setSelectedIds(new Set())}
      />

      <Suspense fallback={null}>
        {uploadMounted && (
          <UploadModal
            open={uploadOpen}
            onClose={closeUpload}
            onUploaded={handleUploaded}
          />
        )}
      </Suspense>

      <StatusToast message={notice} onDismiss={dismissNotice} positionClass="bottom-28" />
    </div>
  )
}
