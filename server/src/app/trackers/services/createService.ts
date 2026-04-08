import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InterService } from "src/core/types";
import type ISubscriptionsRepository from "src/app/subscriptions/repositories/absctracions";
import { NotPlanAssociatedError } from "src/app/plans/error";
import { UserNotSubscribed } from "src/app/subscriptions/error";
import { SubscriptionStatus } from "src/domains/entities/Subscription";
import type ITrackerRepository from "../repositories/absctration";
import TrackerDTO from "../dto/create";
import Trackers from "src/domains/entities/Tracker";
import type ICampainRepositorie from "src/app/campains/repositories/absctration";
import NoPermitionError from "src/core/error";
import { CampainNotFoundError } from "src/app/campains/error";

@Injectable()
export default class CreateTrackerService implements InterService<
  TrackerDTO & { userId: string },
  Trackers
> {
  constructor(
    @Inject("ISubscriptionsRepository")
    private readonly ISubscriptionsRepository: ISubscriptionsRepository,
    @Inject("ICampainRepositorie")
    private readonly ICampainRepositorie: ICampainRepositorie,
    @Inject("ITrackerRepository")
    private readonly ITrackerRepository: ITrackerRepository,
  ) {}

  public async handle(
    props: TrackerDTO & { userId: string },
  ): Promise<Trackers> {
    const { userId, ...data } = props;
    const [activeUserPlan, campain] = await Promise.all([
      this.ISubscriptionsRepository.hasActiveSubscription(userId),
      this.ICampainRepositorie.getById(data.campainsId),
    ]);
    if (!activeUserPlan) {
      throw new UserNotSubscribed();
    }

    if (!campain) {
      throw new CampainNotFoundError();
    }
    if (!campain.isActive) {
      throw new BadRequestException({
        message: "A campanha precisa estar ativa",
      });
    }
    const isPendingPayment = activeUserPlan.mustPay && !activeUserPlan.paidAt;
    const isExpired = new Date() > new Date(activeUserPlan.expiresAt);
    const isInactive = activeUserPlan.status !== SubscriptionStatus.ACTIVE;
    if (isPendingPayment || isExpired || isInactive) {
      throw new NotPlanAssociatedError();
    }
    const isMyCampain = campain.userId == userId;

    if (!isMyCampain) {
      throw new NoPermitionError();
    }
    const key = crypto.randomUUID();
    const url = new URL(campain.funilUrl);
    url.searchParams.set("trackerKey", key);
    const tracker = await this.ITrackerRepository.create({
      campainsId: campain.id,
      key,
      title: data.title,
      url: url.toString(),
    });

    return tracker;
  }
}
