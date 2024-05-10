import { Injectable } from '@nestjs/common';
import { BaseAuthGuard } from './base-auth.guard';

const LOCAL_STRATEGY = 'local';

@Injectable()
export class LocalAuthGuard extends BaseAuthGuard(LOCAL_STRATEGY) {}
