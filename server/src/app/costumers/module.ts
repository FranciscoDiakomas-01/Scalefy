import { Module } from "@nestjs/common";
import GetCostumerService from "./services/getService";
import ToogleUserService from "./services/toogleService";
import UpateUserService from "./services/updateService";
import { PrismaCostumerRepository } from "./repositories/implementation";
import { CostumerController } from "./controller";

@Module({
  controllers: [CostumerController],
  providers: [
    GetCostumerService,
    ToogleUserService,
    UpateUserService,
    {
      provide: "ICostumerRepostory",
      useClass: PrismaCostumerRepository,
    },
  ],
  exports: [
    GetCostumerService,
    ToogleUserService,
    UpateUserService,
    {
      provide: "ICostumerRepostory",
      useClass: PrismaCostumerRepository,
    },
  ],
})
export default class CostumerModule {}
