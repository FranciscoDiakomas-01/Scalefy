import { Global, Module } from "@nestjs/common";
import EmailFactory from "src/infra/Emails/factory";

@Module({
  exports: [EmailFactory],
  providers: [EmailFactory],
})
@Global()
export class CoreModule {}
