import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import { Plans } from "src/domains/entities/Plans";
import Subscriptions, {
  SubscriptionStatus,
} from "src/domains/entities/Subscription";
import { User } from "src/domains/entities/User";
import { GetaWayProvider, IGetawayReturnType } from "src/infra/Payments/type";

export default interface ISubscriptionsRepository {
  get(
    pagination: IPaginationProps,
  ): Promise<
    IPaginationReturnType<
      Subscriptions & { user: Omit<User, "password">; plans: Plans }
    >
  >;
  getById(
    id: string,
  ): Promise<
    (Subscriptions & { user: Omit<User, "password">; plans: Plans }) | null
  >;
  getByUserId(
    userId: string,
  ): Promise<IPaginationReturnType<Subscriptions & { plans: Plans }>>;
  create(data: {
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
  }): Promise<Subscriptions>;
  update(getawayId: string, status: SubscriptionStatus): Promise<void>;
  hasActiveSubscription(userId: string): Promise<Subscriptions | null>;
  markAsExpiredAlls(userId: string): Promise<void>;
  hasUsedaAnUnPaidPlan(userid: string): Promise<boolean>;
}
