import {
  EntityManager,
  EntityTarget,
  ObjectLiteral,
  Repository,
} from "typeorm";

export abstract class BaseTransactionalService<T extends ObjectLiteral> {
  protected constructor(
    private readonly entity: EntityTarget<T>,
    private readonly defaultRepo: Repository<T>,
  ) {}

  protected repo(manager?: EntityManager): Repository<T> {
    return manager ? manager.getRepository(this.entity) : this.defaultRepo;
  }
}
