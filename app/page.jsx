'use client'
import { Suspense } from 'react'
import InvitationPage from '@/components/invitation/InvitationPage'
import LoadingScreen from '@/components/invitation/LoadingScreen'

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <InvitationPage />
    </Suspense>
  )
}
