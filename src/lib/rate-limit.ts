import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// 5 contact-form submissions per hour per IP hash.
export const contactRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 h"), prefix: "ratelimit:contact" })
  : null;

// 10 login attempts per 15 minutes per IP.
export const loginRateLimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "15 m"), prefix: "ratelimit:login" })
  : null;

// In-memory fallback map when Upstash credentials are not provisioned
const inMemoryStore = new Map<string, number[]>();

export async function checkRateLimit(
  limiter: Ratelimit | null,
  key: string,
  limitCount = 5,
  windowMs = 60 * 60 * 1000
): Promise<{ allowed: boolean; remaining?: number }> {
  if (limiter) {
    const { success, remaining } = await limiter.limit(key);
    return { allowed: success, remaining };
  }

  // Graceful in-memory sliding window rate limiter
  const now = Date.now();
  const timestamps = (inMemoryStore.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= limitCount) {
    return { allowed: false, remaining: 0 };
  }
  timestamps.push(now);
  inMemoryStore.set(key, timestamps);
  return { allowed: true, remaining: limitCount - timestamps.length };
}
