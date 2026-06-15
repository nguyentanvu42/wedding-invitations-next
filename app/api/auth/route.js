import { NextResponse } from 'next/server'

export async function POST(req) {
  const { password } = await req.json()
  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ error: 'Mật khẩu không đúng!' }, { status: 401 })
}
