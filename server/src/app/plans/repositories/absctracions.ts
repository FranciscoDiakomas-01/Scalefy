import { Plans } from "src/domains/entities/Plans";

export default interface IPlansRepository {
  get(): Promise<Plans[]>;
  getById(id: string): Promise<Plans | null>;
  create(props: Omit<Plans, "id">): Promise<Plans>;
  update(id: string, props: Partial<Plans>): Promise<Plans | null>;
}
