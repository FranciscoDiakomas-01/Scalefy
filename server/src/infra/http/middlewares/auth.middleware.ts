import {
  ForbiddenException,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { SessionTokenService } from "src/app/auth/services/tokenService";
import { ISessionToken } from "src/app/auth/shared/types";
import { generateMetadata } from "src/core/utils";

@Injectable()
export class AuthMidleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMidleware.name);
  constructor(private readonly SessionTokenService: SessionTokenService) {}
  public use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const fakeUserId = req.headers["x-userid"];
    const metadata = generateMetadata(req);
    this.logger.debug(metadata);
    if (fakeUserId) {
      throw new UnauthorizedException("Manipulação de id dectada");
    }
    if (!authHeader || authHeader.length < 2) {
      throw new ForbiddenException("Auth header não passado corretamente");
    }
    const [type, token] = authHeader.split(" ");
    if (!token) {
      throw new ForbiddenException("Token não informado");
    }
    const user = this.SessionTokenService.verify<ISessionToken>(token);
    req.headers["x-userid"] = user.sub;
    next();
  }
}
