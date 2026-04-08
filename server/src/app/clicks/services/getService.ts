import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IPaginationProps } from "src/core/types";
import NoPermitionError from "src/core/error";
import type IclickRepository from "../repositories/absctration";
import type ITrackerRepository from "src/app/trackers/repositories/absctration";

@Injectable()
export default class GetClickServices {
  constructor(
    @Inject("IclickRepository")
    private readonly IclickRepository: IclickRepository,
    @Inject("ITrackerRepository")
    private readonly ITrackerRepository: ITrackerRepository,
  ) {}

  public async get(trackerId: string, userId: string, props: IPaginationProps) {
    const tracker = await this.ITrackerRepository.getByid(trackerId);

    if (!tracker) {
      throw new NotFoundException({
        message: "Trackeador não enocntrado",
      });
    }

    const { campain } = tracker;

    if (campain.userId != userId) {
      throw new NoPermitionError();
    }
    const clicks = await this.IclickRepository.getClickByTrackerId(
      trackerId,
      props,
    );
    return {
      data: clicks,
    };
  }
}
