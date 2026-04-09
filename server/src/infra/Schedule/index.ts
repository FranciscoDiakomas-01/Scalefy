import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../Database/prisma";

@Injectable()
export class SubscriptionCronService implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionCronService.name);
  constructor(private readonly prisma: PrismaService) {}
  @Cron(CronExpression.EVERY_HOUR)
  async handleSubscriptions() {
    const now = new Date();
    this.logger.log("Running subscription expiration job...");
    const expired = await this.prisma.subscriptions.updateMany({
      where: {
        status: "ACTIVE",
        expiresAt: {
          lte: now,
        },
      },
      data: {
        status: "EXPIRED",
        isActive: false,
      },
    });
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    const canceled = await this.prisma.subscriptions.updateMany({
      where: {
        status: "PENDING",
        createdAt: {
          lte: fourHoursAgo,
        },
      },
      data: {
        status: "CANCELED",
        isActive: false,
      },
    });
    this.logger.log(`Expired: ${expired.count}, Canceled: ${canceled.count}`);
  }
  onModuleInit() {
    this.logger.debug("Cron Job started");
  }
}
