import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InterService } from "src/core/types";
import NoPermitionError from "src/core/error";
import Trackers from "src/domains/entities/Tracker";
import type ICampainRepositorie from "src/app/campains/repositories/absctration";
import type ITrackerRepository from "../repositories/absctration";
import { CampainNotFoundError } from "src/app/campains/error";

@Injectable()
export default class ToogleTrackerService implements InterService<
  { userId: string; campainId: string; trackerId: string },
  Trackers | null
> {
  constructor(
    @Inject("ICampainRepositorie")
    private readonly ICampainRepositorie: ICampainRepositorie,
    @Inject("ITrackerRepository")
    private readonly ITrackerRepository: ITrackerRepository,
  ) {}

  public async handle(props: {
    userId: string;
    campainId: string;
    trackerId: string;
  }): Promise<Trackers | null> {
    const { userId, campainId, trackerId } = props;

    const [tracker, campain] = await Promise.all([
      this.ITrackerRepository.getByid(trackerId),
      this.ICampainRepositorie.getById(campainId),
    ]);

    if (!tracker || !tracker.isActive) {
      throw new NotFoundException({
        message: "O trackerador precisa existir ou estar ativo",
      });
    }
    if (!campain) {
      throw new CampainNotFoundError();
    }
    if (!campain.isActive) {
      throw new BadRequestException({
        message: "A campanha precisa estar ativa",
      });
    }

    const canEdit = campain.userId === userId;
    if (!canEdit) {
      throw new NoPermitionError();
    }
    const editeTracker = await this.ITrackerRepository.toogle(
      tracker.isActive,
      trackerId,
    );
    return editeTracker;
  }
}
