'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function UserRegistration() {
  const [name, setName] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ name }),
      })
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      const user = await response.json()
      localStorage.setItem('userId', user.id)
      router.push('/quest/' + user.id)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Реєстрація(а ти що думаєш, магія працює анонімно чи що)</h1>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="name">Твоє ім&#39;я?</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введіть ім&#39;я"
          required
        />
        <Button type="submit" className="mt-2">Почати подорож✨</Button>
      </form>
    </div>
  )
}

