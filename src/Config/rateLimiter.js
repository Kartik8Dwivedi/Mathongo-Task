import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import Redis from "ioredis";

const redisClient = new Redis();

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis at 127.0.0.1:6379");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err.message);
});

const rateLimiter = (app) => {
  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: 60 * 1000, // 1 min
    max: 30, // Limit each IP to 30 requests per minute
    message:
      "Too many requests from this IP, please try again after a few minutes.",
  });

  app.use(limiter);
};

export default rateLimiter;
