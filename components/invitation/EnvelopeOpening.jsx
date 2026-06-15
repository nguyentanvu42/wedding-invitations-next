'use client'
import { useState } from 'react'
import { useWedding } from '@/contexts/WeddingContext'
import './EnvelopeOpening.css'

export default function EnvelopeOpening({ onOpen, onStartOpen }) {
  const [phase, setPhase] = useState('idle')
  const { weddingInfo, loading } = useWedding()

  if (loading || !weddingInfo) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải...</div>
  }

  const { bride, groom, reception } = weddingInfo
  const brideShort = bride.shortName || bride.name
  const groomShort = groom.shortName || groom.name

  const [y, m, d] = (reception?.date || '').split('-')
  const formattedDate = y ? `${d} · ${m} · ${y}` : ''

  const handleOpen = () => {
    if (phase !== 'idle') return
    onStartOpen?.()
    setPhase('opening')
    setTimeout(() => {
      setPhase('done')
      setTimeout(onOpen, 600)
    }, 1400)
  }

  return (
    <div className="envelope-wrapper" onClick={handleOpen}>
      <div className={`envelope ${phase}`}>
        <div className="envelope-body">
          <div className="envelope-front">
            <div className="envelope-seal">
              <span className="seal-icon">❦</span>
            </div>
            <p className="envelope-sod">— Save Our Date —</p>
            <p className="envelope-names">{groomShort} ❤ {brideShort}</p>
            <p className="envelope-date">{formattedDate}</p>
          </div>
          <div className={`envelope-flap ${phase !== 'idle' ? 'open' : ''}`}>
            <div className="flap-inner" />
          </div>
        </div>
        <div className={`card-peek ${phase === 'opening' || phase === 'done' ? 'rise' : ''}`}>
          <div className="card-peek-content">
            <span className="peek-flower">✿</span>
          </div>
        </div>
      </div>

      {phase === 'idle' && (
        <p className="tap-hint">Nhấn để mở thiệp</p>
      )}
      {phase === 'opening' && (
        <p className="tap-hint opening-text">Đang mở thiệp...</p>
      )}
    </div>
  )
}
