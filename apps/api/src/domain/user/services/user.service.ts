import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
}
