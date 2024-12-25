'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Step {
  id: string
  description: string
}

export default function AdminPage() {
  const [steps, setSteps] = useState<Step[]>([])
  const [newStep, setNewStep] = useState('')

  useEffect(() => {
    // In a real app, this would fetch steps from an API
    import('../../data/steps.json').then((data) => setSteps(data.default))
  }, [])

  const addStep = () => {
    if (newStep) {
      const newStepObj = {
        id: uuidv4(),
        description: newStep,
      }
      setSteps([...steps, newStepObj])
      setNewStep('')
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="mb-4">
        <Label htmlFor="new-step">New Step</Label>
        <Input
          id="new-step"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          placeholder="Enter step description"
        />
        <Button onClick={addStep} className="mt-2">Add Step</Button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Steps:</h2>
        {steps.map((step, index) => (
          <div key={step.id} className="mb-2">
            <p>{index + 1}. {step.description}</p>
            <p className="text-sm text-gray-500">QR Code URL: {`${window.location.origin}/quest/${step.id}`}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

