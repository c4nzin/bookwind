import { Module } from '@nestjs/common';
import { JwtModule as JwtModuleFactory } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    JwtModuleFactory.registerAsync({ useClass: JwtService, global: true }),
  ],
})
export class JwtModule {}
