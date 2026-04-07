import { Inject, Injectable } from "@nestjs/common";
import type IPlansRepository from "../repositories/absctracions";

@Injectable()
export default class GetPlanService {
  constructor(
    @Inject("IPlansRepository") private readonly repositorie: IPlansRepository,
  ) {}

  public async get() {
    return await this.repositorie.get();
  }

  public async getById(planId: string) {
    return await this.repositorie.getById(planId);
  }
}
