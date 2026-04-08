import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/Database/prisma";
import CampainsDTO from "../dto/create";
import IEventRepositorie from "./absctration";
import Events, { EventType } from "src/domains/entities/Event";
import Clicks from "src/domains/entities/Click";

@Injectable()
export default class PrismaEventRepositorie implements IEventRepositorie {
  constructor(private readonly provider: PrismaService) {}
  public async getByClickId(clickId: string): Promise<Events[]> {
    const events = await this.provider.events.findMany({
      where: {
        clickId,
      },
    });

    return events as any;
  }
  public async register(data: CampainsDTO): Promise<Events> {
    const clik = (await this.provider.clicks.findFirst({
      where: {
        id: data.clickId,
      },

      include: {
        tracker: {
          include: {
            campain: true,
          },
        },
      },
    })) as any as Clicks;
    const { tracker } = clik;
    const { client, products, eventType } = data;
    const event = await this.provider.events.create({
      data: {
        amount: Number(data.amount),
        clickId: data.clickId,
        eventType: data.eventType,
        method: data.method,
        client: {
          create: {
            email: client.email,
            name: client.name,
            phone: client.phone,
          },
        },
        products: {
          create: products.map((item) => {
            return {
              price: item.price,
              title: item.title,
              description: item?.description,
            };
          }),
        },
      },
    });
    await this.provider.clicks.update({
      where: {
        id: event.clickId,
      },
      data: {
        tracker: {
          update: {
            totalPageViews:
              eventType === EventType.PAGEVIEW
                ? tracker.totalPageViews + 1
                : tracker.totalPageViews,

            totalPurchases:
              eventType === EventType.PURCHASE
                ? tracker.totalPurchases + 1
                : tracker.totalPurchases,

            totalLeaeds:
              eventType === EventType.LEAD
                ? tracker.totalLeaeds + 1
                : tracker.totalLeaeds,

            totalEarned:
              eventType === EventType.PURCHASE
                ? tracker.totalEarned + data.amount
                : tracker.totalEarned,
          },
        },
      },
    });
    return event as any;
  }
  public async countEvents(clickId: string): Promise<number> {
    return await this.provider.events.count({
      where: {
        clickId,
      },
    });
  }
}
