import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import CostumerNotFoundError, {
  CostumerHasNotPermitionError,
} from "src/app/costumers/error";
import { UserRole } from "src/domains/entities/User";
import { PrismaService } from "src/infra/Database/prisma";

@Injectable()
export default class IsadminGuard implements CanActivate {
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
    if (user.role != UserRole.ADMIN) {
      throw new CostumerHasNotPermitionError(UserRole.ADMIN);
    }
    return true;
  }
}
