import { Resend } from "resend";
import { IEMailService } from "../abstraction";
import { User } from "src/domains/entities/User";

export default class ResendService implements IEMailService {
  private resend: Resend;
  private readonly key = process.env.API_RESEND_KEY as string;
  constructor() {
    this.resend = new Resend(this.key);
  }
  public async sendEmail(data: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    const { error, data: emailData } = await this.resend.emails.send({
      from: "Scalefy <noreplay@nublapay.com>",
      to: [data.to],
      subject: data.subject,
      html: data.body,
    });

    if (error) {
      console.error(error);
      throw new Error("Failed to send email");
    }
  }

  public async sendWelcomeEmail(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
