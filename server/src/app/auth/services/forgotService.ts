import { InterService } from "src/core/types";
import ForgotDto from "../dto/forgot";
import type IAuthRepository from "../repositories/absractions";
import { Inject, Injectable } from "@nestjs/common";
import { RecoveryTokenService } from "./tokenService";
import CostumerNotFoundError from "src/app/costumers/error";
import EmailFactory from "src/infra/Emails/factory";
import { EMailProviders } from "src/infra/Emails/abstraction";

@Injectable()
export default class ForgotSerice implements InterService<ForgotDto, void> {
  constructor(
    @Inject("IAuthRepository")
    private readonly reporitorie: IAuthRepository,
    private readonly RecoveryTokenService: RecoveryTokenService,
    private readonly EmailFactory: EmailFactory,
  ) {}
  public async handle(props: ForgotDto): Promise<void> {
    const { email, metadata } = props;
    const emailService = this.EmailFactory.create(EMailProviders.RESEND);
    const fiveMinutes = 5 * 60 * 1000;
    const user = await this.reporitorie.login(email);
    if (!user) {
      throw new CostumerNotFoundError();
    }
    const token = this.RecoveryTokenService.gen({
      metadata,
      role: user.role,
      sub: user.id,
    });
    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    const recoverie = await this.reporitorie.forgot({
      expiredAt: new Date(Date.now() + fiveMinutes),
      token,
      userId: user.id,
      metadata: JSON.stringify(metadata) as any as Record<string, string>,
      isUsed: false,
    });

    await emailService.sendEmail({
      to: email,
      subject: "Recuperação de senha",
      body: `
        <p style="font-size: 16px; font-weight: bold;">Olá ${user.fullName},</p>
        <p style="font-size: 14px;">Recebemos uma solicitação para redefinir sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <a href="${link}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Redefinir Senha</a>
        <p style="font-size: 14px;">Este link é válido por 5 minutos.</p>
        <p style="font-size: 14px;">Se você não solicitou essa alteração, por favor ignore este email.</p>
        <p style="font-size: 14px;">Atenciosamente,</p>
        <p style="font-size: 14px;">Scalefy</p>
      `,
    });
  }
}
