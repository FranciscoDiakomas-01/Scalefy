import { Module } from "@nestjs/common";
import CostumerModule from "../costumers/module";
import SubscriptionModule from "../subscriptions/module";
import ClickController from "./controller";
import PrismaClickRepositorie from "./repositories/implementation";
import GenerateClickService from "./services/createService";
import GetClickServices from "./services/getService";
import TrackersModule from "../trackers/module";

@Module({
  providers: [
    {
      provide: "IclickRepository",
      useClass: PrismaClickRepositorie,
    },
    GenerateClickService,
    GetClickServices,
  ],
  exports: [
    {
      provide: "IclickRepository",
      useClass: PrismaClickRepositorie,
    },
    GenerateClickService,
    GetClickServices,
  ],
  controllers: [ClickController],
  imports: [SubscriptionModule, CostumerModule, TrackersModule],
})
export default class ClickModule {}
