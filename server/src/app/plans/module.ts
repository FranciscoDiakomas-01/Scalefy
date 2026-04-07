import { Module } from "@nestjs/common";
import CostumerModule from "../costumers/module";
import PrismaPlansRepository from "./repositories/imlementation";

@Module({
  providers: [
    {
      provide: "IPlansRepository",
      useClass: PrismaPlansRepository,
    },
  ],
  exports: [
    {
      provide: "IPlansRepository",
      useClass: PrismaPlansRepository,
    },
  ],
  controllers: [],
  imports: [CostumerModule],
})
export default class PlansModule {}
