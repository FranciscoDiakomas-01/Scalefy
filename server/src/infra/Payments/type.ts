import { Plans } from "src/domains/entities/Plans";
import { User } from "src/domains/entities/User";

export interface IGetawayReturnType {
  referenceId: string;
  entity: string;
  payLink: string;
  id: string;
  subtotal: number;
  total: number;
  tax: number;
  taxType: string;
}

export interface IGatewayPaymentService {
  pay(data: {
    plan: Plans;
    client: Omit<User, "password">;
  }): Promise<IGetawayReturnType>;
  getProviderName(): GetaWayProvider;
}

export enum GetaWayProvider {
  REFERENCE = "REFERENCE",
}

export enum GetawayPaymentStatus {
  PAID = "PAID",
  PENDING = "PENDING",
  FAILED = "FAILED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
