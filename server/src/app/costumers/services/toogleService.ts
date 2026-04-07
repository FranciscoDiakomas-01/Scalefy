import { InterService } from "src/core/types";
import type { ICostumerRepostory } from "../repositories/abstraction";
import { ToogleUserDTO } from "../dto/toogle";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export default class ToogleUserService implements InterService<
  ToogleUserDTO,
  { message: string }
> {
  constructor(
    @Inject("ICostumerRepostory")
    private readonly repositorie: ICostumerRepostory,
  ) {}
  public async handle(props: ToogleUserDTO): Promise<{ message: string }> {
    await this.repositorie.toggle(props.userId, props.status);
    return {
      message: "Estado do usuário alterado",
    };
  }
}
