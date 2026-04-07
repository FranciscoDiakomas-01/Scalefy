import { Inject, Injectable } from "@nestjs/common";
import { SessionTokenService } from "./tokenService";
import EncriptService from "./EncriptService";
import { InterService } from "src/core/types";
import { IAuthReturnType } from "../shared/types";
import RegisterDto from "../dto/register";
import type IAuthRepository from "../repositories/absractions";
import { CostumerAlreadyExistsError } from "src/app/costumers/error";

@Injectable()
export default class SignService implements InterService<
  RegisterDto,
  IAuthReturnType
> {
  constructor(
    @Inject("IAuthRepository") private authRepository: IAuthRepository,
    private readonly SessionTokenService: SessionTokenService,
    private readonly EncriptService: EncriptService,
  ) {}

  public async handle(props: RegisterDto): Promise<IAuthReturnType> {
    const { email, name, password } = props;
    const userExists = await this.authRepository.login(email);
    if (userExists) {
      throw new CostumerAlreadyExistsError();
    }
    const hashedPassword = this.EncriptService.encript(password);
    const user = await this.authRepository.register({
      email,
      fullName: name,
      password: hashedPassword,
    });
    const token = this.SessionTokenService.gen({
      role: user.role,
      sub: user.id,
    });
    const { password: _, ...restUser } = user;
    return {
      acesstoken: token,
      user: restUser,
      message: "Bem vindo ao clickUp",
    };
  }
}
