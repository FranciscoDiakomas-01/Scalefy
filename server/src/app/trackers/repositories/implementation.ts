import { Injectable } from "@nestjs/common";
import ITrackerRepositorie from "./absctration";
import { PrismaService } from "src/infra/Database/prisma";
import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import Trackers from "src/domains/entities/Tracker";
import TrackerDTO from "../dto/create";

@Injectable()
export default class PrismaTrackerRepositorie implements ITrackerRepositorie {
  constructor(private readonly provider: PrismaService) {}
  public async getByCampainId(campainId: string): Promise<Trackers[]> {
    return (await this.provider.trackers.findMany({
      where: {
        campainsId: campainId,
      },
      include: {
        _count: true,
      },
    })) as any;
  }
  public async toogle(status: boolean, id: string): Promise<Trackers | null> {
    return (await this.provider.trackers.update({
      where: {
        id,
      },
      data: {
        isActive: status,
      },
    })) as any;
  }
  public async create(data: TrackerDTO): Promise<Trackers> {
    return (await this.provider.trackers.create({
      data: {
        key: data.key,
        title: data.title,
        url: data.url,
        isActive: true,
        campainsId: data.campainsId,
      },
    })) as any as Trackers;
  }
  public async get(
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<Trackers>> {
    const { page, limit } = props;
    const offset = (page - 1) * limit;
    const [total, campains] = await Promise.all([
      this.provider.trackers.count(),
      this.provider.trackers.findMany({
        take: limit,
        skip: offset,
        include: {
          campain: {
            include: {
              user: {
                omit: {
                  password: true,
                },
              },
            },
          },
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
  public async getByid(id: string): Promise<Trackers | null> {
    return (await this.provider.trackers.findFirst({
      where: {
        OR: [
          {
            id,
          },
          {
            key: id,
          },
        ],
      },
      include: {
        campain: true,
      },
    })) as any;
  }
}
