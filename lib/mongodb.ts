import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db('quest_date');
}

export default clientPromise;
