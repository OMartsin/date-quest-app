import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

interface ProgressEntry {
  userId: string;
  stepId: string;
  stepName: string;
  timestamp: number;
}

export async function POST(request: Request) {
  try {
    const { userId, stepId, stepName } = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'progress.json')
    
    let progress: ProgressEntry[] = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      progress = JSON.parse(fileContent)
    } catch (error) {
      // File doesn't exist or is empty, start with an empty array
    }

    progress.push({
      userId,
      stepId,
      stepName,
      timestamp: Date.now()
    })

    await fs.writeFile(filePath, JSON.stringify(progress, null, 2))
    return NextResponse.json({ message: 'Progress saved successfully' })
  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'progress.json')
    let progress: ProgressEntry[] = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      progress = JSON.parse(fileContent)
    } catch (error) {
      // File doesn't exist or is empty, return an empty array
      console.log('No progress data found, returning empty array')
    }
    return NextResponse.json(progress)
  } catch (error) {
    console.error('Error reading progress:', error)
    return NextResponse.json({ error: 'Failed to read progress' }, { status: 500 })
  }
}

