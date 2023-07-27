import Redis from "ioredis"

const UPSTASH_REDIS_HOST = String(process.env.UPSTASH_REDIS_HOST);

export const client = new Redis(UPSTASH_REDIS_HOST);

client.on("error", (err) => {
  throw err;
});