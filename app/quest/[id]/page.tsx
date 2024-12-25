'use client'

import {useState, useEffect, useCallback, use} from 'react'
import { useRouter } from 'next/navigation'
import Quest from '@/components/Quest'

interface Step {
  id: string
  name: string
  description: string
}

type Params = Promise<{ id: string }>

export default function QuestPage(props: { params: Params }) {
  const params = use(props.params);
  const [step, setStep] = useState<Step | null>(null)
  const [isLastStep, setIsLastStep] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  const fetchStep = useCallback(async () => {
    try {
      const response = await fetch('/api/save-steps')
      if (!response.ok) {
        throw new Error('Failed to fetch steps')
      }
      const steps: Step[] = await response.json()
      const currentStepIndex = steps.findIndex(s => s.id === params.id)
      if (currentStepIndex !== -1) {
        setStep(steps[currentStepIndex])
        setIsLastStep(currentStepIndex === steps.length - 1)
      } else {
        router.push('/quest/' + steps[0].id)
      }
    } catch (error) {
      console.error('Error fetching step:', error)
    } finally {
      setLoading(false)
    }
  }, [params.id, router])

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    if (!storedUserId) {
      router.push('/user-registration')
    } else {
      setUserId(storedUserId)
      fetchStep()
    }
  }, [fetchStep, router])

  const onStepStart = async (id: string) => {
    console.log(`User ${userId} started step ${id}`)
  }

  if (loading) {
    return <div className="p-4">Loading quest step...</div>
  }

  if (!step || !userId) {
    return <div className="p-4">Step not found or user not identified.</div>
  }

  return (
      <div className="p-4">
        <Quest step={step} isLastStep={isLastStep} userId={userId} onStepStart={onStepStart} />
      </div>
  )
}