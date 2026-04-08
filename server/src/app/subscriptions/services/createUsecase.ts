import { InterService } from "src/core/types";
import { CreateSubscriptionDto } from "../dto/create";
import { Inject, Injectable } from "@nestjs/common";
import PaymentFactory from "src/infra/Payments/factory";
import {
  GetaWayProvider,
  IGatewayPaymentService,
  IGetawayReturnType,
} from "src/infra/Payments/type";
import { IcreatedSubscription } from "../shared/type";
import type IPlansRepository from "src/app/plans/repositories/absctracions";
import type ISubscriptionsRepository from "../repositories/absctracions";
import type { ICostumerRepostory } from "src/app/costumers/repositories/abstraction";
import CostumerNotFoundError from "src/app/costumers/error";
import PlanNotFoundError, {
  UserAlreadySubscribed,
  UserAlreayUsedUnPaidSubscriptionError,
} from "../error";
import { PlanDurationType } from "src/domains/entities/Plans";
import { SubscriptionStatus } from "src/domains/entities/Subscription";

@Injectable()
export class CreateSubscriptionService implements InterService<
  CreateSubscriptionDto,
  IcreatedSubscription
> {
  constructor(
    @Inject("IPlansRepository")
    private readonly plansRepositorie: IPlansRepository,
    @Inject("ISubscriptionsRepository")
    private readonly repositorie: ISubscriptionsRepository,
    @Inject("ICostumerRepostory")
    private readonly costumerReposiorie: ICostumerRepostory,
  ) {}

  public async handle(
    props: CreateSubscriptionDto,
  ): Promise<IcreatedSubscription> {
    const { method, planId, userId } = props;
    const paymentStrategy = this.setStategy(method);
    const [costumer, plan, existingSubscription, hasUsedaAnUnPaidPlan] =
      await Promise.all([
        this.costumerReposiorie.getById(userId),
        this.plansRepositorie.getById(planId),
        this.repositorie.hasActiveSubscription(userId),
        this.repositorie.hasUsedaAnUnPaidPlan(userId),
      ]);
    if (existingSubscription) {
      throw new UserAlreadySubscribed();
    }
    if (!costumer) {
      throw new CostumerNotFoundError();
    }
    if (!plan) {
      throw new PlanNotFoundError();
    }
    if (hasUsedaAnUnPaidPlan) {
      throw new UserAlreayUsedUnPaidSubscriptionError();
    }
    await this.repositorie.markAsExpiredAlls(userId);
    const mustPay = plan.price > 0;
    const expiresAt = this.getExpiration(plan.duration);

    let getawayData: IGetawayReturnType = {
      entity: crypto.randomUUID(),
      id: crypto.randomUUID(),
      payLink: crypto.randomUUID(),
      referenceId: crypto.randomUUID(),
      subtotal: plan.price,
      tax: 0,
      taxType: "NONE",
      total: plan.price,
    };

    if (mustPay) {
      getawayData = await paymentStrategy.pay({
        client: costumer.user,
        plan,
      });
    }
    const subcription = await this.repositorie.create({
      props: {
        entity: getawayData.entity,
        expiresAt,
        getawayId: getawayData.id,
        status: mustPay
          ? SubscriptionStatus.PENDING
          : SubscriptionStatus.ACTIVE,
        mustPay,
        provider: paymentStrategy.getProviderName(),
        planId: plan.id,
        refernece: getawayData.referenceId,
        userId: userId,
        paidAt: mustPay ? null : new Date(),
        paylink: getawayData.payLink,
        subtotal: Number(getawayData.subtotal),
        total: Number(getawayData.total),
        tax: Number(getawayData.tax),
        taxType: getawayData.taxType,
      },
    });
    return {
      plan,
      subcription,
    };
  }

  private setStategy(method: GetaWayProvider): IGatewayPaymentService {
    return new PaymentFactory().create(method);
  }

  private getExpiration(duration: PlanDurationType): Date {
    const expiresAt = new Date();
    switch (duration) {
      case "DAYS":
        expiresAt.setDate(expiresAt.getDate() + 7);
        break;
      case "MONTH":
        expiresAt.setMonth(expiresAt.getMonth() + 1);
        break;
      case "YEARS":
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        break;
    }
    return expiresAt;
  }
}
