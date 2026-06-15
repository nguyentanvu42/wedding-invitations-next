'use client'
import { useState, useEffect, useRef } from 'react'
import { useWedding } from '@/contexts/WeddingContext'
import './PhotoGallery.css'

const DEMO_PHOTOS = [
  '/slide/MAN_5353.jpg',
  '/slide/MAN_5405.jpg',
  '/slide/MAN_5418.jpg',
]

export default function PhotoGallery() {
  const { weddingInfo, loading } = useWedding()

  const [current, setCurrent]     = useState(0)
  const [loadedSet, setLoadedSet] = useState(() => new Set([0, 1]))
  const [readySet, setReadySet]   = useState(() => new Set())

  const timerRef   = useRef(null)
  const readyRef   = useRef(new Set())
  const pendingRef = useRef(null)

  const startAutoplay = (total) => {
    clearInterval(timerRef.current)
    if (total <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % total
        if (readyRef.current.has(next)) {
          return next
        }
        clearInterval(timerRef.current)
        pendingRef.current = next
        return prev
      })
    }, 3500)
  }

  const photos = (!loading && weddingInfo)
    ? (weddingInfo.coverPhotos?.length ? weddingInfo.coverPhotos : DEMO_PHOTOS)
    : DEMO_PHOTOS
  const isDemo = !weddingInfo?.coverPhotos?.length

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setCurrent(0)
    setLoadedSet(new Set([0, 1]))
    setReadySet(new Set())
    readyRef.current = new Set()
    pendingRef.current = null
    startAutoplay(photos.length)
    return () => clearInterval(timerRef.current)
  }, [photos.length, weddingInfo?.coverPhotos])

  useEffect(() => {
    const n = photos.length
    setLoadedSet(prev => {
      const next = new Set(prev)
      next.add(current)
      next.add((current + 1) % n)
      next.add((current - 1 + n) % n)
      return next
    })
  }, [current, photos.length])

  useEffect(() => {
    if (pendingRef.current !== null && readySet.has(pendingRef.current)) {
      const idx = pendingRef.current
      pendingRef.current = null
      setCurrent(idx)
      startAutoplay(photos.length)
    }
  }, [readySet])

  const handleImageReady = (i) => {
    readyRef.current = new Set([...readyRef.current, i])
    setReadySet(new Set(readyRef.current))
  }

  const goTo = (idx) => {
    pendingRef.current = null
    setCurrent(idx)
    startAutoplay(photos.length)
  }

  const bride = weddingInfo?.bride
  const groom = weddingInfo?.groom

  return (
    <section className="photo-gallery">
      <div className="gallery-header">
        <div className="gallery-title-wrap">
          <span className="gallery-flower">✿</span>
          <h2 className="gallery-title">
            <span className="gallery-script">{bride?.shortName || bride?.name || ''}</span>
            <span className="gallery-amp"> &amp; </span>
            <span className="gallery-script">{groom?.shortName || groom?.name || ''}</span>
          </h2>
          <span className="gallery-flower">✿</span>
        </div>
        <p className="gallery-sub">Những khoảnh khắc đáng nhớ</p>
      </div>

      <div className="slideshow">
        <div className="slideshow-track">
          {photos.map((src, i) => (
            <div key={src} className={`slide ${i === current ? 'active' : ''}`}>
              {loadedSet.has(i) ? (
                <img
                  src={src}
                  alt={`Ảnh ${i + 1}`}
                  referrerPolicy="no-referrer"
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  onLoad={() => handleImageReady(i)}
                />
              ) : (
                <div className="slide-placeholder" />
              )}
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button
              className="slide-btn prev"
              onClick={() => goTo((current - 1 + photos.length) % photos.length)}
            >
              ‹
            </button>
            <button
              className="slide-btn next"
              onClick={() => goTo((current + 1) % photos.length)}
            >
              ›
            </button>

            {photos.length <= 8 && (
              <div className="slide-dots">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    className={`dot ${i === current ? 'active' : ''}`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>
            )}

            <div className="slide-counter">{current + 1} / {photos.length}</div>
          </>
        )}

        {isDemo && (
          <div className="demo-badge">Ảnh demo · Thêm ảnh thực tế trong Admin</div>
        )}
      </div>
    </section>
  )
}
