import { Module } from "@nestjs/common";
import { CreateSubscriptionService } from "./services/createUsecase";
import GetSubscriptionService from "./services/getUsecase";
import UpdateSubscriptionService from "./services/updateUseCase";
import SubcriptionController from "./controller";
import { PrismaSubscriptionsRepository } from "./repositories/implementation";
import CostumerModule from "../costumers/module";
import PlansModule from "../plans/module";

@Module({
  providers: [
    CreateSubscriptionService,
    GetSubscriptionService,
    UpdateSubscriptionService,
    {
      provide: "ISubscriptionsRepository",
      useClass: PrismaSubscriptionsRepository,
    },
  ],
  controllers: [SubcriptionController],
  imports: [CostumerModule, PlansModule],
})
export default class SubscriptionModule {}
