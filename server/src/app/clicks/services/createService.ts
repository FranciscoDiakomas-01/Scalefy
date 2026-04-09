import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InterService } from "src/core/types";
import Campains from "src/domains/entities/Campaing";
import type ISubscriptionsRepository from "src/app/subscriptions/repositories/absctracions";
import { NotPlanAssociatedError } from "src/app/plans/error";
import { UserNotSubscribed } from "src/app/subscriptions/error";
import { SubscriptionStatus } from "src/domains/entities/Subscription";
import type IclickRepository from "../repositories/absctration";
import type ITrackerRepository from "src/app/trackers/repositories/absctration";
import { generateMetadata } from "src/core/utils";
import { CreateClickDto } from "../dto/create";
import type { Request } from "express";
import Clicks from "src/domains/entities/Click";
import type IEventRepositorie from "src/app/events/repositories/absctration";
import { EventType, Paymethod } from "src/domains/entities/Event";

@Injectable()
export default class GenerateClickService implements InterService<
  CreateClickDto & { req: Request },
  Clicks
> {
  constructor(
    @Inject("ISubscriptionsRepository")
    private readonly ISubscriptionsRepository: ISubscriptionsRepository,
    @Inject("IclickRepository")
    private readonly IclickRepository: IclickRepository,
    @Inject("ITrackerRepository")
    private readonly ITrackerRepository: ITrackerRepository,
  ) {}

  public async handle(
    data: CreateClickDto & { req: Request },
  ): Promise<Clicks> {
    const { trackerId, req, ...trackerInfo } = data;
    const tracker = await this.ITrackerRepository.getByid(trackerId);
    const metadata = generateMetadata(req);
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
      trackerInfo,
    );
    return {
      ...click,
      clientData: JSON.parse(click.clientData as string),
      trackerData: JSON.parse(click.trackerData as string),
    } as any;
  }
}
