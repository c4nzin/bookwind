import { utilities } from 'nest-winston';
import * as winston from 'winston';

const LOGGER_TOKEN = 'Logger';

export function createWinstonFormatter() {
  return winston.format.combine(
    winston.format.timestamp({ format: 'MM-DD-YYYY hh:mm:ss A' }),
    utilities.format.nestLike(LOGGER_TOKEN, { prettyPrint: true }),
  );
}
