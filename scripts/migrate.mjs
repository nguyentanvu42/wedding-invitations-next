import { sql } from '@vercel/postgres'

async function migrate() {
  console.log('Creating tables...')

  await sql`
    CREATE TABLE IF NOT EXISTS guests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      group_name TEXT DEFAULT '',
      url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS wishes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      guest_id UUID,
      guest_name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `

  await sql`
    CREATE TABLE IF NOT EXISTS wedding_settings (
      id INT PRIMARY KEY DEFAULT 1,
      settings JSONB NOT NULL
    )
  `

  await sql`
    INSERT INTO wedding_settings (id, settings)
    VALUES (1, ${JSON.stringify({
      bride: {
        name: 'Nguyễn Thị Thu Hương',
        shortName: 'Thu Hương',
        label: 'Út nữ',
        fatherName: 'Nguyễn Quang Vinh',
        motherName: 'Huỳnh Thị Nở',
        address: 'Thôn Phụng Can, Xã Nam Ninh Hòa, Khánh Hòa',
      },
      groom: {
        name: 'Nguyễn Tấn Vũ',
        shortName: 'Tấn Vũ',
        label: 'Út nam',
        fatherName: 'Nguyễn Văn Sáu',
        motherName: 'Nguyễn Thị Hoa',
        address: '1/3A, Đường 26, Phường Phước Long, TP.HCM',
      },
      ceremony: {
        date: '2026-08-02',
        time: '09:00',
        address: '1/3A, Đường 26, Phường Phước Long, TP.HCM',
        note: 'Nhân Ngày 20 Tháng 06 Năm Bính Ngọ',
      },
      reception: {
        date: '2026-08-02',
        timeWelcome: '11:00',
        timeStart: '12:00',
        venueName: 'Nhà Hàng Tiệc Cưới Emi Forever',
        address: 'Số 1, Đường Công Lý, Thủ Đức, TP.HCM',
        note: 'Nhân Ngày 20 Tháng 06 Năm Bính Ngọ',
        mapUrl: 'https://www.google.com/maps/place/Nh%C3%A0+h%C3%A0ng+Emi+Forever/@10.8422842,106.7649855,17z',
      },
      coverPhotos: [
        '/slide/MAN_5353.jpg', '/slide/MAN_5405.jpg', '/slide/MAN_5418.jpg',
        '/slide/MAN_5482.jpg', '/slide/MAN_5522.jpg', '/slide/MAN_5567.jpg',
        '/slide/MAN_5608.jpg', '/slide/MAN_5627.jpg', '/slide/MAN_5642.jpg',
        '/slide/MAN_5669.jpg', '/slide/MAN_5743.jpg', '/slide/MAN_5889.jpg',
        '/slide/MAN_6016.jpg', '/slide/MAN_6085.jpg', '/slide/MAN_6125.jpg',
        '/slide/MAN_6149.jpg', '/slide/MAN_6157.jpg', '/slide/MAN_6168.jpg',
        '/slide/MAN_6229.jpg', '/slide/MAN_6265.jpg', '/slide/MAN_6277.jpg',
        '/slide/MAN_6289.jpg', '/slide/MAN_6356.jpg', '/slide/MAN_6476.jpg',
        '/slide/MAN_6493.jpg', '/slide/MAN_6499.jpg', '/slide/MAN_6527.jpg',
        '/slide/MAN_6542.jpg', '/slide/MAN_6621.jpg', '/slide/MAN_6654.jpg',
      ],
      photoAlbumUrl: 'https://drive.google.com/drive/folders/1FfvelmT9V5NlhdYV6SOAkqzdCIgqzN6L?usp=sharing',
    })}
    ON CONFLICT (id) DO NOTHING
  `

  console.log('✅ Migration complete!')
  process.exit(0)
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
