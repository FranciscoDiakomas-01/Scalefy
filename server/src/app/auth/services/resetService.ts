import { InterService } from "src/core/types";
import ResetPasswordDto from "../dto/reset";
import type IAuthRepository from "../repositories/absractions";
import { RecoveryTokenService } from "./tokenService";
import EmailFactory from "src/infra/Emails/factory";
import { Inject, Injectable } from "@nestjs/common";
import { EMailProviders } from "src/infra/Emails/abstraction";
import CostumerNotFoundError from "src/app/costumers/error";
import { ISessionToken } from "../shared/types";
import { RecoveryAlreadyUsesError, RecoveryNotFoundError } from "../error";
import EncriptService from "./EncriptService";

@Injectable()
export default class ResetService implements InterService<
  ResetPasswordDto,
  void
> {
  constructor(
    @Inject("IAuthRepository")
    private readonly reporitorie: IAuthRepository,
    private readonly RecoveryTokenService: RecoveryTokenService,
    private readonly EmailFactory: EmailFactory,
    private readonly EncriptService: EncriptService,
  ) {}

  public async handle(props: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = props;
    const hashedPassowrd = this.EncriptService.encript(newPassword);
    const emailService = this.EmailFactory.create(EMailProviders.RESEND);
    const tokenData = this.RecoveryTokenService.verify<ISessionToken>(token);
    const [recoverie, user] = await Promise.all([
      this.reporitorie.getRecoveryByToken(token),
      this.reporitorie.getById(tokenData.sub),
    ]);
    if (!user) {
      throw new CostumerNotFoundError();
    }
    if (!recoverie) {
      throw new RecoveryNotFoundError();
    }
    if (recoverie.isUsed) {
      throw new RecoveryAlreadyUsesError();
    }
    await Promise.all([
      this.reporitorie.reset(user.id, hashedPassowrd),
      this.reporitorie.markAsUsed(token),
    ]);
    await emailService.sendEmail({
      to: user.email,
      subject: "Senha Redefinida com Sucesso",
      body: `
        <p style="font-size: 16px; font-weight: bold;">Olá ${user.fullName},</p>
        <p style="font-size: 14px;">Sua senha foi redefinida com sucesso. Se você não realizou essa alteração, por favor entre em contato conosco imediatamente.</p>
        <p style="font-size: 14px;">Atenciosamente,</p>
        <p style="font-size: 14px;">Scalefy</p>
      `,
    });
  }
}
