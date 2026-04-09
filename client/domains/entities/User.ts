export type User = {
  id: string;
  isActive: boolean;
  role: UserRole;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updated: Date | null;
};

export enum UserRole {
  ADMIN = "ADMIN",
  COSTUMER = "COSTUMER",
}
