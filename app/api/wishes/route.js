import { NextResponse } from 'next/server'
import { getWishes, createWish } from '@/lib/db'

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
    const { guestId, guestName, message } = await req.json()
    const wish = await createWish({ guestId, guestName, message })
    return NextResponse.json(wish, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
