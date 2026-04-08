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
import IsActiveUser from "src/infra/http/guards/isActiveUser.guard";
import { CurrentUser } from "src/infra/http/decorators/curentUser.decorator";
import { ApiOperation } from "@nestjs/swagger";
import IsadminGuard from "src/infra/http/guards/isAdmin.guard";
import type { IPaginationProps } from "src/core/types";
import { PaginationPipe } from "src/infra/http/pipes";
import CreateTrackerService from "./services/createService";
import ToogleTrackerService from "./services/toogleService";
import GetTrackerServices from "./services/getService";
import TrackerDTO from "./dto/create";

@Controller("trackers")
@UseGuards(IsActiveUser)
export default class TrackersController {
  constructor(
    private readonly CreateTrackerService: CreateTrackerService,
    private readonly ToogleTrackerService: ToogleTrackerService,
    private readonly GetTrackerServices: GetTrackerServices,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Criação de tracker",
  })
  public async create(@Body() data: TrackerDTO, @CurrentUser() userId: string) {
    const created = await this.CreateTrackerService.handle({
      ...data,
      userId,
    });

    return {
      data: created,
    };
  }

  @Put("/:campainId/toogle/:id")
  @ApiOperation({
    summary: "Actualização de tracker",
  })
  public async update(
    @CurrentUser() userId: string,
    @Param("campainId", new ParseUUIDPipe()) campainId: string,
    @Param("id", new ParseUUIDPipe()) trackerId: string,
  ) {
    const updated = await this.ToogleTrackerService.handle({
      campainId,
      trackerId,
      userId,
    });

    return {
      data: updated,
    };
  }

  @Get()
  @UseGuards(IsadminGuard)
  @ApiOperation({
    summary: "Listagem de todas tracker",
  })
  public async get(
    @Query(new PaginationPipe()) props: IPaginationProps,
    @Query("page") page: number,
    @Query("limit") limit: number,
  ) {
    const data = await this.GetTrackerServices.get(props);
    return {
      data: data?.data,
    };
  }

  @Get("/trackers/:campainId")
  @ApiOperation({
    summary: "Listagem de todas tracker por usuário e por campanha",
  })
  public async getByUser(
    @Param("campainId", new ParseUUIDPipe()) campainId: string,
    @CurrentUser() userId: string,
  ) {
    const data = await this.GetTrackerServices.getDetails(campainId, userId);
    return {
      data: data,
    };
  }
}
