import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface IFullError {
  statusCode: number;
  error: string;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    // Lấy thông tin lỗi chi tiết
    const fullError = exception.getResponse() as IFullError;

    //
    let status: number = 500;
    let error: string = 'Internal Server Error';
    let message: string = 'Internal Server Error';

    // Nếu fullError là string, thì message sẽ là exception.message, status sẽ là exception.getStatus()
    if (typeof fullError === 'string') {
      message = exception.message;
      status = exception.getStatus();
    } else {
      message = fullError.message || message;
      status = fullError.statusCode || status;
      error = fullError.error || error;
    }

    // Chỉ hiển thị chi tiết lỗi khi ở môi trường phát triển
    const isDev = process.env.NODE_ENV !== 'prod';
    const ownDev = {
      timestamp: new Date().toISOString(),
      path: req.url,
      user: req.user,
      body: req.body as Record<string, any>,
      queries: req.query as Record<string, any>,
      params: req.params as Record<string, any>,
      trace: exception.stack,
    };

    // Tạo response body chuẩn cho lỗi
    const responseBody = {
      statusCode: status,
      error: error,
      message: message,
      ...(isDev ? ownDev : {}),
    };

    // Log lỗi chi tiết
    this.logger.debug(responseBody);

    // Ghi log lỗi chi tiết vào file log
    // {responseBody, ...ownDev}

    // Trả về response lỗi chuẩn
    res.status(status).json(responseBody);
  }
}
