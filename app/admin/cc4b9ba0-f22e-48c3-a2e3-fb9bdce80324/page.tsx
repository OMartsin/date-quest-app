'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Step {
  id: string
  name: string
  description: string
}

interface User {
  id: string
  name: string
}

interface ProgressEntry {
  userId: string
  stepId: string
  stepName: string
  timestamp: number
}

export default function AdminPage() {
  const [steps, setSteps] = useState<Step[]>([])
  const [newStep, setNewStep] = useState({ name: '', description: '' })
  const [editingStep, setEditingStep] = useState<Step | null>(null)
  const [progress, setProgress] = useState<ProgressEntry[]>([])
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    fetchSteps()
    fetchProgress()
    fetchUsers()
  }, [])

  const fetchSteps = async () => {
    try {
      const response = await fetch('/api/save-steps', {
        method: "GET",
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch steps')
      }
      const data = await response.json()
      setSteps(data)
    } catch (error) {
      console.error('Error fetching steps:', error)
    }
  }

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/save-progress',{
        method: "GET",
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch progress')
      }
      const data = await response.json()
      setProgress(data)
    } catch (error) {
      console.error('Error fetching progress:', error)
      setProgress([])
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users',{
        method: "GET",
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    }
  }

  const addStep = async () => {
    if (newStep.name && newStep.description) {
      const newStepObj = {
        id: uuidv4(),
        name: newStep.name,
        description: newStep.description,
      }
      const updatedSteps = [...steps, newStepObj]
      await saveSteps(updatedSteps)
      setNewStep({ name: '', description: '' })
    }
  }

  const editStep = (step: Step) => {
    setEditingStep(step)
  }

  const saveEdit = async () => {
    if (editingStep) {
      const updatedSteps = steps.map(s => s.id === editingStep.id ? editingStep : s)
      await saveSteps(updatedSteps)
      setEditingStep(null)
    }
  }

  const deleteStep = async (id: string) => {
    const updatedSteps = steps.filter(s => s.id !== id)
    await saveSteps(updatedSteps)
  }

  const saveSteps = async (updatedSteps: Step[]) => {
    try {
      const response = await fetch('/api/save-steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(updatedSteps),
      })
      if (!response.ok) {
        throw new Error('Failed to save steps')
      }
      setSteps(updatedSteps)
    } catch (error) {
      console.error('Error saving steps:', error)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="mb-4">
        <Label htmlFor="new-step-name">New Step Name</Label>
        <Input
          id="new-step-name"
          value={newStep.name}
          onChange={(e) => setNewStep({...newStep, name: e.target.value})}
          placeholder="Enter step name"
        />
        <Label htmlFor="new-step-description">New Step Description</Label>
        <Textarea
          id="new-step-description"
          value={newStep.description}
          onChange={(e) => setNewStep({...newStep, description: e.target.value})}
          placeholder="Enter step description"
        />
        <Button onClick={addStep} className="mt-2">Add Step</Button>
      </div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Steps:</h2>
        {steps.map((step, index) => (
          <div key={step.id} className="mb-4 p-4 border rounded">
            {editingStep && editingStep.id === step.id ? (
              <>
                <Input
                  value={editingStep.name}
                  onChange={(e) => setEditingStep({...editingStep, name: e.target.value})}
                  className="mb-2"
                />
                <Textarea
                  value={editingStep.description}
                  onChange={(e) => setEditingStep({...editingStep, description: e.target.value})}
                  className="mb-2"
                />
                <Button onClick={saveEdit} className="mr-2">Save</Button>
                <Button onClick={() => setEditingStep(null)} variant="outline">Cancel</Button>
              </>
            ) : (
              <>
                <p className="font-bold">{index + 1}. {step.name}</p>
                <p>{step.description}</p>
                <p className="text-sm text-gray-500">QR Code URL: {`${window.location.origin}/quest/${step.id}`}</p>
                <Button onClick={() => editStep(step)} className="mr-2 mt-2">Edit</Button>
                <Button onClick={() => deleteStep(step.id)} variant="destructive" className="mt-2">Delete</Button>
              </>
            )}
          </div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Progress History</CardTitle>
        </CardHeader>
        <CardContent>
          {progress.length > 0 ? (
            progress.map((entry, index) => {
              const user = users.find(u => u.id === entry.userId)
              return (
                <div key={index} className="mb-2">
                  <p>User: {user ? user.name : 'Unknown'}</p>
                  <p>Step: {entry.stepName}</p>
                  <p>Time: {new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              )
            })
          ) : (
            <p>No progress data available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

