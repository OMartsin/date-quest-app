import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

interface ProgressEntry {
  userId: string;
  stepId: string;
  stepName: string;
  timestamp: number;
}

export async function POST(request: Request) {
  try {
    const { userId, stepId, stepName } = await request.json();
    const db = await getDb();
    const collection = db.collection('progress');

    const newProgress: ProgressEntry = {
      userId,
      stepId,
      stepName,
      timestamp: Date.now(),
    };

    await collection.insertOne(newProgress);
    return NextResponse.json({ message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('progress');
    const progress = await collection.find({}).toArray();

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error reading progress:', error);
    return NextResponse.json({ error: 'Failed to read progress' }, { status: 500 });
  }
}
