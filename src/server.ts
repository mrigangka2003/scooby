import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";
import { redisConnection } from "./config/redis";
import { logger } from "./utils/logger";
import "./jobs/email.worker"; // Initialize the email worker
async function bootstrap() {
  try {
    // Verify DB connection before accepting traffic
    await prisma.$connect();
    logger.info("✅ Database connected");

    // Verify Redis connection
    await redisConnection.ping();
    logger.info("✅ Redis connected");

    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    });

    // --- Graceful shutdown ---
    const shutdown = async (signal: string) => {
      logger.warn(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        redisConnection.disconnect();
        // The worker will also stop when the process exits or redis disconnects.
        logger.info("Shutdown complete.");
        process.exit(0);
      });

      // Force exit if not closed within 10s
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    logger.error(err, "❌ Failed to start server");
    process.exit(1);
  }
}

bootstrap();