import { Injectable } from "@nestjs/common";
import { Plans } from "src/domains/entities/Plans";
import IPlansRepository from "./absctracions";
import { PrismaService } from "src/infra/Database/prisma";

@Injectable()
export default class PrismaPlansRepository implements IPlansRepository {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<Plans[]> {
    return (await this.prisma.plans.findMany()) as any;
  }

  async getById(id: string): Promise<Plans | null> {
    const plan = await this.prisma.plans.findFirst({
      where: { id },
    });
    return plan as Plans | null;
  }

  async create(props: Omit<Plans, "id">): Promise<Plans> {
    const plan = await this.prisma.plans.create({
      data: props,
    });
    return plan as any;
  }

  async update(id: string, props: Partial<Plans>): Promise<Plans | null> {
    return (await this.prisma.plans.update({
      where: { id },
      data: props,
    })) as any;
  }
}
