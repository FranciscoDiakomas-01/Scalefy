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
    AuthModule,
    CoreModule,
    CostumerModule,
    SubscriptionModule,
    CampainsModule,
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
        path: "plans",
        method: RequestMethod.GET,
      })
      .forRoutes("*");
  }
}
