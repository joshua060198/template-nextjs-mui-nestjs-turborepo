import LoginActivityEntity from "@api/database/entity/login-activity.entity";
import { BaseTransactionalService } from "@api/database/service/transactional-base.service";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { InsertLoginActivity } from "@repo/common/entity/login-activity.entity.type";
import { type EntityManager, Repository } from "typeorm";

@Injectable()
export class LoginActivityService extends BaseTransactionalService<LoginActivityEntity> {
  constructor(
    @InjectRepository(LoginActivityEntity)
    loginActivityRepository: Repository<LoginActivityEntity>,
  ) {
    super(LoginActivityEntity, loginActivityRepository);
  }

  async logActivity(data: InsertLoginActivity, manager?: EntityManager) {
    await this.repo(manager).save(
      this.repo(manager).create({
        ...data,
        user: { id: data.userId },
      }),
    );
  }
}
