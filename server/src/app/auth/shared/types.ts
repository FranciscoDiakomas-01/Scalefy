import { User, UserRole } from "src/domains/entities/User";

export interface ICreatableUser {
  fullName: string;
  email: string;
  password: string;
}

export interface IRecoveryCreatable {
  userId: string;
  token: string;
  expiredAt: Date;
  metadata: Record<string, string | object | boolean | number>;
  isUsed: boolean;
}

export interface IAuthReturnType {
  user: Omit<User, "password">;
  acesstoken: string;
  message?: string;
}

export interface ISession {
  gen(payload: Record<string, any>): string;
  verify<T>(token: string): Promise<T>;
}

export interface ISessionToken {
  sub: string;
  role: UserRole;
  metadata?: Record<string, string>;
}
