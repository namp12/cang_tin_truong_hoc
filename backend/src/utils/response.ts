import { Response } from 'express';

export interface ApiResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: any;
  };
  errors?: any[];
}

export class ApiResponse {
  static success<T>(res: Response, data: T, message: string = 'Thao tác thành công', statusCode: number = 200, meta?: any) {
    const payload: ApiResponseData<T> = {
      success: true,
      message,
      data,
      meta,
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message: string = 'Tạo mới thành công', meta?: any) {
    return this.success(res, data, message, 201, meta);
  }

  static error(res: Response, message: string = 'Có lỗi xảy ra', statusCode: number = 500, errors?: any[]) {
    const payload: ApiResponseData = {
      success: false,
      message,
      errors,
    };
    return res.status(statusCode).json(payload);
  }
}
