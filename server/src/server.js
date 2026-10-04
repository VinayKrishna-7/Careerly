import 'dotenv/config';
import app from './app.js';
import { connectDB, closeDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

// Connect to MongoDB and start HTTP Server
const startServer = async () => {
  try {
    await connectDB();

    // One-time database reset: wipe all old historical accounts & resumes to start 100% fresh
    try {
      const mongoose = (await import('mongoose')).default;
      const db = mongoose.connection.db;
      if (db) {
        const marker = await db.collection('system_migrations').findOne({ key: 'wipe_historical_accounts_v1' });
        if (!marker) {
          const User = (await import('./models/User.js')).default;
          const Resume = (await import('./models/Resume.js')).default;
          const CoverLetter = (await import('./models/CoverLetter.js')).default;

          const uDel = await User.deleteMany({});
          const rDel = await Resume.deleteMany({});
          const cDel = await CoverLetter.deleteMany({});

          await db.collection('system_migrations').insertOne({
            key: 'wipe_historical_accounts_v1',
            wipedAt: new Date(),
            usersDeleted: uDel.deletedCount,
            resumesDeleted: rDel.deletedCount,
            coversDeleted: cDel.deletedCount
          });
          console.log(`🧹 Database cleanly wiped of all historical accounts (${uDel.deletedCount} users, ${rDel.deletedCount} resumes). Starting 100% fresh!`);
        }
      }
    } catch (wipeErr) {
      console.warn('Database reset check:', wipeErr.message);
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });

    // Render Free-Tier Anti-Sleep Self-Ping Heartbeat (Every 13 minutes)
    const pingTarget = process.env.RENDER_EXTERNAL_URL || process.env.CLIENT_URL;
    if (pingTarget && pingTarget.startsWith('http')) {
      const healthEndpoint = `${pingTarget.replace(/\/+$/, '')}/api/health`;
      setInterval(async () => {
        try {
          await fetch(healthEndpoint);
        } catch {
          // Ignore network ping errors in background
        }
      }, 13 * 60 * 1000);
    }

    // Graceful Shutdown
    const handleShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Gracefully terminating server...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await closeDB();
        process.exit(0);
      });

      // Force shutdown after 10s if dangling connections exist
      setTimeout(() => {
        console.error('Forcing shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
