import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import IsActiveUser from "src/infra/http/guards/isActiveUser.guard";
import { CurrentUser } from "src/infra/http/decorators/curentUser.decorator";
import { ApiOperation } from "@nestjs/swagger";
import type { IPaginationProps } from "src/core/types";
import { PaginationPipe } from "src/infra/http/pipes";
import GenerateClickService from "./services/createService";
import type { Request } from "express";
import GetClickServices from "./services/getService";
import { CreateClickDto } from "./dto/create";

@Controller("clicks")
export default class ClickController {
  constructor(
    private readonly GenerateClickService: GenerateClickService,
    private readonly GetClickServices: GetClickServices,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Criação de click",
  })
  public async create(@Req() request: Request, @Body() data: CreateClickDto) {
    const click = await this.GenerateClickService.handle({
      ...data,
      req: request,
    });

    return {
      data: click,
    };
  }
  @Get(":trackerId")
  @UseGuards(IsActiveUser)
  @ApiOperation({
    summary: "Listagem de todos clicks por trackerId",
  })
  public async get(
    @Query(new PaginationPipe()) props: IPaginationProps,
    @Query("page") page: number,
    @Query("limit") limit: number,
    @CurrentUser() userId: string,
    @Param("trackerId", new ParseUUIDPipe()) trackerId: string,
  ) {
    const data = await this.GetClickServices.get(trackerId, userId, props);
    return {
      data: data?.data,
    };
  }
}
