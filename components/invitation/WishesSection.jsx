'use client'
import { useState, useEffect } from 'react'
import { Button, Input, Form, message } from 'antd'
import { useWedding } from '@/contexts/WeddingContext'
import './WishesSection.css'

const { TextArea } = Input

function formatTime(iso) {
  const d = new Date(iso)
  const pad = n => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())} · ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

function WishCard({ wish }) {
  return (
    <div className="wish-card">
      <div className="wish-header">
        <div className="wish-avatar">
          {(wish.guestName || '?').charAt(0).toUpperCase()}
        </div>
        <div className="wish-meta">
          <span className="wish-name">{wish.guestName}</span>
          <span className="wish-time">{formatTime(wish.createdAt)}</span>
        </div>
      </div>
      <p className="wish-message">{wish.message}</p>
    </div>
  )
}

export default function WishesSection({ guestId, guestName }) {
  const { wishes, addWish, loading } = useWedding()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSubmit = async (values) => {
    if (!values.message?.trim() || cooldown > 0) return
    const name = values.name?.trim() || guestName || 'Khách mời'
    setSubmitting(true)
    try {
      await addWish(guestId || null, name, values.message.trim())
      form.resetFields()
      message.success('Đã gửi lời chúc!')
      setCooldown(15)
    } catch (e) {
      if (e.retryAfter) setCooldown(e.retryAfter)
      message.error(e.message || 'Gửi lời chúc thất bại, vui lòng thử lại!')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return null

  return (
    <section className="wishes-section">
      <div className="wishes-header">
        <span className="wishes-flower">❧</span>
        <h2 className="wishes-title">Lời Chúc</h2>
        <span className="wishes-flower">❧</span>
      </div>
      <p className="wishes-sub">Gửi lời chúc mừng đến cô dâu chú rể</p>

      <div className="wish-form-wrap">
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          {!guestName && (
            <Form.Item name="name" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
              <Input
                placeholder="Tên của bạn"
                className="wish-input"
                size="large"
              />
            </Form.Item>
          )}
          <Form.Item name="message" rules={[{ required: true, message: 'Vui lòng nhập lời chúc' }]}>
            <TextArea
              placeholder="Gửi lời chúc mừng đến cô dâu chú rể..."
              className="wish-textarea"
              rows={3}
              maxLength={300}
              showCount
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={submitting}
              disabled={cooldown > 0}
              className="wish-submit-btn"
              block
            >
              {cooldown > 0 ? `Vui lòng đợi ${cooldown}s` : 'Gửi lời chúc 💌'}
            </Button>
          </Form.Item>
        </Form>
      </div>

      <div className="wishes-list">
        {wishes.length === 0 ? (
          <p className="no-wishes">Chưa có lời chúc nào. Hãy là người đầu tiên! 💕</p>
        ) : (
          wishes.map(wish => <WishCard key={wish.id} wish={wish} />)
        )}
      </div>
    </section>
  )
}
