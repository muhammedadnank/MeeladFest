import mongoose from 'mongoose';

// Import all models to ensure Mongoose schemas are registered for serverless populate queries
import '@/models/Fest';
import '@/models/Category';
import '@/models/Team';
import '@/models/Item';
import '@/models/Participant';
import '@/models/GroupEntry';
import '@/models/Result';
import '@/models/Program';
import '@/models/Update';
import '@/models/Faq';
import '@/models/Gallery';
import '@/models/Feedback';
import '@/models/ActivityLog';
import '@/models/FestAdmin';
import '@/models/PasswordReset';
import '@/models/RateLimit';
import '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meeladfest';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections growing exponentially during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;
