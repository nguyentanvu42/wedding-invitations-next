import { NextResponse } from 'next/server'
import { getWishes, createWish, countRecentWishes } from '@/lib/db'

export const revalidate = 30

const RATE_SHORT = { window: 60, max: 3 }
const RATE_LONG = { window: 3600, max: 10 }

function getClientIp(req) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || null
}

function validateWish({ guestName, message }) {
  if (typeof message !== 'string' || !message.trim()) return 'Vui lòng nhập lời chúc.'
  if (message.trim().length > 300) return 'Lời chúc không được quá 300 ký tự.'
  if (guestName != null && typeof guestName === 'string' && guestName.trim().length > 100) return 'Tên không được quá 100 ký tự.'
  return null
}

function rateLimited(retryAfter) {
  return NextResponse.json(
    {
      error: 'rate_limited',
      message: 'Bạn gửi lời chúc quá nhanh. Vui lòng thử lại sau giây lát.',
      retryAfter,
    },
    { status: 429, headers: { 'Retry-After': String(retryAfter) } }
  )
}

export async function GET() {
  try {
    const wishes = await getWishes()
    return NextResponse.json(wishes)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

    const { guestId = null, guestName, message } = body

    const validationError = validateWish({ guestName, message })
    if (validationError) return NextResponse.json({ error: validationError }, { status: 400 })

    const ip = getClientIp(req)
    const id = guestId || null

    if (await countRecentWishes({ guestId: id, ip, seconds: RATE_SHORT.window }) >= RATE_SHORT.max)
      return rateLimited(RATE_SHORT.window)
    if (await countRecentWishes({ guestId: id, ip, seconds: RATE_LONG.window }) >= RATE_LONG.max)
      return rateLimited(RATE_LONG.window)

    const name = (typeof guestName === 'string' && guestName.trim()) || 'Khách mời'
    const wish = await createWish({ guestId: id, guestName: name, message: message.trim(), ip })
    return NextResponse.json(wish, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
