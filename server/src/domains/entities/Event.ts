import Clicks from "./Click";
import Client from "./Client";
import CardItems from "./Product";

export default class Events {
  id!: string;
  clickId!: string;
  eventType!: EventType;
  amount!: number;
  createdAt!: Date;
  method!: Paymethod;
  client!: Client;
  products!: CardItems[];
  click!: Clicks;
}

export enum EventType {
  PURCHASE = "PURCHASE",
  PAGEVIEW = "PAGEVIEW",
  LEAD = "LEAD",
}

export enum Paymethod {
  CARD = "CARD",
  MOBILE = "MOBILE",
  LINK = "LINK",
  TRANSFER = "TRANSFER",
}
