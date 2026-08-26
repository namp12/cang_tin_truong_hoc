import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';

export const requireRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized());
    }

    const userRoles = req.user.roles || [];
    // Super admin bypasses all role checks
    if (userRoles.includes('SUPER_ADMIN')) {
      return next();
    }

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));
    if (!hasRole) {
      return next(ApiError.forbidden(`Yêu cầu vai trò: [${allowedRoles.join(', ')}] để truy cập`));
    }

    next();
  };
};
