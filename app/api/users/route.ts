import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: Request) {
  try {
    const { name } = await request.json()
    const filePath = path.join(process.cwd(), 'data', 'users.json')
    
    let users = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      users = JSON.parse(fileContent)
    } catch (error) {
      // File doesn't exist or is empty, start with an empty array
    }

    const newUser = {
      id: uuidv4(),
      name
    }
    users.push(newUser)

    await fs.writeFile(filePath, JSON.stringify(users, null, 2))
    return NextResponse.json(newUser)
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'users.json')
    let users = []
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8')
      users = JSON.parse(fileContent)
    } catch (error) {
      // File doesn't exist or is empty, return an empty array
      console.log('No users found, returning empty array')
    }
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error reading users:', error)
    return NextResponse.json({ error: 'Failed to read users' }, { status: 500 })
  }
}

