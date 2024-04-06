import { Config, ENV } from '@modules/config';
import { Inject } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

export class DatabaseService implements MongooseOptionsFactory {
  constructor(@Inject(ENV) private readonly configuration: Config) {}
  public async createMongooseOptions(): Promise<MongooseModuleOptions> {
    return { uri: this.configuration.DB_URI };
  }
}
