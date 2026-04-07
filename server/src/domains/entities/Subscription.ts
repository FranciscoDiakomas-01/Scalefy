import { Plans } from "@prisma/client";
import { User } from "./User";
import { GetaWayProvider } from "src/infra/Payments/type";

export default class Subscriptions {
  id!: string;
  isActive!: boolean;
  planId!: string;
  userId!: string;
  status!: SubscriptionStatus;
  paidAt!: Date | null;
  mustPay!: boolean;
  expiresAt!: Date;
  paylink?: string;
  refernece!: string;
  entity!: string;
  user!: User;
  plans!: Plans;
  provider!: GetaWayProvider;
  getawayId!: string;
  createdAt!: Date;
  subtotal!: number;
  total!: number;
  tax!: number;
  taxType!: string;
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELED = "CANCELED",
  PENDING = "PENDING",
}
