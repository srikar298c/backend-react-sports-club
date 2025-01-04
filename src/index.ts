import dotenv from 'dotenv';
import app from './app';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient(); // Initialize Prisma Client

const PORT = process.env.PORT || 3000; // Default port

(async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to the database');

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect(); // Ensure proper disconnection on error
  }
})();
