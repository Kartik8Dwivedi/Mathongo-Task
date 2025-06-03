import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "./redis.js";

const rateLimiter = (app) => {
  const limiter = rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    windowMs: 60 * 1000,
    max: 30,
    message: "Too many requests from this IP, try again later.",
  });

  app.use(limiter);
};

export default rateLimiter;
