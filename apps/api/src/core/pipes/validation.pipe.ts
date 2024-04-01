import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
@Injectable()
export class ValidationPipe<T> implements PipeTransform<T> {
  public async transform(value: T, { metatype }: ArgumentMetadata): Promise<T> {
    if (!value || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, {
      stopAtFirstError: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length === 0) return value;

    const errorMessages = errors.flatMap((value) =>
      Object.values(value.constraints),
    );

    throw new BadRequestException(errorMessages);
  }

  public toValidate(metatype: Function) {
    const types: Function[] = [String, Object, Function, Array, Number];
    return !types.includes(metatype);
  }
}
