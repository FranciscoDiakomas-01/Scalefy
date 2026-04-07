import RegisterDto from "src/app/auth/dto/register";
import { Plans } from "src/domains/entities/Plans";
import Subscriptions from "src/domains/entities/Subscription";
import { User } from "src/domains/entities/User";

export interface IGetUserReturnType {
  user: Omit<User, "password">;
  subscription: Subscriptions;
  plan: Plans;
}

export interface IUpateUserProp {
  userId: string;
  email: string;
  name: string;
}
