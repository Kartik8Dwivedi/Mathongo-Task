import dotenv from 'dotenv';
import RateLimiter from './rateLimiter.js'

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase",
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_USERNAME: process.env.REDIS_USERNAME || undefined,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || undefined,
  RateLimiter: RateLimiter,
};