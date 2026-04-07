import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import CostumerNotFoundError, {
  CostumerInactiveError,
} from "src/app/costumers/error";
import { PrismaService } from "src/infra/Database/prisma";

@Injectable()
export default class IsActiveUser implements CanActivate {
  constructor(private readonly repo: PrismaService) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const userId = request.headers["x-userid"] as string;
    console.log(request.headers);
    if (!userId) {
      throw new ForbiddenException(
        "Precisar estar logado para acesseder a este recurso",
      );
    }
    const user = await this.repo.users.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new CostumerNotFoundError();
    }
    if (!user.isActive) {
      throw new CostumerInactiveError();
    }
    return true;
  }
}
