import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../../models/User';
import config from '../../config/env';
import { RegisterInput, LoginInput } from '../../schemas/authSchemas';

export interface AuthResponse {
  user: {
    id: string;
    username: string;
  };
  token: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await User.findOne({ username: input.username });
    if (existingUser) {
      throw new Error('USERNAME_ALREADY_EXISTS');
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(input.password, 10);

    // Create user
    const user = await User.create({
      username: input.username,
      passwordHash,
      preferences: {
        preferredStyles: [],
        preferredColors: [],
        dislikedColors: [],
        preferredFormality: null,
      },
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
      },
      token,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    // Find user
    const user = await User.findOne({ username: input.username });
    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Verify password
    const isValidPassword = await bcryptjs.compare(input.password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: {
        id: user._id.toString(),
        username: user.username,
      },
      token,
    };
  }

  async verifyToken(token: string): Promise<IUser | null> {
    try {
      const payload = jwt.verify(token, config.jwtSecret) as { userId: string };
      const user = await User.findById(payload.userId);
      return user;
    } catch {
      return null;
    }
  }

  private generateToken(user: IUser): string {
    return jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }
}

export default new AuthService();
