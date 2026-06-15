'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth') === 'true'
    setIsAuth(auth)
    setChecked(true)
    if (!auth) router.replace('/admin')
  }, [router])

  if (!checked) return null
  if (!isAuth) return null
  return children
}
