import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  // TODO : Exception 처리 필요
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const { status, message } = this.resolveException(exception);

    this.logException(request, status, message, exception);

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private logException(
    request: Request,
    status: number,
    message: string,
    exception: unknown,
  ) {
    const context = `${request.method} ${request.url} → ${message}`;
    const stack = exception instanceof Error ? exception.stack : undefined;

    if (status >= 500) {
      this.logger.error(context, stack);
    } else {
      this.logger.warn(context);
    }
  }

  private resolveException(exception: unknown): {
    status: number;
    message: string;
  } {
    if (!(exception instanceof HttpException)) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      };
    }

    const res = exception.getResponse();
    const message = typeof res === 'string' ? res : exception.message;
    return { status: exception.getStatus(), message };
  }
}
