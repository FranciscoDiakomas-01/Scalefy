import { HttpException, Injectable } from "@nestjs/common";
import PlinkPay from "./strategy/PlinkPay";
import { GetaWayProvider, IGatewayPaymentService } from "./type";

@Injectable()
export default class PaymentFactory {
  private readonly paymentServices: Map<
    GetaWayProvider,
    IGatewayPaymentService
  > = new Map();

  constructor() {
    const plinkPayService = new PlinkPay();
    this.paymentServices.set(
      plinkPayService.getProviderName(),
      plinkPayService,
    );
  }
  public create(provider: GetaWayProvider): IGatewayPaymentService {
    const service = this.paymentServices.get(provider as GetaWayProvider);
    if (!service) {
      throw new HttpException("Unsupported payment provider", 404);
    }
    return service;
  }
}
