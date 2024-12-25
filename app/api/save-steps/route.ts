import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const steps = await request.json();
    const db = await getDb();
    const collection = db.collection('steps');
    await collection.deleteMany({});
    await collection.insertMany(steps);
    return NextResponse.json({ message: 'Steps saved successfully' });
  } catch (error) {
    console.error('Error saving steps:', error);
    return NextResponse.json({ error: 'Failed to save steps' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('steps');
    const steps = await collection.find({}).toArray();

    return NextResponse.json(steps);
  } catch (error) {
    console.error('Error reading steps:', error);
    return NextResponse.json({ error: 'Failed to read steps' }, { status: 500 });
  }
}
