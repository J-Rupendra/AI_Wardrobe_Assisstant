import app from './app';
import config from './config/env';
import { connectDatabase } from './config/database';

async function startServer(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(config.port, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log('✓ AI Wardrobe Assistant Backend Started');
      console.log(`${'='.repeat(60)}`);
      console.log(`Environment: ${config.env}`);
      console.log(`Server URL: http://localhost:${config.port}`);
      console.log(`API Health: http://localhost:${config.port}/api/health`);
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
