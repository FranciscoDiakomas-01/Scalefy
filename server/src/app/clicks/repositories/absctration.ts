import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import Campains from "src/domains/entities/Campaing";
import CampainsDTO from "../dto/create";

export default interface ICampainRepositorie {
  getByUser(
    userId: string,
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<Campains>>;
  create(data: CampainsDTO, userId: string): Promise<Campains>;
  get(props: IPaginationProps): Promise<IPaginationReturnType<Campains>>;
  getById(cmpainId: string): Promise<Campains | null>;
  update(data: CampainsDTO, id: string): Promise<Campains | null>;
  countByUserId(userId: string): Promise<number>;
  count(): Promise<number>;
}
