import { Plans, Subscriptions } from "@prisma/client";
import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import { User } from "src/domains/entities/User";
import { IGetUserReturnType, IUpateUserProp } from "../shared/type";

export interface ICostumerRepostory {
  getById(userId: string): Promise<IGetUserReturnType | null>;
  get(
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<IGetUserReturnType>>;
  update(user: IUpateUserProp): Promise<Omit<User, "password">>;
  toggle(userId: string, status: boolean): Promise<void>;
}
