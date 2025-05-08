import Redis from 'ioredis';

export const redis = new Redis({
    host: '0.0.0.0',
    port:  6379,
    // password: process.env.REDIS_PASSWORD, // if needed
  });

export async function markSignedUrlUsed(key: string) {
  await redis.set(`signed-url:${key}`, 'used', 'EX', 60 * 10); // optional expiry
}

export async function isSignedUrlUsed(key: string): Promise<boolean> {
  const status = await redis.get(`signed-url:${key}`);
  return status === 'used';
}

export async function storeSignedUrlKey(key: string, expiresIn: number) {
  await redis.set(`signed-url:${key}`, 'unused', 'EX', expiresIn);
}
