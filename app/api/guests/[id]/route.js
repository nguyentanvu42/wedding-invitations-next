import { NextResponse } from 'next/server'
import { updateGuest, deleteGuest, getGuestById } from '@/lib/db'

export async function GET(_, { params }) {
  const guest = await getGuestById(params.id)
  if (!guest) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(guest)
}

export async function PUT(req, { params }) {
  try {
    const { name, group } = await req.json()
    const guest = await updateGuest(params.id, { name, groupName: group })
    return NextResponse.json(guest)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  try {
    await deleteGuest(params.id)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
