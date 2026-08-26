import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors.js';

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  userType: string;
  roles: string[];
  canteenId?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Vui lòng cung cấp mã xác thực hợp lệ'));
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_canteen_management_2026_production_ready';

    const decoded = jwt.verify(token, secret) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'));
    }
    return next(ApiError.unauthorized('Mã xác thực không hợp lệ hoặc đã bị chỉnh sửa'));
  }
};
