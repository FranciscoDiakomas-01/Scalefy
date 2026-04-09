import { Module } from "@nestjs/common";
import { SubscriptionCronService } from ".";

@Module({
  providers: [SubscriptionCronService],
})
export class CronJobModule {}
