import connectDB from '@/lib/db';
import RateLimit from '@/models/RateLimit';

export async function checkRateLimit(
  ip: string,
  endpoint: string,
  maxRequests: number = 30,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  await connectDB();

  const now = new Date();
  const resetAt = new Date(now.getTime() + windowSeconds * 1000);

  const limitDoc = await RateLimit.findOneAndUpdate(
    { ip, endpoint },
    {
      $setOnInsert: { ip, endpoint, resetAt },
      $inc: { count: 1 },
    },
    { upsert: true, new: true }
  );

  if (limitDoc.count > maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: maxRequests - limitDoc.count };
}
