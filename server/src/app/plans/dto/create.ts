import { PlanDurationType } from "src/domains/entities/Plans";

export default class PlanDTO {
  title!: string;
  description!: string;
  features!: string[];
  price!: number;
  duration!: PlanDurationType;
  maxCapains!: number;
  maxTrackers!: number;
}
