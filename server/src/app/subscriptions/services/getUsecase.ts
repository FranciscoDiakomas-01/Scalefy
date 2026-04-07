import { Inject, Injectable } from "@nestjs/common";
import type ISubscriptionsRepository from "../repositories/absctracions";
import { IPaginationProps } from "src/core/types";
import { SubscriptionNotFoundError } from "../error";
import { UserRole } from "src/domains/entities/User";
import NoPermitionError from "src/core/error";
import type { ICostumerRepostory } from "src/app/costumers/repositories/abstraction";
import CostumerNotFoundError from "src/app/costumers/error";

@Injectable()
export default class GetSubscriptionService {
  constructor(
    @Inject("ISubscriptionsRepository")
    private readonly repositorie: ISubscriptionsRepository,
    @Inject("ICostumerRepostory")
    private readonly costumerReposiorie: ICostumerRepostory,
  ) {}

  public async getAll(props: IPaginationProps) {
    return await this.repositorie.get(props);
  }

  public async getMySubscriptions(userId: string) {
    return await this.repositorie.getByUserId(userId);
  }

  public async getDetails(id: string, userId: string) {
    const [subscription, costumer] = await Promise.all([
      this.repositorie.getById(id),
      this.costumerReposiorie.getById(userId),
    ]);
    if (!costumer) {
      throw new CostumerNotFoundError();
    }
    if (!subscription) {
      throw new SubscriptionNotFoundError();
    }
    const canShow =
      userId != subscription?.userId || costumer.user.role != UserRole.ADMIN;

    if (!canShow) {
      throw new NoPermitionError();
    }
    return subscription;
  }
}
