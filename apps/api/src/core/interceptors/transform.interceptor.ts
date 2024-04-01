import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response as expressResponse } from 'express';
import { Message } from '@common/decorators/message.decorator';
import { Reflector } from '@nestjs/core';

interface Response<T> {
  data?: T;
  message: string;
  statusCode: number;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> {
    return next.handle().pipe(map((data) => this.wrapTransform(data, context)));
  }

  public wrapTransform(data: T, context: ExecutionContext): Response<T> {
    const { statusCode } = context
      .switchToHttp()
      .getResponse<expressResponse>();

    const message = this.reflector.get(Message, context.getHandler());

    return { statusCode, message, data };
  }
}
