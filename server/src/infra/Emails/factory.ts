import { Injectable } from "@nestjs/common";
import { EMailProviders, IEMailService } from "./abstraction";
import ResendEmailService from "./strategy/ResendEmailService";

@Injectable()
export default class EmailFactory {
  private readonly EMailServiceRecord: Record<
    EMailProviders,
    new () => IEMailService
  > = {
    [EMailProviders.RESEND]: ResendEmailService,
  };

  public create(provider: EMailProviders): IEMailService {
    const ServiceClass = this.EMailServiceRecord[provider];
    if (!ServiceClass) {
      throw new Error(`Email provider ${provider} not found.`);
    }
    return new ServiceClass();
  }
}
