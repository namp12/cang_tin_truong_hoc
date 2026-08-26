import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors.js';
import { ApiResponse } from '../utils/response.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`❌ [Error] ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof ApiError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.errors);
  }

  // Handle MySQL errors gracefully
  if (err.code === 'ER_DUP_ENTRY') {
    return ApiResponse.error(res, 'Dữ liệu đã tồn tại trong hệ thống (trùng mã hoặc tên duy nhất)', 409);
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return ApiResponse.error(res, 'Dữ liệu liên kết (khóa ngoại) không tồn tại', 400);
  }

  const message = process.env.NODE_ENV === 'production' ? 'Đã có lỗi hệ thống xảy ra' : err.message || 'Lỗi máy chủ nội bộ';
  return ApiResponse.error(res, message, 500);
};
