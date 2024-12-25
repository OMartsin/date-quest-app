'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Step {
  id: string
  name: string
  description: string
}

interface QuestProps {
  step: Step
  isLastStep: boolean
  userId: string
  onStepStart: (stepId: string) => void
}

export default function Quest({ step, isLastStep, userId, onStepStart }: QuestProps) {
  useEffect(() => {
    onStepStart(step.id)
    saveProgress(step.id, step.name)
  }, [step, onStepStart])

  const saveProgress = async (stepId: string, stepName: string) => {
    try {
      const response = await fetch('/api/save-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, stepId, stepName }),
      })
      if (!response.ok) {
        throw new Error('Failed to save progress')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{step.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{step.description}</p>
        {isLastStep ? (
          <p className="text-green-600 font-bold">Залишилося ще трохи, це точно останній крок</p>
        ) : (
          <p className="text-sm text-gray-500">Щоб перейти далі, проскануй qr-код наступного кроку. Або спробуй вгадати url, але дуже не рекомендую цього робити:)</p>
        )}
      </CardContent>
    </Card>
  )
}

