import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/infra/http/decorators/curentUser.decorator";
import IsActiveUser from "src/infra/http/guards/isActiveUser.guard";
import { CreateSubscriptionDto } from "./dto/create";
import IsadminGuard from "src/infra/http/guards/isAdmin.guard";
import type { IPaginationProps } from "src/core/types";
import { PaginationPipe } from "src/infra/http/pipes";
import type { IPlinkPayResponse } from "src/infra/Payments/strategy/PlinkPay";
import { CreateSubscriptionService } from "./services/createUsecase";
import GetSubscriptionService from "./services/getUsecase";
import UpdateSubscriptionService from "./services/updateUseCase";
import { ApiOperation } from "@nestjs/swagger";
import type { Request } from "express";

@Controller("subscription")
export default class SubcriptionController {
  private readonly ALLOWED_ORIGINS = ["http://api.plinqpay.com"];
  constructor(
    private readonly CreateSubscriptionService: CreateSubscriptionService,
    private readonly GetSubscriptionService: GetSubscriptionService,
    private readonly UpdateSubscriptionService: UpdateSubscriptionService,
  ) {}

  @Post("/subscribe")
  @ApiOperation({ summary: "Criação de subscrição em um plano" })
  @UseGuards(IsActiveUser)
  public async suscriebe(
    @CurrentUser() userId: string,
    @Body() data: CreateSubscriptionDto,
  ) {
    return await this.CreateSubscriptionService.handle({
      method: data.method,
      planId: data.planId,
      userId,
    });
  }

  @Get("/my")
  @ApiOperation({ summary: "Listagem de minhas subscrições" })
  @UseGuards(IsActiveUser)
  public async getMySubscriptions(@CurrentUser() userId: string) {
    return await this.GetSubscriptionService.getMySubscriptions(userId);
  }

  @Get()
  @UseGuards(IsadminGuard)
  @ApiOperation({ summary: "Listagem de  subscrições" })
  public async getAlls(
    @Query("page") page: number,
    @Query("limit") limit: number,
    @Query(new PaginationPipe()) query: IPaginationProps,
  ) {
    return await this.GetSubscriptionService.getAll({
      limit,
      page,
    });
  }

  @Get("/:id")
  @UseGuards(IsActiveUser)
  @ApiOperation({ summary: "Get detalhes da subscrição" })
  public async getDetails(
    @CurrentUser() userId: string,
    @Param("id", new ParseUUIDPipe()) id: string,
  ) {
    return await this.GetSubscriptionService.getDetails(id, userId);
  }

  @Post("/update")
  @ApiOperation({ summary: "Webhook de atualização de pagamento (PlinkPay)" })
  public async update(@Body() data: IPlinkPayResponse, @Req() req: Request) {
    const origin = req.headers.origin || req.headers.referer;
    if (!origin) {
      throw new UnauthorizedException("Origem não informada");
    }
    const isAllowed = this.ALLOWED_ORIGINS.some((url) =>
      origin.startsWith(url),
    );
    if (!isAllowed) {
      throw new UnauthorizedException("Origem não permitida");
    }
    return await this.UpdateSubscriptionService.handle(data);
  }
}
