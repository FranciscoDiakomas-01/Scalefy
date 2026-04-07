import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InterService } from "src/core/types";
import type IPlansRepository from "../repositories/absctracions";
import { Plans } from "src/domains/entities/Plans";
import PlanDTO from "../dto/create";
import PlanNotFoundError from "../error";

@Injectable()
export default class UpdatePlansService implements InterService<
  PlanDTO & { id: string },
  Plans
> {
  constructor(
    @Inject("IPlansRepository") private readonly repositorie: IPlansRepository,
  ) {}
  public async handle(props: PlanDTO & { id: string }): Promise<Plans> {
    const [plans, currenPlan] = await Promise.all([
      this.repositorie.get(),
      this.repositorie.getById(props.id),
    ]);

    if (!currenPlan) {
      throw new PlanNotFoundError();
    }
    plans.forEach((plan) => {
      if (plan.price == props.price || props.title == plan.title) {
        throw new BadRequestException({
          message: "Ja existe um plano com este nome ou preço",
        });
      }
    });

    await this.repositorie.update(props.id, props);
    return currenPlan;
  }
}
