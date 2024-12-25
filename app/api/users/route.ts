import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

interface UserEntry {
  id: string;
  name: string;
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const db = await getDb();
    const collection = db.collection('users');

    const newUser: UserEntry = {
      id: uuidv4(),
      name,
    };

    await collection.insertOne(newUser);
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('users');
    const users = await collection.find({}).toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json({ error: 'Failed to read users' }, { status: 500 });
  }
}
