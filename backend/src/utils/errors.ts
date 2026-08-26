export class ApiError extends Error {
  public statusCode: number;
  public errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string, errors?: any[]) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg: string = 'Vui lòng đăng nhập để tiếp tục') {
    return new ApiError(401, msg);
  }

  static forbidden(msg: string = 'Bạn không có quyền thực hiện thao tác này') {
    return new ApiError(403, msg);
  }

  static notFound(msg: string = 'Không tìm thấy tài nguyên yêu cầu') {
    return new ApiError(404, msg);
  }

  static conflict(msg: string) {
    return new ApiError(409, msg);
  }

  static unprocessable(msg: string, errors?: any[]) {
    return new ApiError(422, msg, errors);
  }

  static internal(msg: string = 'Lỗi máy chủ nội bộ') {
    return new ApiError(500, msg);
  }
}
