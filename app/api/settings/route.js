import { NextResponse } from 'next/server'
import { getWeddingSettings, updateWeddingSettings } from '@/lib/db'

export async function GET() {
  try {
    const settings = await getWeddingSettings()
    return NextResponse.json(settings)
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const settings = await req.json()
    await updateWeddingSettings(settings)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
