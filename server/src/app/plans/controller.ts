import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import GetPlanService from "./services/getService";
import CreatePlansService from "./services/createService";
import PlanDTO from "./dto/create";
import IsadminGuard from "src/infra/http/guards/isAdmin.guard";
import UpdatePlansService from "./services/updateService,";
import { ApiOperation } from "@nestjs/swagger";
import IsActiveUser from "src/infra/http/guards/isActiveUser.guard";

@Controller("plans")
export default class PlanController {
  constructor(
    private readonly GetPlanService: GetPlanService,
    private readonly UpdatePlansService: UpdatePlansService,
    private readonly CreatePlansService: CreatePlansService,
  ) {}

  @Get()
  @ApiOperation({
    summary: "Listar planos",
  })
  public async get() {
    const plans = await this.GetPlanService.get();
    return {
      data: plans,
    };
  }
  @Get("/:id")
  @ApiOperation({
    summary: "Detalhes de um plano",
  })
  public async getById(@Param("id", new ParseUUIDPipe()) id: string) {
    const plan = await this.GetPlanService.getById(id);
    return {
      data: plan,
    };
  }

  @UseGuards(IsadminGuard)
  @UseGuards(IsActiveUser)
  @ApiOperation({
    summary: "Editar plano",
  })
  @Patch("/:id")
  public async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() data: PlanDTO,
  ) {
    const updated = await this.UpdatePlansService.handle({
      ...data,
      id,
    });
    return {
      data: updated,
    };
  }

  @UseGuards(IsadminGuard)
  @UseGuards(IsActiveUser)
  @ApiOperation({
    summary: "Criar plano",
  })
  @Post()
  public async create(@Body() data: PlanDTO) {
    const created = await this.CreatePlansService.handle(data);
    return {
      data: created,
    };
  }
}
