import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

const LOCAL = 'local';

export class LocalStrategyGuard extends AuthGuard(LOCAL) {
  constructor() {
    super();
  }
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const result = await super.canActivate(context);

    await super.logIn(request);
    return !!result;
  }
}
