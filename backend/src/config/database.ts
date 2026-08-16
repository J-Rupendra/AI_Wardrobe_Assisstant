import mongoose from 'mongoose';
import config from './env';

export async function connectDatabase(): Promise<void> {
  try {
    console.log('Connecting to MongoDB:', config.mongodbUri.replace(/:[^:]*@/, ':****@'));
    
    await mongoose.connect(config.mongodbUri);
    
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB disconnected');
  } catch (error) {
    console.error('✗ MongoDB disconnection failed:', error);
  }
}

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('✓ MongoDB connected to:', mongoose.connection.host);
});

mongoose.connection.on('error', (err) => {
  console.error('✗ MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('✗ MongoDB disconnected');
});
