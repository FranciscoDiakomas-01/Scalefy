import { Plans } from "src/domains/entities/Plans";
import Subscriptions from "src/domains/entities/Subscription";

export interface IcreatedSubscription {
  subcription: Subscriptions;
  plan: Plans;
}

export interface SubscriptionStates {
  update(subscriptionId: string): Promise<ISubscriptionStateReturntype>;
}

export interface ISubscriptionStateReturntype {
  message: string;
}
