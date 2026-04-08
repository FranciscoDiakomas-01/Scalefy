import { Module } from "@nestjs/common";
import CostumerModule from "../costumers/module";
import PrismaTrackerRepositorie from "./repositories/implementation";
import SubscriptionModule from "../subscriptions/module";
import CampainsModule from "../campains/module";
import CreateTrackerService from "./services/createService";
import GetTrackerServices from "./services/getService";
import ToogleTrackerService from "./services/toogleService";
import TrackersController from "./controller";

@Module({
  providers: [
    {
      provide: "ITrackerRepository",
      useClass: PrismaTrackerRepositorie,
    },
    CreateTrackerService,
    ToogleTrackerService,
    GetTrackerServices,
  ],
  exports: [
    {
      provide: "ITrackerRepository",
      useClass: PrismaTrackerRepositorie,
    },
    CreateTrackerService,
    ToogleTrackerService,
    GetTrackerServices,
  ],
  controllers: [TrackersController],
  imports: [SubscriptionModule, CostumerModule, CampainsModule],
})
export default class TrackersModule {}
