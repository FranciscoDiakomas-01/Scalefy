import jwt from "jsonwebtoken";
import { ISession, ISessionToken } from "../shared/types";
import { Injectable } from "@nestjs/common";
import { TokenExpiredError } from "../error";

@Injectable()
export class SessionTokenService implements ISession {
  private readonly secret = process.env.SECRET_KEY!;

  public gen(payload: ISessionToken): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "30d",
    });
  }

  public verify<ISessionToken>(token: string) {
    try {
      return jwt.verify(token, this.secret) as ISessionToken;
    } catch (error) {
      throw new TokenExpiredError();
    }
  }
}

@Injectable()
export class RecoveryTokenService implements ISession {
  private readonly secret = process.env.SECRET_KEY_RESET!;

  public gen(payload: Required<ISessionToken>): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "5m",
    });
  }

  public verify<ISessionToken>(token: string) {
    try {
      return jwt.verify(token, this.secret) as ISessionToken;
    } catch (error) {
      throw new TokenExpiredError();
    }
  }
}
