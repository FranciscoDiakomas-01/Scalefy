import { SubscriptionStatus } from "src/domains/entities/Subscription";
import ISubscriptionsRepository from "../../repositories/absctracions";
import {
  ISubscriptionStateReturntype,
  SubscriptionStates,
} from "../../shared/type";
import { BadRequestException } from "@nestjs/common";
import { IEMailService } from "src/infra/Emails/abstraction";
import { Plans } from "src/domains/entities/Plans";
import { User } from "src/domains/entities/User";
import { SubscriptionNotFoundError } from "../../error";

export default class PaidSubscriptionState implements SubscriptionStates {
  constructor(
    private readonly repositorie: ISubscriptionsRepository,
    private readonly emailService: IEMailService,
  ) {}

  public async update(
    subscriptionId: string,
  ): Promise<ISubscriptionStateReturntype> {
    const subscription = await this.repositorie.getById(subscriptionId);

    if (!subscription) {
      throw new SubscriptionNotFoundError();
    }
    const { plans, user } = subscription as {
      plans: Plans;
      user: Omit<User, "pasword">;
    };
    if (!subscription.mustPay) {
      throw new BadRequestException({
        message: "Essa subscrição não pode ser paga",
      });
    }
    if (subscription.status != SubscriptionStatus.PENDING) {
      throw new BadRequestException({
        message: "Subscrição precisa ser estar para ser aprovada",
      });
    }
    await this.repositorie.update(subscriptionId, SubscriptionStatus.ACTIVE);
    await this.emailService.sendEmail({
      subject: "Confirmação de pagamento",
      to: subscription.user.email,
      body: `
      <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          
          <!-- Header -->
          <div style="background:#4f46e5; padding:20px; text-align:center; color:#fff;">
            <h1 style="margin:0; font-size:20px;">Pagamento Confirmado</h1>
          </div>

          <!-- Body -->
          <div style="padding:20px; color:#333;">
            <p>Olá, <strong>${user.fullName || "Usuário"}</strong></p>

            <p>Seu pagamento foi confirmado com sucesso 🎉</p>

            <div style="background:#f9fafb; padding:15px; border-radius:6px; margin:20px 0;">
              <p style="margin:5px 0;"><strong>Plano:</strong> ${plans.title}</p>
              <p style="margin:5px 0;"><strong>Valor:</strong> ${plans.price} Kz</p>
              <p style="margin:5px 0;"><strong>Validade:</strong> ${new Date(subscription.expiresAt).toLocaleDateString()}</p>
            </div>
            <p>Agora você já pode aproveitar todos os benefícios do seu plano.</p>
            <div style="text-align:center; margin:30px 0;">
              <a href="https://teusite.com/dashboard" 
                style="background:#4f46e5; color:#fff; padding:12px 20px; text-decoration:none; border-radius:6px; display:inline-block;">
                Acessar minha conta
              </a>
            </div>
            <p style="font-size:12px; color:#888;">
              Se você não realizou este pagamento, entre em contato com o suporte imediatamente.
            </p>
          </div>
          <!-- Footer -->
          <div style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#999;">
            © ${new Date().getFullYear()} PlinkPay. Todos os direitos reservados.
          </div>
        </div>
      </div>
      `,
    });
    return {
      message: "Subscrição confirmada",
    };
  }
}
