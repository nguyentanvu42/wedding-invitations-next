'use client'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { useWedding } from '@/contexts/WeddingContext'
import './InvitationCard.css'

dayjs.locale('vi')

const WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']

function FloralHeader() {
  return (
    <div className="floral-header">
      <div className="floral-row top">
        <span className="flower f1">✿</span>
        <span className="flower f2">❀</span>
        <span className="flower f3">✾</span>
        <span className="flower f2">❀</span>
        <span className="flower f1">✿</span>
      </div>
      <div className="floral-vine">❧ ── ── ──❦── ── ── ❧</div>
    </div>
  )
}

function FloralFooter() {
  return (
    <div className="floral-footer">
      <div className="floral-vine">❧ ── ── ──❦── ── ── ❧</div>
      <div className="floral-row bottom">
        <span className="flower f1">✿</span>
        <span className="flower f2">❀</span>
        <span className="flower f3">✾</span>
        <span className="flower f2">❀</span>
        <span className="flower f1">✿</span>
      </div>
    </div>
  )
}

function EventBlock({ title, date, time, timeWelcome, timeStart, venueName, address, note, mapUrl }) {
  const d = dayjs(date)
  const weekday = WEEKDAYS[d.day()]

  return (
    <div className="event-block">
      <div className="event-title">{title}</div>
      {timeWelcome && timeStart ? (
        <div className="event-time-two">
          <div className="time-row">
            <span className="time-label">Đón khách lúc</span>
            <span className="time-value">{timeWelcome}</span>
          </div>
          <div className="time-row">
            <span className="time-label">Khai tiệc lúc</span>
            <span className="time-value">{timeStart}</span>
          </div>
          <div className="event-weekday">{weekday}</div>
        </div>
      ) : (
        <div className="event-time-row">
          <span className="event-time">Vào lúc {time}</span>
          <span className="event-dot">·</span>
          <span className="event-weekday">{weekday}</span>
        </div>
      )}
      <div className="event-date">
        <span className="date-day">{d.format('DD')}</span>
        <span className="date-sep"> tháng </span>
        <span className="date-month">{d.format('MM')}</span>
        <span className="date-sep"> năm </span>
        <span className="date-year">{d.format('YYYY')}</span>
      </div>
      {note && <div className="event-lunar">({note})</div>}
      {venueName && <div className="event-venue">{venueName}</div>}
      <div className="event-address">{address}</div>
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="map-link"
        >
          <span className="map-pin">📍</span>
          <span>Xem bản đồ</span>
        </a>
      )}
    </div>
  )
}

export default function InvitationCard({ guestName, visible }) {
  const { weddingInfo, loading } = useWedding()

  if (loading || !weddingInfo) return null

  const { bride, groom, ceremony, reception } = weddingInfo

  return (
    <div className={`invitation-card ${visible ? 'visible' : ''}`}>
      <div className="card-inner">
        <FloralHeader />

        <div className="invite-header">
          <p className="invite-formal">Trân Trọng Kính Mời</p>
          {guestName && (
            <div className="guest-section">
              <p className="guest-label">Quý Vị:</p>
              <p className="guest-name">{guestName}</p>
            </div>
          )}
          {!guestName && (
            <p className="invite-sub">Đến dự buổi tiệc chung vui cùng gia đình</p>
          )}
        </div>

        <hr className="section-divider" />

        <div className="families-section">
          <div className="family-col">
            <div className="family-title">Nhà Trai</div>
            <div className="family-parents">
              <p>Ông: <strong>{groom.fatherName}</strong></p>
              <p>Bà: <strong>{groom.motherName}</strong></p>
            </div>
            <p className="family-address">{groom.address}</p>
          </div>
          <div className="family-divider">
            <span className="heart-icon">❤</span>
          </div>
          <div className="family-col">
            <div className="family-title">Nhà Gái</div>
            <div className="family-parents">
              <p>Ông: <strong>{bride.fatherName}</strong></p>
              <p>Bà: <strong>{bride.motherName}</strong></p>
            </div>
            <p className="family-address">{bride.address}</p>
          </div>
        </div>

        <div className="announcement-text">
          <p>Trân trọng báo tin lễ thành hôn của con chúng tôi</p>
        </div>

        <div className="couple-names">
          <div className="groom-name">
            <span className="name-label">{groom.label}</span>
            <span className="name-script">{groom.name}</span>
          </div>
          <div className="heart-divider">
            <span className="big-heart">❤</span>
          </div>
          <div className="bride-name">
            <span className="name-script">{bride.name}</span>
            <span className="name-label">{bride.label}</span>
          </div>
        </div>

        <hr className="section-divider" />

        <EventBlock
          title="LỄ GIA TIÊN"
          date={ceremony.date}
          time={ceremony.time}
          address={ceremony.address}
          note={ceremony.note}
        />

        <div className="events-separator">✦</div>

        <EventBlock
          title="TIỆC CƯỚI"
          date={reception.date}
          timeWelcome={reception.timeWelcome}
          timeStart={reception.timeStart}
          time={reception.time}
          venueName={reception.venueName}
          address={reception.address}
          note={reception.note}
          mapUrl={reception.mapUrl}
        />

        <hr className="section-divider" />

        <div className="closing-text">
          <p>Sự hiện diện của Quý Khách</p>
          <p>là niềm vinh hạnh của gia đình chúng tôi!</p>
        </div>

        <FloralFooter />
      </div>
    </div>
  )
}
