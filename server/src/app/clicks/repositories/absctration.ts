import { IPaginationProps, IPaginationReturnType } from "src/core/types";
import Clicks from "src/domains/entities/Click";

export default interface IclickRepository {
  genclick(
    trackerId: string,
    clientData: Record<string, any>,
    trackerData: Record<string, any>,
  ): Promise<Clicks>;
  getClickByTrackerId(
    trackerId: string,
    props: IPaginationProps,
  ): Promise<IPaginationReturnType<Clicks>>;
  getById(id: string): Promise<Clicks | null>;
}
