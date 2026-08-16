import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../schemas/authSchemas';
import authService from '../services/auth/AuthService';

export interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = registerSchema.parse(req.body);
      const result = await authService.register(input);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async me(req: AuthRequest, res: Response): Promise<void> {
    res.json({
      success: true,
      data: req.user,
    });
  }
}

export default new AuthController();
