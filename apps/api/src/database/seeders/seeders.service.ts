import { PermissionEntity } from "@api/database/entity/permission.entity";
import { RoleEntity } from "@api/database/entity/role.entity";
import { SystemConfigEntity } from "@api/database/entity/system.entity";
import UserEntity from "@api/database/entity/user.entity";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CreatePermission } from "@repo/common/entity/permission.entity.type";
import * as bcrypt from "bcrypt";
import { DataSource, EntityManager, Repository } from "typeorm";

@Injectable()
export class SeedersService implements OnModuleInit {
  private readonly logger = new Logger("SeedersService");
  private permissionRepository: Repository<PermissionEntity>;
  private roleRepository: Repository<RoleEntity>;
  private userRepository: Repository<UserEntity>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.dataSource.transaction(async (manager) => {
      const systemConfigRepo = manager.getRepository(SystemConfigEntity);
      const setupKey = await systemConfigRepo.findOne({
        where: { name: "default_seed" },
      });

      if (!(setupKey !== null && setupKey.value === "true")) {
        await this.seedAll(manager);
        const updatedKey = setupKey
          ? { ...setupKey, value: "true" }
          : { name: "default_seed", value: "true" };

        await systemConfigRepo.save(updatedKey);
      } else {
        this.logger.debug("Skipping default seeders... ");
      }
    });
  }

  async seedAll(manager?: EntityManager) {
    this.logger.debug("========== SEEDING ALL ==========");
    await this.seedPermissions(manager);
    await this.seedRoles(manager);
    await this.seedUsers(manager);
  }

  async seedPermissions(manager?: EntityManager) {
    this.logger.debug("========== SEEDING PERMISSIONS ==========");
    const data: CreatePermission[] = [
      {
        action: "manage",
        resource: "system",
        description: "Manage Entire System",
        displayName: "Manage System",
      },
      {
        action: "open",
        resource: "admin_page",
        description: "Open Admin Page",
        displayName: "Open Admin Page",
      },
    ];

    const actionList = ["manage", "create", "read", "update", "delete"];
    const resourceList = ["user", "rbac"];

    for (const action of actionList) {
      for (const resource of resourceList) {
        data.push({
          action,
          resource,
          description: "",
          displayName: `${this.capitalizeFirstWordString(action)} ${this.capitalizeFirstWordString(resource)}`,
        });
      }
    }

    const repo = this.getPermissionRepo(manager);

    for (const d of data) {
      const isExist = await repo.exists({
        where: {
          action: d.action,
          resource: d.resource,
        },
      });

      if (!isExist) {
        await repo.save(repo.create(d));
      } else {
        await repo.update(
          {
            action: d.action,
            resource: d.resource,
          },
          d,
        );
      }
    }

    this.logger.debug(`Success!! Seeded ${data.length} permission`);
  }

  async seedRoles(manager?: EntityManager) {
    this.logger.debug("========== SEEDING ROLES ==========");

    const permissions = await this.getPermissionRepo(manager).find({
      where: [
        {
          action: "manage",
          resource: "system",
        },
        {
          action: "open",
          resource: "admin_page",
        },
      ],
    });

    const rolesToSeed = [
      { name: "super_admin", displayName: "Super Admin", permissions },
      {
        name: "admin",
        displayName: "Admin",
        permissions: permissions.filter(
          (v) => v.action !== "manage" && v.resource !== "system",
        ),
      },
      { name: "user", displayName: "User", permissions: [] },
    ];

    for (const newRole of rolesToSeed) {
      const isExist = await this.getRoleRepo(manager).exists({
        where: {
          name: newRole.name,
        },
      });

      if (!isExist) {
        await this.getRoleRepo(manager).save(
          this.getRoleRepo(manager).create({
            name: newRole.name,
            displayName: newRole.displayName,
            isSystem: true,
            permissions: newRole.permissions,
          }),
        );
      }

      this.logger.debug(`Success!! Seeded ${newRole.displayName} Role`);
    }
  }

  async seedUsers(manager?: EntityManager) {
    this.logger.debug("========== SEEDING USERS ==========");

    const data = [
      {
        roleName: "super_admin",
        password: this.configService.get<string>(
          "SUPER_ADMIN_PASSWORD",
          "administrator7890",
        ),
        fullName: "Super Admin",
      },
      {
        roleName: "admin",
        password: "admin789",
        fullName: "Admin",
      },
      {
        roleName: "user",
        password: "user1234",
        fullName: "User",
      },
    ];

    for (const item of data) {
      const isExist = await this.getUserRepo(manager).exists({
        where: {
          username: item.roleName,
        },
      });

      if (!isExist) {
        const role = await this.getRoleRepo(manager).findOneOrFail({
          where: {
            name: item.roleName,
          },
        });

        const password = await bcrypt.hash(item.password, 12);

        await this.getUserRepo(manager).save(
          this.getUserRepo(manager).create({
            username: item.roleName,
            role,
            fullName: item.fullName,
            password,
            resetPassword: false,
          }),
        );
      }
      this.logger.debug(`Success!! Seeded ${item.fullName}`);
    }
  }

  private getPermissionRepo(manager?: EntityManager) {
    if (!this.permissionRepository) {
      if (manager) {
        this.permissionRepository = manager.getRepository(PermissionEntity);
      } else {
        this.permissionRepository =
          this.dataSource.getRepository(PermissionEntity);
      }
    }
    return this.permissionRepository;
  }

  private getRoleRepo(manager?: EntityManager) {
    if (!this.roleRepository) {
      if (manager) {
        this.roleRepository = manager.getRepository(RoleEntity);
      } else {
        this.roleRepository = this.dataSource.getRepository(RoleEntity);
      }
    }
    return this.roleRepository;
  }

  private getUserRepo(manager?: EntityManager) {
    if (!this.userRepository) {
      if (manager) {
        this.userRepository = manager.getRepository(UserEntity);
      } else {
        this.userRepository = this.dataSource.getRepository(UserEntity);
      }
    }
    return this.userRepository;
  }

  private capitalizeFirstWordString(input: string) {
    return input
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  }
}
