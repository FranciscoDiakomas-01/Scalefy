import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { InterService } from "src/core/types";
import type ISubscriptionsRepository from "src/app/subscriptions/repositories/absctracions";
import { NotPlanAssociatedError } from "src/app/plans/error";
import { UserNotSubscribed } from "src/app/subscriptions/error";
import { SubscriptionStatus } from "src/domains/entities/Subscription";
import EventDTO from "../dto/create";
import Events from "src/domains/entities/Event";
import type IEventRepositorie from "../repositories/absctration";
import type IclickRepository from "src/app/clicks/repositories/absctration";

@Injectable()
export default class CreateEventService implements InterService<
  EventDTO,
  Events
> {
  constructor(
    @Inject("ISubscriptionsRepository")
    private readonly ISubscriptionsRepository: ISubscriptionsRepository,
    @Inject("IEventRepositorie")
    private readonly IEventRepositorie: IEventRepositorie,
    @Inject("IclickRepository")
    private readonly IclickRepository: IclickRepository,
  ) {}

  public async handle(props: EventDTO): Promise<Events> {
    const { clickId } = props;
    const [click, totalEvents] = await Promise.all([
      this.IclickRepository.getById(clickId),
      this.IEventRepositorie.countEvents(clickId),
    ]);
    if (!click) {
      throw new BadRequestException({
        message: "CLick não encontrado",
      });
    }
    const { tracker } = click;
    const { campain } = tracker;
    const [activeUserPlan] = await Promise.all([
      this.ISubscriptionsRepository.hasActiveSubscription(campain.userId),
    ]);
    if (!activeUserPlan) {
      throw new UserNotSubscribed();
    }
    if (!campain.isActive) {
      throw new BadRequestException({
        messaage: "A campanha precisa estar ativa",
      });
    }
    const isPendingPayment = activeUserPlan.mustPay && !activeUserPlan.paidAt;
    const isExpired = new Date() > new Date(activeUserPlan.expiresAt);
    const isInactive = activeUserPlan.status !== SubscriptionStatus.ACTIVE;
    if (isPendingPayment || isExpired || isInactive) {
      throw new NotPlanAssociatedError();
    }
    const Max_Events_Per_Click = 10;
    if (totalEvents >= Max_Events_Per_Click) {
      throw new BadRequestException({
        message: "O click ja atingiu o limite de eventos",
      });
    }
    const event = await this.IEventRepositorie.register(props);
    return event;
  }
}
