'use client'
import { useState } from 'react'
import { Form, Input, Button, DatePicker, TimePicker, Divider, message, Card, Collapse, Tag, Tooltip } from 'antd'
import { SaveOutlined, PlusOutlined, MinusCircleOutlined, LinkOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useWedding } from '@/contexts/WeddingContext'
import { toDirectImageUrl, isGoogleDriveUrl } from '@/utils/imageUtils'

export default function WeddingSettingsTab() {
  const { weddingInfo, updateWeddingInfo } = useWedding()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const initialValues = {
    brideName: weddingInfo.bride.name,
    brideLabel: weddingInfo.bride.label,
    brideFatherName: weddingInfo.bride.fatherName,
    brideMotherName: weddingInfo.bride.motherName,
    brideAddress: weddingInfo.bride.address,

    groomName: weddingInfo.groom.name,
    groomLabel: weddingInfo.groom.label,
    groomFatherName: weddingInfo.groom.fatherName,
    groomMotherName: weddingInfo.groom.motherName,
    groomAddress: weddingInfo.groom.address,

    ceremonyDate: dayjs(weddingInfo.ceremony.date),
    ceremonyTime: dayjs(weddingInfo.ceremony.time, 'HH:mm'),
    ceremonyAddress: weddingInfo.ceremony.address,
    ceremonyNote: weddingInfo.ceremony.note,

    receptionDate: dayjs(weddingInfo.reception.date),
    receptionTimeWelcome: dayjs(weddingInfo.reception.timeWelcome || '11:00', 'HH:mm'),
    receptionTimeStart: dayjs(weddingInfo.reception.timeStart || '11:30', 'HH:mm'),
    receptionVenueName: weddingInfo.reception.venueName,
    receptionAddress: weddingInfo.reception.address,
    receptionNote: weddingInfo.reception.note,

    photoAlbumUrl: weddingInfo.photoAlbumUrl,
    coverPhotos: weddingInfo.coverPhotos || [],
  }

  const handleSave = async (values) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 300))

    updateWeddingInfo({
      bride: {
        name: values.brideName,
        label: values.brideLabel,
        fatherName: values.brideFatherName,
        motherName: values.brideMotherName,
        address: values.brideAddress,
      },
      groom: {
        name: values.groomName,
        label: values.groomLabel,
        fatherName: values.groomFatherName,
        motherName: values.groomMotherName,
        address: values.groomAddress,
      },
      ceremony: {
        date: values.ceremonyDate.format('YYYY-MM-DD'),
        time: values.ceremonyTime.format('HH:mm'),
        address: values.ceremonyAddress,
        note: values.ceremonyNote,
      },
      reception: {
        date: values.receptionDate.format('YYYY-MM-DD'),
        timeWelcome: values.receptionTimeWelcome.format('HH:mm'),
        timeStart: values.receptionTimeStart.format('HH:mm'),
        venueName: values.receptionVenueName,
        address: values.receptionAddress,
        note: values.receptionNote,
        mapUrl: weddingInfo.reception.mapUrl,
      },
      photoAlbumUrl: values.photoAlbumUrl,
      coverPhotos: (values.coverPhotos || [])
        .map(p => p?.url || p)
        .filter(Boolean)
        .map(toDirectImageUrl),
    })

    setSaving(false)
    message.success('Đã lưu thông tin thiệp cưới!')
  }

  const colStyle = { background: '#fff8f8', borderRadius: 8, marginBottom: 12 }

  return (
    <div style={{ maxWidth: 640, padding: '1rem 0' }}>
      <Form
        form={form}
        initialValues={initialValues}
        onFinish={handleSave}
        layout="vertical"
        size="middle"
      >
        <Collapse
          defaultActiveKey={['bride', 'groom', 'ceremony', 'reception', 'photos']}
          ghost
          style={{ marginBottom: 16 }}
          items={[
            {
              key: 'bride',
              label: <strong style={{ color: '#8b1a2d' }}>🌸 Thông tin Cô Dâu</strong>,
              style: colStyle,
              children: (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                    <Form.Item label="Tên cô dâu" name="brideName" rules={[{ required: true }]}>
                      <Input placeholder="Nguyễn Thị Cô Dâu" />
                    </Form.Item>
                    <Form.Item label="Vai trong gia đình" name="brideLabel">
                      <Input placeholder="Út nữ" />
                    </Form.Item>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <Form.Item label="Tên cha" name="brideFatherName" rules={[{ required: true }]}>
                      <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>
                    <Form.Item label="Tên mẹ" name="brideMotherName" rules={[{ required: true }]}>
                      <Input placeholder="Nguyễn Thị B" />
                    </Form.Item>
                  </div>
                  <Form.Item label="Địa chỉ gia đình cô dâu" name="brideAddress">
                    <Input placeholder="Thôn X, Xã Y, Tỉnh Z" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'groom',
              label: <strong style={{ color: '#8b1a2d' }}>💍 Thông tin Chú Rể</strong>,
              style: colStyle,
              children: (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                    <Form.Item label="Tên chú rể" name="groomName" rules={[{ required: true }]}>
                      <Input placeholder="Trần Văn Chú Rể" />
                    </Form.Item>
                    <Form.Item label="Vai trong gia đình" name="groomLabel">
                      <Input placeholder="Trưởng nam" />
                    </Form.Item>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <Form.Item label="Tên cha" name="groomFatherName" rules={[{ required: true }]}>
                      <Input placeholder="Trần Văn C" />
                    </Form.Item>
                    <Form.Item label="Tên mẹ" name="groomMotherName" rules={[{ required: true }]}>
                      <Input placeholder="Trần Thị D" />
                    </Form.Item>
                  </div>
                  <Form.Item label="Địa chỉ gia đình chú rể" name="groomAddress">
                    <Input placeholder="Thôn X, Xã Y, Tỉnh Z" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'ceremony',
              label: <strong style={{ color: '#8b1a2d' }}>🏠 Lễ Gia Tiên</strong>,
              style: colStyle,
              children: (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <Form.Item label="Ngày" name="ceremonyDate" rules={[{ required: true }]}>
                      <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                    </Form.Item>
                    <Form.Item label="Giờ" name="ceremonyTime" rules={[{ required: true }]}>
                      <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
                    </Form.Item>
                  </div>
                  <Form.Item label="Địa chỉ tổ chức lễ" name="ceremonyAddress" rules={[{ required: true }]}>
                    <Input placeholder="Tại tư gia - Số X, Đường Y, Quận Z" />
                  </Form.Item>
                  <Form.Item label="Ghi chú (ngày âm lịch...)" name="ceremonyNote">
                    <Input placeholder="Nhân Ngày 17 Tháng 09 Năm Giáp Thìn" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'reception',
              label: <strong style={{ color: '#8b1a2d' }}>🍽 Tiệc Cưới (Nhà Hàng)</strong>,
              style: colStyle,
              children: (
                <>
                  <Form.Item label="Ngày" name="receptionDate" rules={[{ required: true }]}>
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <Form.Item label="Giờ đón khách" name="receptionTimeWelcome" rules={[{ required: true }]}>
                      <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
                    </Form.Item>
                    <Form.Item label="Giờ khai tiệc" name="receptionTimeStart" rules={[{ required: true }]}>
                      <TimePicker style={{ width: '100%' }} format="HH:mm" minuteStep={15} />
                    </Form.Item>
                  </div>
                  <Form.Item label="Tên nhà hàng / địa điểm" name="receptionVenueName">
                    <Input placeholder="Nhà Hàng Tiệc Cưới Grand Palace" />
                  </Form.Item>
                  <Form.Item label="Địa chỉ nhà hàng" name="receptionAddress" rules={[{ required: true }]}>
                    <Input placeholder="Số X, Đường Y, Quận Z, TP.HCM" />
                  </Form.Item>
                  <Form.Item label="Ghi chú (ngày âm lịch...)" name="receptionNote">
                    <Input placeholder="Nhân Ngày 17 Tháng 09 Năm Giáp Thìn" />
                  </Form.Item>
                </>
              ),
            },
            {
              key: 'photos',
              label: <strong style={{ color: '#8b1a2d' }}>📸 Ảnh Cưới</strong>,
              style: colStyle,
              children: (
                <>
                  <div style={{ background: '#f0f8ff', border: '1px solid #b8d8f0', borderRadius: 6, padding: '10px 12px', marginBottom: 12, fontSize: 12, color: '#555' }}>
                    <strong>📌 Cách lấy link ảnh từ Google Drive:</strong>
                    <ol style={{ margin: '6px 0 0', paddingLeft: 16, lineHeight: 1.8 }}>
                      <li>Mở ảnh trong Google Drive → nhấn chuột phải → <em>Chia sẻ</em></li>
                      <li>Chọn <em>Bất kỳ ai có đường liên kết</em> → sao chép link</li>
                      <li>Dán link vào ô bên dưới — hệ thống tự chuyển đổi để hiện slideshow</li>
                    </ol>
                  </div>

                  <Form.Item label="Link ảnh slideshow (chấp nhận link Google Drive)">
                    <Form.List name="coverPhotos">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name }) => {
                            const currentUrl = form.getFieldValue(['coverPhotos', name, 'url']) || ''
                            const isDrive = isGoogleDriveUrl(currentUrl)
                            const previewUrl = currentUrl ? toDirectImageUrl(currentUrl) : null
                            return (
                              <div key={key} style={{ marginBottom: 12 }}>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                  <Form.Item name={[name, 'url']} noStyle>
                                    <Input
                                      placeholder="https://drive.google.com/file/d/... hoặc link ảnh trực tiếp"
                                      prefix={<LinkOutlined style={{ color: '#ccc' }} />}
                                      suffix={isDrive ? <Tag color="blue" style={{ marginRight: 0 }}>Drive ✓</Tag> : null}
                                      style={{ flex: 1 }}
                                    />
                                  </Form.Item>
                                  <Button
                                    type="text"
                                    danger
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => remove(name)}
                                  />
                                </div>
                                {previewUrl && (
                                  <div style={{ marginTop: 6, marginLeft: 2 }}>
                                    <img
                                      src={previewUrl}
                                      alt="preview"
                                      referrerPolicy="no-referrer"
                                      style={{ height: 60, width: 90, objectFit: 'cover', borderRadius: 4, border: '1px solid #e8c8c8', background: '#f5f5f5' }}
                                      onError={e => { e.currentTarget.style.display = 'none' }}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                          <Button
                            type="dashed"
                            onClick={() => add({ url: '' })}
                            icon={<PlusOutlined />}
                            style={{ width: '100%' }}
                          >
                            Thêm ảnh
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Form.Item>

                  <Form.Item label="Link album Google Drive (tuỳ chọn)" name="photoAlbumUrl">
                    <Input placeholder="https://drive.google.com/drive/folders/..." />
                  </Form.Item>
                </>
              ),
            },
          ]}
        />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            icon={<SaveOutlined />}
            size="large"
            style={{ background: '#8b1a2d', borderColor: '#8b1a2d', borderRadius: 8 }}
          >
            Lưu thông tin thiệp
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
