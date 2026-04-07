import { PrismaService } from "src/infra/Database/prisma";
import IAuthRepository from "./absractions";
import { User } from "src/domains/entities/User";
import { ICreatableUser, IRecoveryCreatable } from "../shared/types";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthPrismaReporitorie implements IAuthRepository {
  constructor(private readonly provider: PrismaService) {}
  public async forgot(data: IRecoveryCreatable): Promise<void> {
    await this.provider.recoveries.create({
      data,
    });
  }
  public async login(email: string): Promise<User | null> {
    const user = await this.provider.users.findFirst({
      where: {
        email,
      },
    });
    return user as User | null;
  }
  public async getById(id: string): Promise<User | null> {
    const user = await this.provider.users.findFirst({
      where: {
        id,
      },
    });
    return user as User | null;
  }
  public async register(data: ICreatableUser): Promise<User> {
    const user = await this.provider.users.create({
      data,
    });
    return user as User;
  }
  public async reset(id: string, newPassword: string): Promise<void> {
    await this.provider.users.update({
      where: {
        id,
      },
      data: {
        password: newPassword,
      },
    });
  }
  public async markAsUsed(token: string): Promise<void> {
    return this.provider.recoveries
      .update({
        where: {
          token,
        },
        data: {
          isUsed: true,
          isExpired: true,
        },
      })
      .then(() => {});
  }
  public async getRecoveryByToken(
    token: string,
  ): Promise<IRecoveryCreatable | null> {
    const recovery = await this.provider.recoveries.findFirst({
      where: {
        token,
      },
    });
    return recovery as IRecoveryCreatable | null;
  }
}
