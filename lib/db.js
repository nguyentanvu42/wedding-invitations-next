import pkg from 'pg'
const { Pool } = pkg

// Supabase uses self-signed cert in chain — disable verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

let pool

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false },
    })
  }
  return pool
}

// ── GUESTS ─────────────────────────────────────────────────
export async function getGuests() {
  const { rows } = await getPool().query(
    'SELECT * FROM guests ORDER BY created_at ASC'
  )
  return rows.map(mapGuest)
}

export async function createGuest({ name, groupName = '' }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const { rows } = await getPool().query(
    `INSERT INTO guests (name, group_name, url)
     VALUES ($1, $2, '')
     RETURNING *`,
    [name, groupName]
  )
  const guest = rows[0]
  const url = `${baseUrl}/?id=${guest.id}`
  await getPool().query('UPDATE guests SET url = $1 WHERE id = $2', [url, guest.id])
  guest.url = url
  return mapGuest(guest)
}

export async function createGuestsBulk(names) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const results = []
  for (const name of names) {
    const { rows } = await getPool().query(
      `INSERT INTO guests (name, group_name, url)
       VALUES ($1, '', '')
       RETURNING *`,
      [name.trim()]
    )
    const guest = rows[0]
    const url = `${baseUrl}/?id=${guest.id}`
    await getPool().query('UPDATE guests SET url = $1 WHERE id = $2', [url, guest.id])
    guest.url = url
    results.push(mapGuest(guest))
  }
  return results
}

export async function updateGuest(id, { name, groupName }) {
  const { rows } = await getPool().query(
    'UPDATE guests SET name = $1, group_name = $2 WHERE id = $3 RETURNING *',
    [name, groupName, id]
  )
  return mapGuest(rows[0])
}

export async function deleteGuest(id) {
  await getPool().query('DELETE FROM guests WHERE id = $1', [id])
}

export async function getGuestById(id) {
  const { rows } = await getPool().query('SELECT * FROM guests WHERE id = $1', [id])
  return rows[0] ? mapGuest(rows[0]) : null
}

function mapGuest(g) {
  return {
    id: g.id,
    name: g.name,
    group: g.group_name,
    url: g.url,
    createdAt: g.created_at,
  }
}

// ── WISHES ─────────────────────────────────────────────────
export async function getWishes() {
  const { rows } = await getPool().query(
    'SELECT * FROM wishes ORDER BY created_at DESC'
  )
  return rows.map(w => ({
    id: w.id,
    guestId: w.guest_id,
    guestName: w.guest_name,
    message: w.message,
    createdAt: w.created_at,
  }))
}

export async function createWish({ guestId, guestName, message }) {
  const { rows } = await getPool().query(
    `INSERT INTO wishes (guest_id, guest_name, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [guestId, guestName, message]
  )
  const w = rows[0]
  return {
    id: w.id,
    guestId: w.guest_id,
    guestName: w.guest_name,
    message: w.message,
    createdAt: w.created_at,
  }
}

// ── WEDDING SETTINGS ───────────────────────────────────────
export async function getWeddingSettings() {
  const { rows } = await getPool().query(
    'SELECT settings FROM wedding_settings WHERE id = 1'
  )
  return rows[0]?.settings
}

export async function updateWeddingSettings(settings) {
  await getPool().query(
    'UPDATE wedding_settings SET settings = $1::jsonb WHERE id = 1',
    [JSON.stringify(settings)]
  )
}
