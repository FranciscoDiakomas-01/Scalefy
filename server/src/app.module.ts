import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { DatabaseModule } from "./infra/Database/prisma";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule } from "@nestjs/throttler";
import AuthModule from "./app/auth/module";
import { CoreModule } from "./core/module";
import CostumerModule from "./app/costumers/module";
import { AuthMidleware } from "./infra/http/middlewares/auth.middleware";
import SubscriptionModule from "./app/subscriptions/module";
import CampainsModule from "./app/campains/module";
import TrackersModule from "./app/trackers/module";
import ClickModule from "./app/clicks/module";
import EventModule from "./app/events/module";
import { ScheduleModule } from "@nestjs/schedule";
import { CronJobModule } from "./infra/Schedule/module";

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    CoreModule,
    CostumerModule,
    SubscriptionModule,
    CampainsModule,
    TrackersModule,
    ClickModule,
    EventModule,
    CronJobModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMidleware)
      .exclude({
        path: "auth/(.*)",
        method: RequestMethod.ALL,
      })
      .exclude({
        path: "subscription/update",
        method: RequestMethod.POST,
      })
      .exclude({
        path: "plans/(.*)",
        method: RequestMethod.GET,
      })
      .exclude({
        path: "clicks/(.*)",
        method: RequestMethod.POST,
      })
      .exclude({
        path: "plans",
        method: RequestMethod.GET,
      })
      .exclude({
        path: "events",
        method: RequestMethod.POST,
      })
      .forRoutes("*");
  }
}
