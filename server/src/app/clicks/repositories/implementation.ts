import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/Database/prisma";
import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import IclickRepository from "./absctration";
import Clicks from "src/domains/entities/Click";

@Injectable()
export default class PrismaClickRepositorie implements IclickRepository {
  constructor(private readonly provider: PrismaService) {}
  public async genclick(
    trackerId: string,
    clientData: Record<string, any>,
    trackerData: Record<string, any>,
  ): Promise<Clicks> {
    const click = await this.provider.clicks.create({
      data: {
        clientData: JSON.stringify(clientData),
        trackerData: JSON.stringify(trackerData),
        trackerId: trackerId,
      },
    });
    await this.provider.trackers.update({
      where: {
        id: trackerId,
      },
      data: {
        campain: {
          update: {
            totalClicks: {
              increment: 1,
            },
          },
        },
        totalClicks: {
          increment: 1,
        },
        totalPageViews: {
          increment: 1,
        },
      },
    });
    return click as Clicks;
  }
  public async getClickByTrackerId(
    trackerId: string,
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<Clicks>> {
    const { page, limit } = props;
    const offset = (page - 1) * limit;
    const [total, clicks] = await Promise.all([
      this.provider.clicks.count({
        where: {
          trackerId,
        },
      }),
      this.provider.clicks.findMany({
        take: limit,
        skip: offset,
        where: {
          trackerId,
        },
      }),
    ]);
    return {
      items: clicks as any,
      total,
      lastPage: Math.ceil(total / limit),
      limit,
      page,
    };
  }

  public async getById(id: string): Promise<Clicks | null> {
    return (await this.provider.clicks.findFirst({
      where: {
        id,
      },
      include: {
        tracker: {
          include: {
            campain: true,
          },
        },
      },
    })) as any;
  }
}
