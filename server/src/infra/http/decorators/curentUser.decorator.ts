import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import CostumerNotFoundError from "src/app/costumers/error";

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const userId = request.headers["x-userid"] as string;

    if (!userId) {
      throw new CostumerNotFoundError();
    }
    return userId;
  },
);
