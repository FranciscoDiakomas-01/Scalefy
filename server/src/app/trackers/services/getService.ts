import { Inject, Injectable } from "@nestjs/common";
import type ISubscriptionsRepository from "src/app/subscriptions/repositories/absctracions";
import type ICampainRepositorie from "../repositories/absctration";
import { IPaginationProps } from "src/core/types";
import type { ICostumerRepostory } from "src/app/costumers/repositories/abstraction";
import CostumerNotFoundError from "src/app/costumers/error";
import { CampainNotFoundError } from "../error";
import { UserRole } from "src/domains/entities/User";
import NoPermitionError from "src/core/error";

@Injectable()
export default class GetCampainService {
  constructor(
    @Inject("ICampainRepositorie")
    private readonly ICampainRepositorie: ICampainRepositorie,
    @Inject("ICostumerRepostory")
    private readonly ICostumerRepostory: ICostumerRepostory,
  ) {}

  public async getByUserId(props: IPaginationProps, userId: string) {
    const campains = await this.ICampainRepositorie.getByUser(userId, props);
    return {
      data: campains,
    };
  }

  public async get(props: IPaginationProps) {
    const campains = await this.ICampainRepositorie.get(props);
    return {
      data: campains,
    };
  }

  public async getDetails(campainId: string, userId: string) {
    const [campain, user] = await Promise.all([
      this.ICampainRepositorie.getById(campainId),
      this.ICostumerRepostory.getById(userId),
    ]);

    if (!user || !user?.user) {
      throw new CostumerNotFoundError();
    }
    if (!campain) {
      throw new CampainNotFoundError();
    }
    const canShow =
      user.user?.id == campain.userId || user.user?.role != UserRole.ADMIN;

    if (!canShow) {
      throw new NoPermitionError();
    }

    return {
      data: campain,
    };
  }

  public async countByUserId(userId: string) {
    const count = await this.ICampainRepositorie.countByUserId(userId);
    return {
      data: count,
    };
  }
  public async count() {
    const count = await this.ICampainRepositorie.count();
    return {
      data: count,
    };
  }
}
