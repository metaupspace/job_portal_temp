import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    type ExceptionBody = { message: string | string[] };

    const body =
      exceptionResponse !== null && typeof exceptionResponse === 'object'
        ? (exceptionResponse as ExceptionBody)
        : null;

    const rawMessage =
      body?.message ??
      (typeof exceptionResponse === 'string'
        ? exceptionResponse
        : 'Internal server error');
    const message = Array.isArray(rawMessage)
      ? 'Validation failed'
      : rawMessage;
    const errors = Array.isArray(rawMessage) ? rawMessage : undefined;

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
