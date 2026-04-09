import { Plans } from "src/domains/entities/Plans";
import {
  GetawayPaymentStatus,
  GetaWayProvider,
  IGatewayPaymentService,
  IGetawayReturnType,
} from "../type";
import { User } from "src/domains/entities/User";
import { BadRequestException, Logger } from "@nestjs/common";

export default class PlinkPay implements IGatewayPaymentService {
  private readonly apiKey: string = process.env.PLINKPAY_API_KEY!;
  private readonly apiUrl: string = "https://api.plinqpay.com/v1/transaction";
  private readonly callbackUrl: string = "https://meusite.com/webhook";
  private readonly logger = new Logger(PlinkPay.name);

  constructor() {
    if (!this.apiKey) {
      throw new Error(
        "PLINKPAY_API_KEY is not defined in environment variables",
      );
    }
  }
  async pay(data: { plan: Plans; client: User }): Promise<IGetawayReturnType> {
    const { plan, client } = data;
    const id = crypto.randomUUID();
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.apiKey,
      },
      body: JSON.stringify({
        externalId: id,
        callbackUrl: this.callbackUrl,
        method: "REFERENCE",
        client: {
          name: client.fullName,
          email: client.email,
          phone: "+244957777993",
        },
        items: [
          {
            title: plan.title,
            price: Number(plan.price),
            quantity: 1,
          },
        ],
        amount: Number(plan.price),
      }),
    });
    const apiResponse = await response.json();
    const dataResponse: IPlinkPayResponse = apiResponse?.data;
    if (!dataResponse?.entity) {
      this.logger.error(dataResponse);
      throw new BadRequestException(dataResponse);
    }
    return {
      referenceId: dataResponse.reference,
      entity: dataResponse.entity,
      payLink: "https://pay.plinqpay.com/" + dataResponse.id,
      id: dataResponse.id,
      subtotal: dataResponse.subtotal,
      tax: dataResponse.tax,
      taxType: dataResponse.taxType,
      total: dataResponse.total,
    };
  }
  public getProviderName(): GetaWayProvider {
    return GetaWayProvider.REFERENCE;
  }
}

export interface IPlinkPayResponse {
  id: string;
  externalId: string;
  companieId: string;
  externId: string;
  getawayIdentifier: string;
  status: GetawayPaymentStatus;
  amount: number;
  subtotal: number;
  tax: number;
  total: number;
  taxType: "FIXED";
  method: "REFERENCE";
  currency: "AOA";
  signature: string;
  entity: string;
  reference: string;
  callbackUrl: string;
  paidAt: null | Date;
  failureReason: null;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    transactionId: string;
    externalId: string;
    name: string;
    email: string;
    phone: string;
    createdAt: Date;
    updatedAt: Date;
  };
  items: IPlinCardType[];
}

interface IPlinCardType {
  id: string;
  transactionId: string;
  title: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
