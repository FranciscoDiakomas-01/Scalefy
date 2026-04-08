import { Module } from "@nestjs/common";
import CostumerModule from "../costumers/module";
import SubscriptionModule from "../subscriptions/module";
import GetEventsServices from "./services/getService";
import CreateEventService from "./services/createService";
import PrismaEventRepositorie from "./repositories/implementation";
import ClickModule from "../clicks/module";
import EventsController from "./controller";

@Module({
  providers: [
    {
      provide: "IEventRepositorie",
      useClass: PrismaEventRepositorie,
    },
    GetEventsServices,
    CreateEventService,
  ],
  exports: [
    {
      provide: "IEventRepositorie",
      useClass: PrismaEventRepositorie,
    },
    GetEventsServices,
    CreateEventService,
  ],
  controllers: [EventsController],
  imports: [SubscriptionModule, CostumerModule, ClickModule],
})
export default class EventModule {}
