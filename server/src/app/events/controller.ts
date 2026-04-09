import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "src/infra/http/decorators/curentUser.decorator";
import { ApiOperation } from "@nestjs/swagger";
import IsadminGuard from "src/infra/http/guards/isAdmin.guard";
import GetEventsServices from "./services/getService";
import CreateEventService from "./services/createService";
import EventDTO from "./dto/create";
import IsActiveUser from "src/infra/http/guards/isActiveUser.guard";

@Controller("events")
export default class EventsController {
  constructor(
    private readonly GetEventsServices: GetEventsServices,
    private readonly CreateEventService: CreateEventService,
  ) {}

  @Post()
  @ApiOperation({
    summary: "Criação de evento",
  })
  public async create(@Body() data: EventDTO) {
    const created = await this.CreateEventService.handle({
      ...data,
    });

    return {
      data: created,
    };
  }

  @Get(":id")
  @UseGuards(IsActiveUser)
  @ApiOperation({
    summary: "Listagem de eventos por click",
  })
  public async get(
    @CurrentUser() userId: string,
    @Param("id", new ParseUUIDPipe()) clickId: string,
  ) {
    const events = await this.GetEventsServices.get(userId, clickId);
    return events;
  }
}
