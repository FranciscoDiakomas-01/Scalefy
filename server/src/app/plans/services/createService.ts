import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InterService } from "src/core/types";
import type IPlansRepository from "../repositories/absctracions";
import { Plans } from "src/domains/entities/Plans";
import PlanDTO from "../dto/create";

@Injectable()
export default class CreatePlansService implements InterService<
  PlanDTO,
  Plans
> {
  constructor(
    @Inject("IPlansRepository") private readonly repositorie: IPlansRepository,
  ) {}
  public async handle(props: PlanDTO): Promise<Plans> {
    try {
      const newPlan = await this.repositorie.create(props);
      return newPlan;
    } catch (error) {
      throw new BadRequestException({
        message: "Erro ao registrar plano",
        errors: ["um plano com o mesmo nome já existe"],
      });
    }
  }
}
