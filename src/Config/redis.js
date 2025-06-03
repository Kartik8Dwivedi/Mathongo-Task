import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const host = process.env.REDIS_HOST || "127.0.0.1";
const port = process.env.REDIS_PORT || 6379;
const username = process.env.REDIS_USERNAME || undefined;
const password = process.env.REDIS_PASSWORD || undefined;

console.log(
  `🔗 Connecting to Redis at ${host}:${port} with username: ${username || "N/A"}`
);

const redisClient = new Redis({
  host,
  port,
  username,
  password,
  db: 0,
  retryStrategy: (times) => Math.min(times * 50, 2000),
});

redisClient.on("connect", () => {
  const connectionType =
    host === "127.0.0.1" || host === "localhost"
      ? "🖥️ Local Redis"
      : "☁️ RedisLabs (Remote)";

  console.log(`✅ Redis connected → ${connectionType} at ${host}:${port}`);
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redisClient; 
