import Redis from "ioredis";
import { env } from "./env";
import { logger } from "../utils/logger";

export const redisConnection = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // required by BullMQ
});

redisConnection.on("connect", () => logger.info("Redis connecting..."));
redisConnection.on("ready", () => logger.info("Redis ready"));
redisConnection.on("error", (err) => logger.error(err, "Redis connection error"));