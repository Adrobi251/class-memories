// Asymmetric grid: wide and tall cards alternate so the gallery reads like a
// photo wall instead of a uniform table.
export const GALLERY_SPANS = [
  'md:col-span-7',
  'md:col-span-5',
  'md:col-span-5',
  'md:col-span-7',
  'md:col-span-4',
  'md:col-span-8',
]

export const GALLERY_RATIOS = [
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-[1/1]',
  'aspect-[4/3]',
  'aspect-[3/4]',
  'aspect-[16/9]',
]

export function galleryLayout(index) {
  return {
    span: GALLERY_SPANS[index % GALLERY_SPANS.length],
    ratio: GALLERY_RATIOS[index % GALLERY_RATIOS.length],
  }
}
