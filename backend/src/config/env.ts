import 'dotenv/config';

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-wardrobe-assistant',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // AI Provider
  aiProvider: process.env.AI_PROVIDER || 'gemini',
  
  // Gemini
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  
  // Grok
  grokApiKey: process.env.GROK_API_KEY || '',
  
  // Ollama
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',

  // File upload limits
  maxImageSize: 5 * 1024 * 1024, // 5MB
  allowedImageMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  // Validation
  passwordMinLength: 8,
};

export default config;
