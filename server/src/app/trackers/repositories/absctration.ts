import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import Trackers from "src/domains/entities/Tracker";
import TrackerDTO from "../dto/create";

export default interface ITrackerRepository {
  getByCampainId(campainId: string): Promise<Trackers[]>;
  create(data: TrackerDTO): Promise<Trackers>;
  get(props: IPaginationProps): Promise<IPaginationReturnType<Trackers>>;
  toogle(status: boolean, id: string): Promise<Trackers | null>;
  getByid(id: string): Promise<Trackers | null>;
}
