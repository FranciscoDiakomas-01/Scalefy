import { Injectable } from "@nestjs/common";
import { ICostumerRepostory } from "./abstraction";
import { PrismaService } from "src/infra/Database/prisma";
import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import { IGetUserReturnType, IUpateUserProp } from "../shared/type";
import { User } from "src/domains/entities/User";

@Injectable()
export class PrismaCostumerRepository implements ICostumerRepostory {
  constructor(private readonly provider: PrismaService) {}
  public async get(
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<IGetUserReturnType>> {
    const { page, limit } = props;
    const offset = (page - 1) * limit;
    const [total, costumers] = await Promise.all([
      this.provider.users.count(),
      this.provider.users.findMany({
        take: limit,
        skip: offset,
        include: {
          Subscriptions: {
            take: 1,
            orderBy: [
              {
                createdAt: "desc",
              },
            ],
            include: {
              plans: true,
            },
          },
        },
        omit: {
          password: true,
        },
      }),
    ]);

    const items = costumers.map((costumer) => {
      const subscriptionData = costumer?.Subscriptions?.[0];
      const { plans: plan, ...subscription } = subscriptionData || ({} as any);
      const { Subscriptions: _, ...user } = costumer;
      return {
        plan: plan ?? null,
        subscription: subscription ?? null,
        user,
      };
    });
    const lastPage = Math.ceil(total / limit);
    return {
      items: items as any as IGetUserReturnType[],
      lastPage,
      limit,
      page,
      total,
    };
  }
  public async getById(userId: string): Promise<IGetUserReturnType | null> {
    const costumer = await this.provider.users.findFirst({
      where: {
        id: userId,
      },
      include: {
        Subscriptions: {
          take: 1,
          orderBy: [
            {
              createdAt: "desc",
            },
          ],
          include: {
            plans: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });
    const subscriptionData = costumer?.Subscriptions?.[0];
    const { plans: plan, ...subscription } = subscriptionData || ({} as any);
    return {
      plan: plan ?? null,
      subscription: subscription ?? null,
      user: costumer as any as Omit<User, "password">,
    };
  }
  public async toggle(userId: string, status: boolean): Promise<void> {
    await this.provider.users.update({
      where: {
        id: userId,
      },
      data: {
        isActive: !status,
      },
    });
  }
  public async update(user: IUpateUserProp): Promise<Omit<User, "password">> {
    const updateduser = await this.provider.users.update({
      data: {
        email: user.email,
        fullName: user.name,
      },
      where: {
        id: user.userId,
      },
      omit: {
        password: true,
      },
    });
    return updateduser as Omit<User, "password">;
  }
}
