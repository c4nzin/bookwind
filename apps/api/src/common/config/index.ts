import { port, str } from 'envalid';
import { makeValidators, Static } from 'nestjs-envalid';

const config = {
  DB_URI: str(),
  PORT: port({ default: 3000 }),
  GLOBAL_PREFIX: str({ default: 'api' }),
  LOGTAIL_SOURCE: str({}),
};

export const validators = makeValidators(config);
export type Config = Static<typeof validators>;
export const ENV = 'EnvalidModuleEnv';
