import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response as ExpressResponse } from 'express';

@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
  public catch(exception: T, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<ExpressResponse>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException ? exception.getResponse() : new InternalServerErrorException().getResponse();

    console.log(res.toString());
    response.status(status).json(res);
  }
}
