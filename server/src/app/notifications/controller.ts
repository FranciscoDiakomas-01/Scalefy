import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import CreateCampainService from "./services/createService";
import UpdateCampainService from "./services/updateService";
import GetCampainService from "./services/getService";
import IsActiveUser from "src/infra/http/guards/isActiveUser.guard";
import CampainsDTO from "./dto/create";
import { CurrentUser } from "src/infra/http/decorators/curentUser.decorator";
import { ApiOperation } from "@nestjs/swagger";
import IsadminGuard from "src/infra/http/guards/isAdmin.guard";
import type { IPaginationProps } from "src/core/types";
import { PaginationPipe } from "src/infra/http/pipes";

@Controller("campains")
@UseGuards(IsActiveUser)
export default class CampainsController {
  constructor(
    private readonly CreateCampainService: CreateCampainService,
    private readonly UpdateCampainService: UpdateCampainService,
    private readonly GetCampainService: GetCampainService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Criação de campanha",
  })
  public async create(
    @Body() data: CampainsDTO,
    @CurrentUser() userId: string,
  ) {
    const created = await this.CreateCampainService.handle({
      ...data,
      userId,
    });

    return {
      data: created,
    };
  }

  @Put(":id")
  @ApiOperation({
    summary: "Actualização de campanha",
  })
  public async update(
    @Body() data: CampainsDTO,
    @CurrentUser() userId: string,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    const updated = await this.UpdateCampainService.handle({
      ...data,
      userId,
      campainId: id,
    });

    return {
      data: updated,
    };
  }

  @Get()
  @UseGuards(IsadminGuard)
  @ApiOperation({
    summary: "Listagem de todas campanha",
  })
  public async get(
    @Query(new PaginationPipe()) props: IPaginationProps,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    const [data, count] = await Promise.all([
      this.GetCampainService.get(props),
      this.GetCampainService.count(),
    ]);
    return {
      data: data?.data,
      count: count?.data,
    };
  }

  @Get("/my")
  @ApiOperation({
    summary: "Listagem de todas campanha por usuário",
  })
  public async getByUser(
    @Query(new PaginationPipe()) props: IPaginationProps,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @CurrentUser() userId: string,
  ) {
    const [data, count] = await Promise.all([
      this.GetCampainService.getByUserId(props, userId),
      this.GetCampainService.countByUserId(userId),
    ]);
    return {
      data: data?.data,
      count: count?.data,
    };
  }

  @Get("/details/:id")
  @ApiOperation({
    summary: "Listagem detahes de uma campanha",
  })
  public async details(
    @Param("id", new ParseUUIDPipe()) id: string,
    @CurrentUser() userId: string,
  ) {
    const [data] = await Promise.all([
      this.GetCampainService.getDetails(id, userId),
    ]);
    return {
      data: data?.data,
    };
  }
}
