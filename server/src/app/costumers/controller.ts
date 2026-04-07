import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import GetCostumerService from "./services/getService";
import UpateUserService from "./services/updateService";
import ToogleUserService from "./services/toogleService";
import { CurrentUser } from "src/infra/http/decorators/curentUser.decorator";
import { ApiOperation } from "@nestjs/swagger";
import { PaginationPipe } from "src/infra/http/pipes";
import type { IPaginationProps } from "src/core/types";
import { ToogleUserDTO } from "./dto/toogle";
import IsadminGuard from "src/infra/http/guards/isAdmin.guard";
import IsActiveUser from "src/infra/http/guards/isActiveUser.guard";
import UpdateCostumerDTO from "./dto/update";

@Controller("/costumer")
@UseGuards(IsActiveUser)
export class CostumerController {
  constructor(
    private readonly GetCostumerService: GetCostumerService,
    private readonly UpateUserService: UpateUserService,
    private readonly ToogleUserService: ToogleUserService,
  ) {}

  @ApiOperation({
    summary: "Dados do perfil autenticado",
  })
  @Get("me")
  public async getMe(@CurrentUser() userid: string) {
    return await this.GetCostumerService.getById(userid);
  }

  @Get()
  @UseGuards(IsadminGuard)
  @ApiOperation({
    summary: "Listar usuários apenas admin",
  })
  public async get(
    @Query("page", new ParseIntPipe()) page: number,
    @Query("limit", new ParseIntPipe()) limit: number,
    @Query(new PaginationPipe()) queryValidator: IPaginationProps,
  ) {
    return await this.GetCostumerService.getAll({
      page,
      limit,
    });
  }

  @Patch("toogle")
  @UseGuards(IsadminGuard)
  @ApiOperation({
    summary: "Mudar user state",
  })
  public async toogle(@Body() props: ToogleUserDTO) {
    return await this.ToogleUserService.handle(props);
  }

  @Put()
  @ApiOperation({
    summary: "Actualizar dados do perfil",
  })
  public async update(
    @CurrentUser() userId: string,
    @Body() data: UpdateCostumerDTO,
  ) {
    const updated = await this.UpateUserService.handle({
      ...data,
      userId,
    });
    return updated;
  }
}
