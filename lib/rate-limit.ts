import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize the Redis client using environment variables automatically (UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)
const redis = Redis.fromEnv();

// Create a new rate limiter that allows 5 requests per 60 seconds (sliding window)
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '60 s'),
  analytics: true,
  prefix: '@upstash/ratelimit',
});
