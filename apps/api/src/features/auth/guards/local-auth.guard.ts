import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

const LOCAL = 'local';

export class LocalAuthGuard extends AuthGuard(LOCAL) {
  constructor() {
    super();
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const result: boolean = (await super.canActivate(context)) as boolean;

    await super.logIn(request);

    return !!result;
  }
}
