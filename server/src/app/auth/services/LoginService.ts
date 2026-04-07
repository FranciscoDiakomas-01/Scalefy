/* eslint-disable @typescript-eslint/no-unused-vars */
import { InterService } from "src/core/types";
import LoginDto from "../dto/login";
import { IAuthReturnType } from "../shared/types";
import type IAuthRepository from "../repositories/absractions";
import EncriptService from "./EncriptService";
import { SessionTokenService } from "./tokenService";
import { InvalidCredentialsError } from "../error";
import { CostumerInactiveError } from "src/app/costumers/error";
import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/domains/entities/User";

@Injectable()
export default class LoginService implements InterService<
  LoginDto,
  IAuthReturnType
> {
  constructor(
    @Inject("IAuthRepository")
    private readonly reporitorie: IAuthRepository,
    private readonly EncriptService: EncriptService,
    private readonly SessionTokenService: SessionTokenService,
  ) {}

  public async handle(props: LoginDto): Promise<IAuthReturnType> {
    const user = await this.reporitorie.login(props.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const isPasswordMatch = this.EncriptService.compare({
      hash: user.password,
      plainText: props.password,
    });

    if (!isPasswordMatch) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new CostumerInactiveError();
    }

    const token = this.SessionTokenService.gen({
      role: user.role,
      sub: user.id,
    });

    const { password, ...restUser } = user;
    return {
      acesstoken: token,
      user: restUser,
      message: "Bem vindo ao clickUp",
    };
  }
}
