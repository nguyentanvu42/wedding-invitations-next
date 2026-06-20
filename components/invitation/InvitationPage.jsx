'use client'
import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWedding } from '@/contexts/WeddingContext'
import EnvelopeOpening from './EnvelopeOpening'
import InvitationCard from './InvitationCard'
import PhotoGallery from './PhotoGallery'
import WishesSection from './WishesSection'
import LoadingScreen from './LoadingScreen'
import './InvitationPage.css'

export default function InvitationPage() {
  const searchParams = useSearchParams()
  const guestId = searchParams.get('id')
  const { getGuestById, weddingInfo, loading } = useWedding()

  const [phase, setPhase] = useState('envelope')
  const [cardVisible, setCardVisible] = useState(false)
  const pianoRef = useRef(null)
  const weddingRef = useRef(null)
  const [isMusicActive, setIsMusicActive] = useState(false)
  const [needsManualStart, setNeedsManualStart] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const piano = new Audio('/music/paulyudin-romantic-piano-164822.mp3')
    piano.loop = true
    pianoRef.current = piano

    const wedding = new Audio('/music/em-oi-sau-nay.mp3')
    wedding.loop = true
    weddingRef.current = wedding

    piano.play().then(() => {
      setIsMusicActive(true)
    }).catch(() => {
      setNeedsManualStart(true)
    })

    return () => {
      piano.pause(); piano.src = ''
      wedding.pause(); wedding.src = ''
    }
  }, [])

  const guest = guestId ? getGuestById(guestId) : null
  const guestName = guest ? guest.name : null

  const startPiano = () => {
    pianoRef.current?.play()
    setIsMusicActive(true)
    setNeedsManualStart(false)
  }

  const startMusic = () => {
    if (pianoRef.current) pianoRef.current.pause()
    weddingRef.current?.play()
    setIsMusicActive(true)
    setNeedsManualStart(false)
  }

  const toggleMute = () => {
    const newMuted = !isMuted
    if (pianoRef.current) pianoRef.current.muted = newMuted
    if (weddingRef.current) weddingRef.current.muted = newMuted
    setIsMuted(newMuted)
  }

  const handleEnvelopeOpen = () => {
    setPhase('invitation')
    setTimeout(() => setCardVisible(true), 100)
  }

  useEffect(() => {
    if (phase === 'invitation') {
      const timer = setTimeout(() => setPhase('full'), 1200)
      return () => clearTimeout(timer)
    }
  }, [phase])

  if (loading || !weddingInfo) {
    return <LoadingScreen />
  }

  return (
    <div className="invitation-page">
      {needsManualStart && (
        <button className="music-toggle" onClick={startPiano} title="Bật nhạc">
          🎵
        </button>
      )}
      {isMusicActive && (
        <button className="music-toggle" onClick={toggleMute} title={isMuted ? 'Bật nhạc' : 'Tắt nhạc'}>
          {isMuted ? '🔇' : '🎵'}
        </button>
      )}
      {phase === 'envelope' && (
        <EnvelopeOpening onOpen={handleEnvelopeOpen} onStartOpen={startMusic} />
      )}

      {(phase === 'invitation' || phase === 'full') && (
        <div className="invitation-content">
          <div className="page-bg-flowers">
            <span className="bg-flower top-left">✿</span>
            <span className="bg-flower top-right">✿</span>
          </div>

          <div className="invitation-section">
            <InvitationCard guestName={guestName} visible={cardVisible} />
          </div>

          {phase === 'full' && (
            <>
              <div className="page-separator">
                <span>✦ ✦ ✦</span>
              </div>
              <div className="gallery-section animate-fade-up">
                <PhotoGallery />
              </div>
              <div className="wishes-wrap animate-fade-up">
                <WishesSection guestId={guestId} guestName={guestName} />
              </div>
              <footer className="page-footer">
                <p>Made with ❤ for a special day</p>
              </footer>
            </>
          )}
        </div>
      )}
    </div>
  )
}
