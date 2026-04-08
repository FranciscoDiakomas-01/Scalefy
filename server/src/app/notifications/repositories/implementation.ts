import { Injectable } from "@nestjs/common";
import ICampainRepositorie from "./absctration";
import { PrismaService } from "src/infra/Database/prisma";
import Campains from "src/domains/entities/Campaing";
import CampainsDTO from "../dto/create";
import { IPaginationProps, IPaginationReturnType } from "src/core/types";

@Injectable()
export default class PrismaCampainRepositorie implements ICampainRepositorie {
  constructor(private readonly provider: PrismaService) {}

  public async count(): Promise<number> {
    return await this.provider.campains.count();
  }
  public async countByUserId(userId: string): Promise<number> {
    return await this.provider.campains.count({
      where: {
        userId,
      },
    });
  }
  public async create(data: CampainsDTO, userId: string): Promise<Campains> {
    return (await this.provider.campains.create({
      data: {
        funilUrl: data.funilUrl,
        title: data.title,
        investment: data.investment,
        userId,
      },
    })) as any as Campains;
  }
  public async get(
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<Campains>> {
    const { page, limit } = props;
    const offset = (page - 1) * limit;
    const [total, campains] = await Promise.all([
      this.count(),
      this.provider.campains.findMany({
        take: limit,
        skip: offset,
      }),
    ]);

    return {
      items: campains as any,
      lastPage: Math.ceil(total / limit),
      limit,
      page,
      total,
    };
  }
  public async getById(cmpainId: string): Promise<Campains | null> {
    return (await this.provider.campains.findFirst({
      where: {
        id: cmpainId,
      },

      include: {
        trackers: true,
        _count: true,
      },
    })) as any;
  }
  public async getByUser(
    userId: string,
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<Campains>> {
    const { page, limit } = props;
    const offset = (page - 1) * limit;
    const [total, campains] = await Promise.all([
      this.countByUserId(userId),
      this.provider.campains.findMany({
        take: limit,
        skip: offset,
        where: {
          userId,
        },
      }),
    ]);

    return {
      items: campains as any,
      lastPage: Math.ceil(total / limit),
      limit,
      page,
      total,
    };
  }
  public async update(data: CampainsDTO, id: string): Promise<Campains | null> {
    return (await this.provider.campains.update({
      where: {
        id,
      },
      data,
    })) as any;
  }
}
