import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from 'src/domain/user/repositories';

@ValidatorConstraint({ name: 'isFieldUnique', async: true })
@Injectable()
export class IsFieldUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly userRepository: UserRepository) {
    console.log(this.userRepository);
  }

  public async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    console.log(validationArguments.property);
    console.log(value, 'value');
    const existingUser = this.userRepository.findOne({
      [validationArguments.property]: value,
    });
    return !!existingUser;
  }

  public defaultMessage(args?: ValidationArguments): string {
    return `The field '${args.property}' is already taken.`;
  }
}

export function isFieldUnique(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFieldUnique',
      target: object.constructor,
      propertyName,
      constraints: [property],
      validator: IsFieldUniqueConstraint,
      options: validationOptions,
    });
  };
}
