import dotenv from 'dotenv';
import RateLimiter from './rateLimiter.js'

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase',
  RateLimiter: RateLimiter,
};