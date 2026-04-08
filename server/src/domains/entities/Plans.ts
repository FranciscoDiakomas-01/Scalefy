export class Plans {
  id!: string;
  title!: string;
  description!: string | null;
  features!: string[];
  price!: number;
  duration!: PlanDurationType;
}

export enum PlanDurationType {
  DAYS = "DAYS",
  MONTH = "MONTH",
  YEARS = "YEARS",
}
