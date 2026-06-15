import { sql } from '@vercel/postgres'

// ── GUESTS ─────────────────────────────────────────────────
export async function getGuests() {
  const { rows } = await sql`
    SELECT * FROM guests ORDER BY created_at ASC
  `
  return rows.map(mapGuest)
}

export async function createGuest({ name, groupName = '' }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const { rows } = await sql`
    INSERT INTO guests (name, group_name, url)
    VALUES (${name}, ${groupName}, CONCAT(${baseUrl}, '/?id=', gen_random_uuid()::text))
    RETURNING *
  `
  const guest = rows[0]
  await sql`
    UPDATE guests SET url = ${`${baseUrl}/?id=${guest.id}`} WHERE id = ${guest.id}
  `
  guest.url = `${baseUrl}/?id=${guest.id}`
  return mapGuest(guest)
}

export async function createGuestsBulk(names) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  const results = []
  for (const name of names) {
    const { rows } = await sql`
      INSERT INTO guests (name, group_name, url)
      VALUES (${name.trim()}, '', '')
      RETURNING *
    `
    const guest = rows[0]
    const url = `${baseUrl}/?id=${guest.id}`
    await sql`UPDATE guests SET url = ${url} WHERE id = ${guest.id}`
    guest.url = url
    results.push(mapGuest(guest))
  }
  return results
}

export async function updateGuest(id, { name, groupName }) {
  const { rows } = await sql`
    UPDATE guests SET name = ${name}, group_name = ${groupName}
    WHERE id = ${id} RETURNING *
  `
  return mapGuest(rows[0])
}

export async function deleteGuest(id) {
  await sql`DELETE FROM guests WHERE id = ${id}`
}

export async function getGuestById(id) {
  const { rows } = await sql`SELECT * FROM guests WHERE id = ${id}`
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
  const { rows } = await sql`
    SELECT * FROM wishes ORDER BY created_at DESC
  `
  return rows.map(w => ({
    id: w.id,
    guestId: w.guest_id,
    guestName: w.guest_name,
    message: w.message,
    createdAt: w.created_at,
  }))
}

export async function createWish({ guestId, guestName, message }) {
  const { rows } = await sql`
    INSERT INTO wishes (guest_id, guest_name, message)
    VALUES (${guestId}, ${guestName}, ${message})
    RETURNING *
  `
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
  const { rows } = await sql`
    SELECT settings FROM wedding_settings WHERE id = 1
  `
  return rows[0]?.settings
}

export async function updateWeddingSettings(settings) {
  await sql`
    UPDATE wedding_settings SET settings = ${JSON.stringify(settings)}::jsonb
    WHERE id = 1
  `
}
