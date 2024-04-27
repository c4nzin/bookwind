import { FilterQuery, Model, UpdateQuery, UpdateWithAggregationPipeline } from 'mongoose';
import {
  CreateResult,
  DeleteResult,
  FindAllResult,
  FindOneResult,
  FindResult,
  UpdateResult,
} from './types/queries.types';

export class BaseRepository<T> {
  constructor(private readonly model: Model<T>) {}

  public async create(object: Partial<T>): Promise<CreateResult<T>> {
    return this.model.create(object);
  }

  public find(query: FilterQuery<T>): FindAllResult<any> {
    return this.model.find(query);
  }

  public findById(id: string): FindResult<T> {
    return this.model.findById(id);
  }

  public findByIdAndDelete(id: string): FindResult<T> {
    return this.model.findByIdAndDelete(id);
  }

  public findByIdAndUpdate(id: string, update: UpdateWithAggregationPipeline | UpdateQuery<T>): FindResult<T> {
    return this.model.findByIdAndUpdate(id, update, { new: true });
  }

  public async findOne(filter: FilterQuery<T>): Promise<FindOneResult<T>> {
    const result = await this.model.findOne(filter);
    return result ? result : null;
  }

  public findOneAndDelete(filter: FilterQuery<T>): FilterQuery<any> {
    return this.model.findOneAndDelete(filter);
  }

  public findOneAndUpdate(
    filter: FilterQuery<T>,
    update: UpdateWithAggregationPipeline | UpdateQuery<T>,
  ): FindResult<T> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  public updateMany(filter: FilterQuery<T>, object: UpdateWithAggregationPipeline | UpdateQuery<T>): UpdateResult<T> {
    return this.model.updateMany(filter, object, { new: true });
  }

  public updateOne(query: FilterQuery<T>, object: UpdateWithAggregationPipeline | UpdateQuery<T>): UpdateResult<T> {
    return this.model.updateOne(query, object);
  }

  public deleteMany(filter: FilterQuery<T>): DeleteResult<T> {
    return this.model.deleteMany(filter);
  }

  public deleteOne(filter: FilterQuery<T>): DeleteResult<T> {
    return this.model.deleteOne(filter);
  }
}
