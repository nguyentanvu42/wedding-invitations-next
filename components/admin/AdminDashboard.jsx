'use client'
import { useRouter } from 'next/navigation'
import { Tabs, Button, Layout } from 'antd'
import { TeamOutlined, SettingOutlined, LogoutOutlined, EyeOutlined } from '@ant-design/icons'
import GuestListTab from './GuestListTab'
import WeddingSettingsTab from './WeddingSettingsTab'
import './AdminDashboard.css'

const { Header, Content } = Layout

export default function AdminDashboard() {
  const router = useRouter()

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth')
    router.push('/admin')
  }

  const tabItems = [
    {
      key: 'guests',
      label: (
        <span>
          <TeamOutlined />
          Khách Mời
        </span>
      ),
      children: <GuestListTab />,
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          Thông Tin Thiệp
        </span>
      ),
      children: <WeddingSettingsTab />,
    },
  ]

  return (
    <Layout className="admin-layout">
      <Header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-logo">💍</span>
          <h1 className="admin-title">Quản Lý Thiệp Cưới</h1>
        </div>
        <div className="admin-header-right">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open('/', '_blank')}
            className="admin-header-btn"
          >
            Xem thiệp
          </Button>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            className="admin-header-btn"
            danger
          >
            Đăng xuất
          </Button>
        </div>
      </Header>

      <Content className="admin-content">
        <Tabs
          defaultActiveKey="guests"
          items={tabItems}
          className="admin-tabs"
          size="large"
        />
      </Content>
    </Layout>
  )
}
