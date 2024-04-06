import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggerService } from './logger.service';

@Module({
  imports: [WinstonModule.forRootAsync({ useClass: LoggerService })],
})
export class LoggerModule {}
