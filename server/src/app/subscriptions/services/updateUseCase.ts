import { InterService } from "src/core/types";
import type ISubscriptionsRepository from "../repositories/absctracions";
import { BadRequestException, Inject } from "@nestjs/common";
import { IPlinkPayResponse } from "src/infra/Payments/strategy/PlinkPay";
import { Record } from "@prisma/client/runtime/library";
import { GetawayPaymentStatus } from "src/infra/Payments/type";
import { SubscriptionStates } from "../shared/type";
import PaidSubscriptionState from "./states/Paid";
import FailedSubscriptionState from "./states/Failed";
import PendingSubscriptionState from "./states/Pending";
import EmailFactory from "src/infra/Emails/factory";
import { EMailProviders } from "src/infra/Emails/abstraction";

export default class UpdateSubscriptionService implements InterService<
  IPlinkPayResponse,
  void
> {
  private readonly StateService: Record<
    GetawayPaymentStatus,
    SubscriptionStates
  > | null = null;
  constructor(
    @Inject("ISubscriptionsRepository")
    private readonly repositorie: ISubscriptionsRepository,
    private readonly EmailFactory: EmailFactory,
  ) {
    const emailService = this.EmailFactory.create(EMailProviders.RESEND);
    this.StateService = {
      APPROVED: new PaidSubscriptionState(this.repositorie, emailService),
      FAILED: new FailedSubscriptionState(this.repositorie),
      PAID: new PaidSubscriptionState(this.repositorie, emailService),
      PENDING: new PendingSubscriptionState(),
      REJECTED: new FailedSubscriptionState(this.repositorie),
    };
  }
  public async handle(props: IPlinkPayResponse) {
    const strategy = this.getStateService(props.status);
    await strategy.update(props.id);
  }
  private getStateService(status: GetawayPaymentStatus): SubscriptionStates {
    if (!this.StateService) {
      throw new Error("Serviços de states não criados");
    }

    const state = this.StateService[status] ?? null;
    if (!state) {
      throw new BadRequestException("Serviço de state não implementado");
    }
    return state;
  }
}
