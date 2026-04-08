import { Global, Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";

@Global()
@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}

  run<T>(fn: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(fn);
  }
}
