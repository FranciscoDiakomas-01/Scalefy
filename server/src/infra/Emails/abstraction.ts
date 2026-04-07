import { User } from "src/domains/entities/User";

export interface IEMailService {
  sendEmail(data: { to: string; subject: string; body: string }): Promise<void>;
  sendWelcomeEmail(user: User): Promise<void>;
}

export enum EMailProviders {
  RESEND = "RESEND",
}
