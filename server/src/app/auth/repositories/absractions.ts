import { User } from "src/domains/entities/User";
import { ICreatableUser, IRecoveryCreatable } from "../shared/types";

export default interface IAuthRepository {
  login(email: string): Promise<User | null>;
  reset(id: string, newPassword: string): Promise<void>;
  forgot(data: IRecoveryCreatable): Promise<void>;
  register(data: ICreatableUser): Promise<User>;
  getById(id: string): Promise<User | null>;
  markAsUsed(token: string): Promise<void>;
  getRecoveryByToken(token: string): Promise<IRecoveryCreatable | null>;
}
