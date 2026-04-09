import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infra/Database/prisma";
import CampainsDTO from "../dto/create";
import IEventRepositorie from "./absctration";
import Events, { EventType } from "src/domains/entities/Event";

@Injectable()
export default class PrismaEventRepositorie implements IEventRepositorie {
  constructor(private readonly provider: PrismaService) {}
  public async getByClickId(clickId: string): Promise<Events[]> {
    const events = await this.provider.events.findMany({
      where: {
        clickId,
      },
      include: {
        client: true,
        products: true,
      },
    });

    return events as any;
  }
  public async register(data: CampainsDTO): Promise<Events> {
    const click = await this.provider.clicks.findUnique({
      where: {
        id: data.clickId,
      },
      include: {
        tracker: true,
      },
    });

    if (!click) {
      throw new Error("Click not found");
    }
    const { tracker } = click;
    const { client, products, eventType } = data;
    const amount = Number(data.amount) || 0;
    const event = await this.provider.events.create({
      data: {
        amount,
        clickId: data.clickId,
        eventType,
        method: data.method,

        client: {
          create: {
            email: client.email,
            name: client.name,
            phone: client.phone,
          },
        },

        products: {
          create: products.map((item) => ({
            price: Number(item.price),
            title: item.title,
            description: item?.description,
          })),
        },
      },
    });
    const isPurchase = eventType === EventType.PURCHASE;
    const isLead = eventType === EventType.LEAD;
    const isPageView = eventType === EventType.PAGEVIEW;
    const totalPageViews = isPageView
      ? tracker.totalPageViews + 1
      : tracker.totalPageViews;
    const totalPurchases = isPurchase
      ? tracker.totalPurchases + 1
      : tracker.totalPurchases;
    const totalLeaeds = isLead ? tracker.totalLeaeds + 1 : tracker.totalLeaeds;
    const totalEarned = isPurchase
      ? Number(tracker.totalEarned) + amount
      : Number(tracker.totalEarned);

    await this.provider.trackers.update({
      where: {
        id: tracker.id,
      },
      data: {
        totalPageViews,
        totalPurchases,
        totalLeaeds,
        totalEarned: totalEarned.toFixed(2),
        campain: {
          update: {
            totalEarned,
            totalPageViews,
            totalPurchases,
            totalLeaeds,
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
