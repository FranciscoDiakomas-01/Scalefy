import { SubscriptionStatus } from "src/domains/entities/Subscription";
import ISubscriptionsRepository from "../../repositories/absctracions";
import {
  ISubscriptionStateReturntype,
  SubscriptionStates,
} from "../../shared/type";
import { IEMailService } from "src/infra/Emails/abstraction";
import { Plans } from "src/domains/entities/Plans";
import { User } from "src/domains/entities/User";

export default class ExpiredubscriptionState implements SubscriptionStates {
  constructor(
    private readonly repositorie: ISubscriptionsRepository,
    private readonly emailService: IEMailService,
  ) {}

  public async update(
    subscriptionId: string,
  ): Promise<ISubscriptionStateReturntype> {
    const subscription = await this.repositorie.getById(subscriptionId);
    if (!subscription) {
      return {
        message: "Subscrição não encontrada",
      };
    }
    const { plans, user } = subscription as {
      plans: Plans;
      user: Omit<User, "pasword">;
    };
    const now = new Date();
    if (subscription.expiresAt > now) {
      return {
        message: "Subscrição ainda ativa",
      };
    }
    await this.repositorie.update(subscriptionId, SubscriptionStatus.EXPIRED);
    await this.emailService.sendEmail({
      subject: "Expiração de plano",
      to: subscription.user.email,
      body: `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
  <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px;">
    
    <div style="background:#ef4444; padding:20px; text-align:center; color:#fff;">
      <h1 style="margin:0;">Plano Expirado</h1>
    </div>

    <div style="padding:20px; color:#333;">
      <p>Olá, <strong>${user.fullName || "Usuário"}</strong></p>

      <p>Seu plano <strong>${plans.title}</strong> expirou em 
      <strong>${new Date(subscription.expiresAt).toLocaleDateString()}</strong>.</p>

      <p>Para continuar usando os recursos, renove sua assinatura.</p>

      <div style="text-align:center; margin:30px 0;">
        <a href="https://teusite.com/upgrade" 
          style="background:#ef4444; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px;">
          Renovar plano
        </a>
      </div>
    </div>

    <div style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#999;">
      © ${new Date().getFullYear()} PlinkPay
    </div>

  </div>
</div>
      `,
    });
    return {
      message: "Expiração de plan",
    };
  }
}
