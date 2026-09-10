import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Resume from '../models/Resume.js';
import { connectDB, closeDB } from '../config/db.js';
import { getDefaultResumeData } from './defaultResumeData.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🌱 Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Resume.deleteMany({});

    // 1. Create Demo User
    const demoUser = await User.create({
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      passwordHash: 'password123',
      jobTitle: 'Senior Full Stack Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    console.log(`👤 Created Demo User: ${demoUser.email} (Password: password123)`);

    // 2. Create 3 Sample Resumes with different templates
    const resume1 = await Resume.create({
      ...getDefaultResumeData('Senior Software Engineer Resume', 'modern', demoUser),
      userId: demoUser._id
    });

    const resume2 = await Resume.create({
      ...getDefaultResumeData('Executive Tech Lead Resume', 'professional', demoUser),
      userId: demoUser._id,
      settings: {
        primaryColor: '#0f172a',
        secondaryColor: '#475569',
        textColor: '#0f172a',
        fontFamily: 'Playfair Display',
        fontSize: 'medium',
        lineSpacing: 'normal',
        pageMargin: 'normal',
        showIcons: true
      }
    });

    const resume3 = await Resume.create({
      ...getDefaultResumeData('Minimalist ATS Tech Resume', 'minimal', demoUser),
      userId: demoUser._id,
      settings: {
        primaryColor: '#000000',
        secondaryColor: '#334155',
        textColor: '#171717',
        fontFamily: 'Inter',
        fontSize: 'small',
        lineSpacing: 'compact',
        pageMargin: 'compact',
        showIcons: false
      }
    });

    console.log(`📄 Seeded 3 sample resumes for ${demoUser.name}`);
    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
  }
};

// If run directly via CLI
if (process.argv[1].endsWith('seeder.js')) {
  seedDatabase().then(async () => {
    await closeDB();
    process.exit(0);
  });
}
