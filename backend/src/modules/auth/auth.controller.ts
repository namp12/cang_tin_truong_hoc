import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../utils/response.js';
import { ApiError } from '../../utils/errors.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { credential, password } = req.body;
      if (!credential || !password) {
        throw ApiError.badRequest('Vui lòng nhập tên đăng nhập/email và mật khẩu');
      }

      const ipAddress = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.login(credential, password, ipAddress, userAgent);
      return ApiResponse.success(res, result, 'Đăng nhập thành công');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw ApiError.unauthorized();
      }
      const user = await AuthService.getMe(req.user.id);
      return ApiResponse.success(res, user, 'Lấy thông tin thành công');
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      return ApiResponse.success(res, null, 'Đăng xuất thành công');
    } catch (error) {
      next(error);
    }
  }
}
