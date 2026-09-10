import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resumebuilder';

  try {
    // Attempt connecting to the configured MongoDB instance with a short timeout
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`✅ MongoDB Connected to database: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Could not connect to local MongoDB at ${primaryUri} (${error.message}).`);
    console.log('🔄 Initializing in-memory MongoDB server for seamless zero-config development...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 120000
        }
      });
      const inMemoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`✅ In-Memory MongoDB Connected at ${inMemoryUri}`);
    } catch (memError) {
      console.error(`❌ Failed to start In-Memory MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

export const closeDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
    console.log('MongoDB connection closed successfully');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
  }
};
