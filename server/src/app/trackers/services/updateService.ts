import { Inject, Injectable } from "@nestjs/common";
import { InterService } from "src/core/types";
import CampainsDTO from "../dto/create";
import Campains from "src/domains/entities/Campaing";
import type ICampainRepositorie from "../repositories/absctration";
import { CampainNotFoundError } from "../error";
import NoPermitionError from "src/core/error";

@Injectable()
export default class UpdateCampainService implements InterService<
  CampainsDTO & { userId: string; campainId: string },
  Campains | null
> {
  constructor(
    @Inject("ICampainRepositorie")
    private readonly ICampainRepositorie: ICampainRepositorie,
  ) {}

  public async handle(
    props: CampainsDTO & { userId: string; campainId: string },
  ): Promise<Campains | null> {
    const { userId, ...data } = props;
    const existCampain = await this.ICampainRepositorie.getById(
      props.campainId,
    );
    if (!existCampain) {
      throw new CampainNotFoundError();
    }
    const canEdit = existCampain.userId === userId;
    if (!canEdit) {
      throw new NoPermitionError();
    }
    const campain = await this.ICampainRepositorie.update(data, userId);
    return campain;
  }
}
