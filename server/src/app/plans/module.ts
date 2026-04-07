import { Module } from "@nestjs/common";
import CostumerModule from "../costumers/module";
import PrismaPlansRepository from "./repositories/imlementation";
import GetPlanService from "./services/getService";
import UpdatePlansService from "./services/updateService,";
import CreatePlansService from "./services/createService";
import PlanController from "./controller";

@Module({
  providers: [
    {
      provide: "IPlansRepository",
      useClass: PrismaPlansRepository,
    },
    GetPlanService,
    UpdatePlansService,
    CreatePlansService,
  ],
  exports: [
    {
      provide: "IPlansRepository",
      useClass: PrismaPlansRepository,
    },
    GetPlanService,
    UpdatePlansService,
    CreatePlansService,
  ],
  controllers: [PlanController],
  imports: [CostumerModule],
})
export default class PlansModule {}
