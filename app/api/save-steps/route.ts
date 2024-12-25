import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const steps = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'steps.json')
    await fs.writeFile(filePath, JSON.stringify(steps, null, 2))
    return NextResponse.json({ message: 'Steps saved successfully' })
  } catch (error) {
    console.error('Error saving steps:', error)
    return NextResponse.json({ error: 'Failed to save steps' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'steps.json')
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const steps = JSON.parse(fileContent)
    return NextResponse.json(steps)
  } catch (error) {
    console.error('Error reading steps:', error)
    return NextResponse.json({ error: 'Failed to read steps' }, { status: 500 })
  }
}

