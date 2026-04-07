import ISubscriptionsRepository from "../../repositories/absctracions";
import {
  ISubscriptionStateReturntype,
  SubscriptionStates,
} from "../../shared/type";

export default class PendingSubscriptionState implements SubscriptionStates {
  public async update(
    subscriptionId: string,
  ): Promise<ISubscriptionStateReturntype> {
    throw new Error("Metodo não implementado");
  }
}
