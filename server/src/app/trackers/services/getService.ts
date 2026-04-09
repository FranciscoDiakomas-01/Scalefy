import { Inject, Injectable } from "@nestjs/common";
import { IPaginationProps } from "src/core/types";
import type { ICostumerRepostory } from "src/app/costumers/repositories/abstraction";
import CostumerNotFoundError from "src/app/costumers/error";
import { UserRole } from "src/domains/entities/User";
import NoPermitionError from "src/core/error";
import type ITrackerRepository from "../repositories/absctration";
import type ICampainRepositorie from "src/app/campains/repositories/absctration";
import { CampainNotFoundError } from "src/app/campains/error";

@Injectable()
export default class GetTrackerServices {
  constructor(
    @Inject("ICampainRepositorie")
    private readonly ICampainRepositorie: ICampainRepositorie,
    @Inject("ICostumerRepostory")
    private readonly ICostumerRepostory: ICostumerRepostory,
    @Inject("ITrackerRepository")
    private readonly ITrackerRepository: ITrackerRepository,
  ) {}

  public async get(props: IPaginationProps) {
    const trackers = await this.ITrackerRepository.get(props);
    return {
      data: trackers,
    };
  }

  public async getDetails(campainId: string, userId: string) {
    const [campain, user, trackers] = await Promise.all([
      this.ICampainRepositorie.getById(campainId),
      this.ICostumerRepostory.getById(userId),
      this.ITrackerRepository.getByCampainId(campainId),
    ]);

    if (!user || !user?.user) {
      throw new CostumerNotFoundError();
    }
    if (!campain) {
      throw new CampainNotFoundError();
    }
    const canShow =
      user.user?.id == campain.userId || user.user?.role != UserRole.ADMIN;

    if (!canShow) {
      throw new NoPermitionError();
    }
    return {
      campain,
    };
  }
}
