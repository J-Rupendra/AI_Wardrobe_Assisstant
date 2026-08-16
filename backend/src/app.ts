import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config from './config/env';
import authRoutes from './routes/authRoutes';
import wardrobeRoutes from './routes/wardrobeRoutes';
import chatRoutes from './routes/chatRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import recommendationHistoryRoutes from './routes/recommendationHistoryRoutes';
import { ZodError } from 'zod';

const app: Express = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'AI Wardrobe Assistant API',
    version: '0.1.0',
    docs: '/api/docs',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/recommendations/history', recommendationHistoryRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
    },
  });
});

// Error handling middleware
app.use((err: Error | ZodError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: err.errors,
      },
    });
    return;
  }

  if (err instanceof Error) {
    const errorCode = (err.message as any) || 'INTERNAL_SERVER_ERROR';
    
    switch (errorCode) {
      case 'USERNAME_ALREADY_EXISTS':
        res.status(409).json({
          success: false,
          error: {
            code: 'USERNAME_ALREADY_EXISTS',
            message: 'Username is already taken',
          },
        });
        return;
      case 'INVALID_CREDENTIALS':
        res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid username or password',
          },
        });
        return;
    }
  }

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.env === 'production' 
        ? 'An unexpected error occurred' 
        : (err instanceof Error ? err.message : 'Unknown error'),
    },
  });
});

export default app;
