import { PrismaService } from "src/infra/Database/prisma";
import ISubscriptionsRepository from "./absctracions";
import { Injectable } from "@nestjs/common";
import Subscriptions, {
  SubscriptionStatus,
} from "src/domains/entities/Subscription";
import { Plans } from "src/domains/entities/Plans";
import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import { User } from "src/domains/entities/User";
import { GetaWayProvider } from "src/infra/Payments/type";

@Injectable()
export class PrismaSubscriptionsRepository implements ISubscriptionsRepository {
  constructor(private readonly provider: PrismaService) {}
  public async getById(
    id: string,
  ): Promise<(Subscriptions & { user: User; plans: Plans }) | null> {
    const subscription = await this.provider.subscriptions.findUnique({
      where: { id },
      include: {
        user: {
          omit: {
            password: true,
          },
        },
        plans: true,
      },
    });
    return subscription as
      | (Subscriptions & { user: User; plans: Plans })
      | null;
  }
  public async create(data: {
    props: {
      planId: string;
      userId: string;
      status: SubscriptionStatus;
      paidAt: Date | null;
      mustPay: boolean;
      expiresAt: Date;
      provider: GetaWayProvider;
      getawayId: string;
      paylink: string;
      refernece: string;
      entity: string;
      subtotal: number;
      total: number;
      tax: number;
      taxType: string;
    };
  }): Promise<Subscriptions> {
    const { props } = data;
    const subscription = await this.provider.subscriptions.create({
      data: {
        planId: props.planId,
        refernece: props.refernece,
        entity: props.entity,
        getawayId: props.getawayId,
        expiresAt: props.expiresAt,
        mustPay: props.mustPay,
        paidAt: props.paidAt,
        status: props.status,
        userId: props.userId,
        provider: "REFERENCE",
        paylink: props.paylink,
        subtotal: props.subtotal,
        total: props.total,
        tax: props.tax,
        taxType: props.taxType,
      },
    });
    return subscription as any as Subscriptions;
  }
  async update(getawayId: string, status: SubscriptionStatus): Promise<void> {
    await this.provider.subscriptions.update({
      where: {
        getawayId,
      },
      data: {
        status,
        paidAt: status === SubscriptionStatus.ACTIVE ? new Date() : undefined,
      },
    });
  }
  async getByUserId(
    userId: string,
  ): Promise<IPaginationReturnType<Subscriptions & { plans: Plans }>> {
    const subscriptions = await this.provider.subscriptions.findMany({
      where: { userId },
      include: {
        plans: true,
      },
    });
    return {
      items: subscriptions as any as (Subscriptions & { plans: Plans })[],
      total: subscriptions.length,
      lastPage: 1,
      limit: subscriptions.length,
      page: 1,
    };
  }
  public async get(
    props: IPaginationProps,
  ): Promise<
    IPaginationReturnType<
      Subscriptions & { user: Omit<User, "password">; plans: Plans }
    >
  > {
    const { page, limit } = props;
    const offset = (page - 1) * limit;
    const [subscriptions, total] = await this.provider.$transaction([
      this.provider.subscriptions.findMany({
        skip: offset,
        take: limit,
        include: {
          user: {
            omit: {
              password: true,
            },
          },
          plans: true,
        },
      }),
      this.provider.subscriptions.count(),
    ]);

    type ReturnType = Subscriptions & {
      user: Omit<User, "password">;
      plans: Plans;
    };
    return {
      items: subscriptions as any as ReturnType[],
      total,
      lastPage: Math.ceil(total / limit),
      limit,
      page,
    };
  }
  public async hasActiveSubscription(userId: string) {
    const existingSubscription = await this.provider.subscriptions.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
    });
    return existingSubscription as any as Subscriptions;
  }
  public async markAsExpiredAlls(userId: string): Promise<void> {
    await this.provider.subscriptions.updateMany({
      where: {
        userId,
      },
      data: {
        status: "EXPIRED",
      },
    });
  }
  public async hasUsedaAnUnPaidPlan(userId: string): Promise<boolean> {
    const unpaidSubscription = await this.provider.subscriptions.findFirst({
      where: {
        userId,
        mustPay: false,
      },
    });
    return unpaidSubscription ? true : false;
  }
}
