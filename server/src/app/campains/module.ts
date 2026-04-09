import { Module } from "@nestjs/common";
import CostumerModule from "../costumers/module";
import CreateCampainService from "./services/createService";
import UpdateCampainService from "./services/updateService";
import GetCampainService from "./services/getService";
import PrismaCampainRepositorie from "./repositories/implementation";
import SubscriptionModule from "../subscriptions/module";
import CampainsController from "./controller";
import ToogleCampainService from "./services/toogleService";

@Module({
  providers: [
    {
      provide: "ICampainRepositorie",
      useClass: PrismaCampainRepositorie,
    },
    CreateCampainService,
    UpdateCampainService,
    ToogleCampainService,
    GetCampainService,
  ],
  exports: [
    {
      provide: "ICampainRepositorie",
      useClass: PrismaCampainRepositorie,
    },
    CreateCampainService,
    UpdateCampainService,
    GetCampainService,
    ToogleCampainService,
  ],
  controllers: [CampainsController],
  imports: [SubscriptionModule, CostumerModule],
})
export default class CampainsModule {}
