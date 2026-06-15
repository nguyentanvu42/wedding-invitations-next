'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWedding } from '@/contexts/WeddingContext'
import EnvelopeOpening from './EnvelopeOpening'
import InvitationCard from './InvitationCard'
import PhotoGallery from './PhotoGallery'
import WishesSection from './WishesSection'
import './InvitationPage.css'

export default function InvitationPage() {
  const searchParams = useSearchParams()
  const guestId = searchParams.get('id')
  const { getGuestById, weddingInfo, loading } = useWedding()

  const [phase, setPhase] = useState('envelope')
  const [cardVisible, setCardVisible] = useState(false)

  const guest = guestId ? getGuestById(guestId) : null
  const guestName = guest ? guest.name : null

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
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải...</div>
  }

  return (
    <div className="invitation-page">
      {phase === 'envelope' && (
        <EnvelopeOpening onOpen={handleEnvelopeOpen} />
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
