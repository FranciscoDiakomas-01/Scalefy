import { Body, Controller, Post, Req } from "@nestjs/common";
import LoginService from "./services/LoginService";
import LoginDto from "./dto/login";
import SignService from "./services/signService";
import RegisterDto from "./dto/register";
import { ApiOperation } from "@nestjs/swagger";
import ForgotSerice from "./services/forgotService";
import ForgotDto from "./dto/forgot";
import { generateMetadata } from "src/core/utils";
import type { Request } from "express";
import ResetService from "./services/resetService";
import ResetPasswordDto from "./dto/reset";

@Controller("auth")
export default class AuthController {
  constructor(
    private readonly LoginService: LoginService,
    private readonly SignService: SignService,
    private readonly ForgotSerice: ForgotSerice,
    private readonly ResetService: ResetService,
  ) {}

  @Post("/login")
  @ApiOperation({
    description: "Endpoint para login de usuário",
    summary: "Login de usuário",
  })
  public async login(@Body() data: LoginDto) {
    return await this.LoginService.handle(data);
  }

  @Post("/register")
  @ApiOperation({
    description: "Endpoint para registro de usuário",
    summary: "Registro de usuário",
  })
  public async register(@Body() data: RegisterDto) {
    return await this.SignService.handle(data);
  }

  @Post("/forgot")
  @ApiOperation({
    description: "Endpoint para recuperação de senha",
    summary: "Recuperação de senha",
  })
  public async forgot(@Body() data: ForgotDto, @Req() request: Request) {
    const metadata = generateMetadata(request);
    data.metadata = metadata;
    await this.ForgotSerice.handle(data);
    return {
      message:
        "Link de recuperação de senha enviado para o email, caso exista um usuário com esse email",
    };
  }
  @Post("/reset")
  @ApiOperation({
    description: "Endpoint para redefinição de senha",
    summary: "Redefinição de senha",
  })
  public async reset(@Body() data: ResetPasswordDto) {
    await this.ResetService.handle(data);
    return {
      message: "Senha redefinida com sucesso",
    };
  }
}
