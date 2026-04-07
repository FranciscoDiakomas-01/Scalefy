import { SubscriptionStatus } from "src/domains/entities/Subscription";
import { SubscriptionNotFoundError } from "../../error";
import ISubscriptionsRepository from "../../repositories/absctracions";
import {
  ISubscriptionStateReturntype,
  SubscriptionStates,
} from "../../shared/type";
import { BadRequestException } from "@nestjs/common";

export default class FailedSubscriptionState implements SubscriptionStates {
  constructor(private readonly repositorie: ISubscriptionsRepository) {}

  public async update(
    subscriptionId: string,
  ): Promise<ISubscriptionStateReturntype> {
    const subscription = await this.repositorie.getById(subscriptionId);
    if (!subscription) {
      throw new SubscriptionNotFoundError();
    }
    if (subscription.status != SubscriptionStatus.PENDING) {
      throw new BadRequestException({
        message: "Subscrição precisa ser estar para ser cancelada",
      });
    }
    await this.repositorie.update(subscriptionId, SubscriptionStatus.CANCELED);
    return {
      message: "Subscrição confirmada",
    };
  }
}
