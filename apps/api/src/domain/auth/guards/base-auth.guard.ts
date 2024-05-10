import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

export function BaseAuthGuard(strategy: string) {
  return class extends AuthGuard(strategy) {
    constructor() {
      super();
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
      const request: Request = context.switchToHttp().getRequest<Request>();
      const result: boolean = (await super.canActivate(context)) as boolean;

      await super.logIn(request);

      return !!result;
    }
  };
}
