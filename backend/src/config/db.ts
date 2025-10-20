import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.MONGODB_URI || !env.MONGODB_DB) {
    throw new Error('Faltan MONGODB_URI o MONGODB_DB en .env');
  }
  await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB });
  console.log(`[db] connected to ${env.MONGODB_DB}`);
}
