import { Module } from "@nestjs/common";
import LoginService from "./services/LoginService";
import EncriptService from "./services/EncriptService";
import {
  RecoveryTokenService,
  SessionTokenService,
} from "./services/tokenService";
import { DatabaseModule } from "src/infra/Database/prisma";
import { AuthPrismaReporitorie } from "./repositories/emplementtions";
import AuthController from "./controller";
import SignService from "./services/signService";
import ForgotSerice from "./services/forgotService";
import ResetService from "./services/resetService";

@Module({
  imports: [DatabaseModule],
  providers: [
    LoginService,
    EncriptService,
    SessionTokenService,
    RecoveryTokenService,
    ForgotSerice,
    SignService,
    ResetService,
    {
      provide: "IAuthRepository",
      useClass: AuthPrismaReporitorie,
    },
  ],
  controllers: [AuthController],
  exports: [SessionTokenService],
})
export default class AuthModule {}
