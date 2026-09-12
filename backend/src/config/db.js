import mongoose from 'mongoose';
import { config } from './env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ [Database] Connection error: ${error.message}`);
    console.log('⚠️ Running in fallback mode. Ensure MongoDB is running locally or set MONGODB_URI');
  }
};
