import { Inject, Injectable } from "@nestjs/common";
import { InterService } from "src/core/types";
import CampainsDTO from "../dto/create";
import Campains from "src/domains/entities/Campaing";
import type ISubscriptionsRepository from "src/app/subscriptions/repositories/absctracions";
import type ICampainRepositorie from "../repositories/absctration";
import { NotPlanAssociatedError } from "src/app/plans/error";
import { UserNotSubscribed } from "src/app/subscriptions/error";
import { SubscriptionStatus } from "src/domains/entities/Subscription";

@Injectable()
export default class CreateCampainService implements InterService<
  CampainsDTO & { userId: string },
  Campains
> {
  constructor(
    @Inject("ISubscriptionsRepository")
    private readonly ISubscriptionsRepository: ISubscriptionsRepository,
    @Inject("ICampainRepositorie")
    private readonly ICampainRepositorie: ICampainRepositorie,
  ) {}

  public async handle(
    props: CampainsDTO & { userId: string },
  ): Promise<Campains> {
    const { userId, ...data } = props;
    const [activeUserPlan] = await Promise.all([
      this.ISubscriptionsRepository.hasActiveSubscription(userId),
    ]);
    if (!activeUserPlan) {
      throw new UserNotSubscribed();
    }

    const isPendingPayment = activeUserPlan.mustPay && !activeUserPlan.paidAt;
    const isExpired = new Date() > new Date(activeUserPlan.expiresAt);
    const isInactive = activeUserPlan.status !== SubscriptionStatus.ACTIVE;
    if (isPendingPayment || isExpired || isInactive) {
      throw new NotPlanAssociatedError();
    }

    const campain = await this.ICampainRepositorie.create(data, userId);
    return campain;
  }
}
