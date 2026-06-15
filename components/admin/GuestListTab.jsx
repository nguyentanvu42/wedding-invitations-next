'use client'
import { useState } from 'react'
import {
  Table, Button, Input, Modal, Form, Space, Tooltip, Tag, message, Popconfirm
} from 'antd'
import {
  PlusOutlined, CopyOutlined, DeleteOutlined, EditOutlined,
  SearchOutlined, ImportOutlined
} from '@ant-design/icons'
import { useWedding } from '@/contexts/WeddingContext'

const { TextArea } = Input

export default function GuestListTab() {
  const { guests, addGuest, addGuestsBulk, updateGuest, deleteGuest } = useWedding()
  const [search, setSearch] = useState('')
  const [addModal, setAddModal] = useState(false)
  const [bulkModal, setBulkModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [bulkForm] = Form.useForm()

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.group && g.group.toLowerCase().includes(search.toLowerCase()))
  )

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url)
    message.success('Đã sao chép link!')
  }

  const handleAdd = (values) => {
    addGuest(values.name.trim(), values.group?.trim() || '')
    addForm.resetFields()
    setAddModal(false)
    message.success('Đã thêm khách mời!')
  }

  const handleEdit = (values) => {
    updateGuest(editModal.id, { name: values.name.trim(), group: values.group?.trim() || '' })
    setEditModal(null)
    message.success('Đã cập nhật!')
  }

  const handleBulkAdd = (values) => {
    const names = values.names.split('\n').map(n => n.trim()).filter(Boolean)
    if (names.length === 0) return
    addGuestsBulk(names)
    bulkForm.resetFields()
    setBulkModal(false)
    message.success(`Đã thêm ${names.length} khách mời!`)
  }

  const openEdit = (guest) => {
    setEditModal(guest)
    editForm.setFieldsValue({ name: guest.name, group: guest.group })
  }

  const columns = [
    {
      title: 'Tên Khách Mời',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <strong>{name}</strong>,
    },
    {
      title: 'Nhóm',
      dataIndex: 'group',
      key: 'group',
      render: (group) => group ? <Tag color="pink">{group}</Tag> : <span style={{ color: '#ccc' }}>—</span>,
      width: 120,
    },
    {
      title: 'Link Thiệp',
      dataIndex: 'url',
      key: 'url',
      render: (url) => (
        <Space>
          <span style={{ fontSize: 12, color: '#888', maxWidth: 160, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {url}
          </span>
          <Tooltip title="Sao chép link">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined />}
              onClick={() => copyUrl(url)}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 80,
      render: (_, guest) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(guest)}
            />
          </Tooltip>
          <Popconfirm
            title="Xóa khách mời này?"
            onConfirm={() => {
              deleteGuest(guest.id)
              message.success('Đã xóa!')
            }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Xóa">
              <Button type="text" size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '1rem 0' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm theo tên hoặc nhóm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setAddModal(true)}
          style={{ background: '#8b1a2d', borderColor: '#8b1a2d' }}
        >
          Thêm khách
        </Button>
        <Button
          icon={<ImportOutlined />}
          onClick={() => setBulkModal(true)}
        >
          Nhập nhiều
        </Button>
      </div>

      <div style={{ marginBottom: 8, color: '#888', fontSize: 13 }}>
        Tổng: <strong>{guests.length}</strong> khách mời
        {search && ` · Lọc: ${filtered.length}`}
      </div>

      <Table
        dataSource={filtered}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 20, showSizeChanger: false }}
        scroll={{ x: 500 }}
        locale={{ emptyText: 'Chưa có khách mời nào' }}
      />

      <Modal
        title="Thêm khách mời"
        open={addModal}
        onCancel={() => { setAddModal(false); addForm.resetFields() }}
        footer={null}
      >
        <Form form={addForm} onFinish={handleAdd} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Tên khách mời" name="name" rules={[{ required: true, message: 'Nhập tên khách mời' }]}>
            <Input placeholder="VD: Nguyễn Văn A" />
          </Form.Item>
          <Form.Item label="Nhóm (tuỳ chọn)" name="group">
            <Input placeholder="VD: Nhà trai, Bạn bè cô dâu..." />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" style={{ background: '#8b1a2d', borderColor: '#8b1a2d' }}>
                Thêm
              </Button>
              <Button onClick={() => { setAddModal(false); addForm.resetFields() }}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chỉnh sửa khách mời"
        open={!!editModal}
        onCancel={() => setEditModal(null)}
        footer={null}
      >
        <Form form={editForm} onFinish={handleEdit} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item label="Tên khách mời" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nhóm" name="group">
            <Input />
          </Form.Item>
          {editModal && (
            <div style={{ marginBottom: 12, fontSize: 12, color: '#888' }}>
              <strong>Link thiệp:</strong>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
                <code style={{ fontSize: 11, background: '#f5f5f5', padding: '2px 6px', borderRadius: 4, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {editModal.url}
                </code>
                <Button size="small" icon={<CopyOutlined />} onClick={() => copyUrl(editModal.url)} />
              </div>
            </div>
          )}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" style={{ background: '#8b1a2d', borderColor: '#8b1a2d' }}>
                Lưu
              </Button>
              <Button onClick={() => setEditModal(null)}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Nhập nhiều khách mời"
        open={bulkModal}
        onCancel={() => { setBulkModal(false); bulkForm.resetFields() }}
        footer={null}
      >
        <Form form={bulkForm} onFinish={handleBulkAdd} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Danh sách tên (mỗi tên một dòng)"
            name="names"
            rules={[{ required: true, message: 'Nhập ít nhất 1 tên' }]}
          >
            <TextArea
              rows={8}
              placeholder="Nguyễn Văn A&#10;Trần Thị B&#10;Lê Văn C&#10;..."
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" style={{ background: '#8b1a2d', borderColor: '#8b1a2d' }}>
                Nhập danh sách
              </Button>
              <Button onClick={() => { setBulkModal(false); bulkForm.resetFields() }}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
