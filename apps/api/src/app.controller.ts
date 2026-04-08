import { SeedersService } from "@api/database/seeders/seeders.service";
import { SchemaResponse } from "@api/decorator/schema-response.decorator";
import { Public } from "@api/service/auth/decorator/is-public.decorator";
import { RequirePermissions } from "@api/service/auth/decorator/require-permissions.decorator";
import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Version,
  VERSION_NEUTRAL,
} from "@nestjs/common";
import {
  type HealthCheckResponse,
  HealthCheckSchema,
} from "@repo/common/app.type";
import {
  GENERAL_ERROR,
  ResponseFailed,
  ResponseSuccess,
} from "@repo/common/common.type";

@Controller({
  version: VERSION_NEUTRAL,
})
export class AppController {
  constructor(private readonly seedersService: SeedersService) {}

  @Get("/health")
  @SchemaResponse(HealthCheckSchema)
  @Public()
  health(): HealthCheckResponse {
    return new ResponseSuccess("OK");
  }

  @Version("1")
  @RequirePermissions("manage:system")
  @Post("/seed/:type")
  async seedDatabase(@Param("type") type: "permission" | "role" | "user") {
    switch (type) {
      case "permission":
        await this.seedersService.seedPermissions();
        break;
      case "role":
        await this.seedersService.seedRoles();
        break;
      case "user":
        await this.seedersService.seedUsers();
        break;
      default:
        throw new InternalServerErrorException(
          new ResponseFailed(GENERAL_ERROR.UNCAUGHT),
        );
    }
    return new ResponseSuccess(true);
  }
}
