'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Form, Input, Button, message } from 'antd'
import { LockOutlined } from '@ant-design/icons'
import './AdminLogin.css'

export default function AdminLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = async ({ password }) => {
    setLoading(true)
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem('adminAuth', 'true')
      router.push('/admin/dashboard')
    } else {
      message.error('Mật khẩu không đúng!')
    }
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">💍</div>
          <h1 className="login-title">Quản Lý Thiệp Cưới</h1>
          <p className="login-sub">Đăng nhập để quản lý danh sách và thông tin</p>
        </div>

        <Form onFinish={handleLogin} layout="vertical" size="large">
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#c0392b' }} />}
              placeholder="Nhập mật khẩu quản trị"
              className="login-input"
            />
          </Form.Item>
          <Form.Item>
            <Button
              htmlType="submit"
              loading={loading}
              className="login-btn"
              block
            >
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>

        <p className="back-link">
          <Link href="/">← Xem thiệp cưới</Link>
        </p>
      </div>
    </div>
  )
}
