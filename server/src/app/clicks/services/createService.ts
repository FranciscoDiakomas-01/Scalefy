import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InterService } from "src/core/types";
import Campains from "src/domains/entities/Campaing";
import type ISubscriptionsRepository from "src/app/subscriptions/repositories/absctracions";
import { NotPlanAssociatedError } from "src/app/plans/error";
import { UserNotSubscribed } from "src/app/subscriptions/error";
import { SubscriptionStatus } from "src/domains/entities/Subscription";
import type IclickRepository from "../repositories/absctration";
import type ITrackerRepository from "src/app/trackers/repositories/absctration";
import type { Request } from "express";
import { detectTrafficSource, generateMetadata } from "src/core/utils";

@Injectable()
export default class GenerateClickService implements InterService<
  { req: Request; key: string },
  Campains
> {
  constructor(
    @Inject("ISubscriptionsRepository")
    private readonly ISubscriptionsRepository: ISubscriptionsRepository,
    @Inject("IclickRepository")
    private readonly IclickRepository: IclickRepository,
    @Inject("ITrackerRepository")
    private readonly ITrackerRepository: ITrackerRepository,
  ) {}

  public async handle(data: { req: Request; key: string }): Promise<Campains> {
    const { key, req } = data;
    const tracker = await this.ITrackerRepository.getByid(key);
    const metadata = generateMetadata(req);
    const traffic = detectTrafficSource(req);

    if (!tracker) {
      throw new NotFoundException({
        message: "Trackeador não encontrado",
      });
    }
    const { campain } = tracker;
    const [activeUserPlan] = await Promise.all([
      this.ISubscriptionsRepository.hasActiveSubscription(campain.userId),
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
    const click = await this.IclickRepository.genclick(
      tracker.id,
      metadata,
      traffic,
    );
    return click as any;
  }
}
