import { Inject, Injectable } from "@nestjs/common";
import type { ICostumerRepostory } from "../repositories/abstraction";
import { IPaginationProps } from "src/core/types";
import CostumerNotFoundError from "../error";

@Injectable()
export default class GetCostumerService {
  constructor(
    @Inject("ICostumerRepostory")
    private readonly repositorie: ICostumerRepostory,
  ) {}

  public async getById(userId: string) {
    const userData = await this.repositorie.getById(userId);
    if (!userData) {
      throw new CostumerNotFoundError();
    }
    return userData;
  }

  public async getAll(props: IPaginationProps) {
    const data = await this.repositorie.get(props);
    return data;
  }
}
