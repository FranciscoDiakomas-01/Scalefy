import { Global, Module } from "@nestjs/common";

import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";

import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);
  constructor() {
    super({
      log: ["error", "info", "query", "warn"],
    });
  }

  async onModuleInit() {
    this.logger.debug(`Connecting to Database`);
    await this.$connect();
    this.logger.debug(`Database Connected`);
  }

  async onModuleDestroy() {
    this.logger.debug(`Disconnecting Database`);
    await this.$disconnect();
    this.logger.debug(`Database Disconnected`);
  }
}

@Module({
  exports: [PrismaService],
  providers: [PrismaService],
})
@Global()
export class DatabaseModule {}
