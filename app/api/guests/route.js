import { NextResponse } from 'next/server'
import { getGuests, createGuest, createGuestsBulk } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const guests = await getGuests()
    return NextResponse.json(guests)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    if (body.bulk && Array.isArray(body.names)) {
      const guests = await createGuestsBulk(body.names)
      return NextResponse.json(guests, { status: 201 })
    }
    const guest = await createGuest({ name: body.name, groupName: body.group })
    return NextResponse.json(guest, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
