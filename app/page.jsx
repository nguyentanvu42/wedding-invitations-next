'use client'
import { Suspense } from 'react'
import InvitationPage from '@/components/invitation/InvitationPage'

export default function Page() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải...</div>}>
      <InvitationPage />
    </Suspense>
  )
}
