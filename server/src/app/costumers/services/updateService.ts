import { InterService } from "src/core/types";
import type { ICostumerRepostory } from "../repositories/abstraction";
import { Inject, Injectable } from "@nestjs/common";
import { IUpateUserProp } from "../shared/type";
import { User } from "src/domains/entities/User";

@Injectable()
export default class UpateUserService implements InterService<
  IUpateUserProp,
  Omit<User, "password">
> {
  constructor(
    @Inject("ICostumerRepostory")
    private readonly repositorie: ICostumerRepostory,
  ) {}
  public async handle(props: IUpateUserProp): Promise<Omit<User, "password">> {
    return await this.repositorie.update(props);
  }
}
