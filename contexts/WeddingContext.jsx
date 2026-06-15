'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const WeddingContext = createContext()

export function WeddingProvider({ children }) {
  const [weddingInfo, setWeddingInfo] = useState(null)
  const [guests, setGuests] = useState([])
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const safeJson = (r) => r.ok ? r.json() : null
    Promise.all([
      fetch('/api/settings').then(safeJson).catch(() => null),
      fetch('/api/guests').then(safeJson).catch(() => []),
      fetch('/api/wishes').then(safeJson).catch(() => []),
    ]).then(([settings, guestList, wishesList]) => {
      setWeddingInfo(settings)
      setGuests(guestList ?? [])
      setWishes(wishesList ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const updateWeddingInfo = async (info) => {
    const updated = { ...weddingInfo, ...info }
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    })
    setWeddingInfo(updated)
  }

  const addGuest = async (name, group = '') => {
    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, group }),
    })
    const guest = await res.json()
    setGuests(prev => [...prev, guest])
    return guest
  }

  const addGuestsBulk = async (names) => {
    const res = await fetch('/api/guests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bulk: true, names }),
    })
    const newGuests = await res.json()
    setGuests(prev => [...prev, ...newGuests])
    return newGuests
  }

  const updateGuest = async (id, data) => {
    const res = await fetch(`/api/guests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const updated = await res.json()
    setGuests(prev => prev.map(g => g.id === id ? updated : g))
  }

  const deleteGuest = async (id) => {
    await fetch(`/api/guests/${id}`, { method: 'DELETE' })
    setGuests(prev => prev.filter(g => g.id !== id))
  }

  const addWish = async (guestId, guestName, message) => {
    const res = await fetch('/api/wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId, guestName, message }),
    })
    if (!res.ok) throw new Error('Failed to add wish')
    const wish = await res.json()
    setWishes(prev => [wish, ...prev])
    return wish
  }

  const getGuestById = useCallback(
    (id) => guests.find(g => g.id === id),
    [guests]
  )

  return (
    <WeddingContext.Provider value={{
      weddingInfo,
      updateWeddingInfo,
      guests,
      addGuest,
      addGuestsBulk,
      updateGuest,
      deleteGuest,
      wishes,
      addWish,
      getGuestById,
      loading,
    }}>
      {children}
    </WeddingContext.Provider>
  )
}

export const useWedding = () => useContext(WeddingContext)
